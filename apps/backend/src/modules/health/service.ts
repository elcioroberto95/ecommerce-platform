import { uptime } from 'process';
import { env } from '../../config/env';
import { queryOne } from '../../shared/database/pool';

/**
 * A dependency check that hangs is worse than one that fails: the load
 * balancer would wait for its own timeout before drawing any conclusion.
 */
const DEPENDENCY_TIMEOUT_MS = 2000;

export type CheckStatus = 'ok' | 'error';

export interface DependencyCheck {
  status: CheckStatus;
  latencyMs: number;
  error?: string;
}

function withTimeout<T>(work: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    work,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

export class HealthService {
  /**
   * Liveness: is the process up? Deliberately touches nothing, because this is
   * what the load balancer polls. A check that queries the database turns a
   * slow database into a restart loop that takes the whole service down.
   */
  execute() {
    return {
      status: 'ok',
      service: 'backend',
      environment: env.NODE_ENV,
      uptime: uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Readiness: can this instance actually serve traffic? Used by deploys and
   * by a human asking "what is broken?" - never as the load balancer's
   * kill switch.
   */
  async ready() {
    const database = await this.checkDatabase();
    const healthy = database.status === 'ok';

    return {
      healthy,
      body: {
        status: healthy ? 'ok' : 'degraded',
        service: 'backend',
        checks: { database },
        timestamp: new Date().toISOString(),
      },
    };
  }

  private async checkDatabase(): Promise<DependencyCheck> {
    const startedAt = Date.now();

    try {
      await withTimeout(queryOne('SELECT 1 AS ok'), DEPENDENCY_TIMEOUT_MS);
      return { status: 'ok', latencyMs: Date.now() - startedAt };
    } catch (error) {
      return {
        status: 'error',
        latencyMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
