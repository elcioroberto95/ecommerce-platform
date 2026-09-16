type QueryValue = string | number | boolean | undefined

/**
 * Server components run inside the container, so they reach the API over the
 * Docker network. NEXT_PUBLIC_API_URL is the browser-facing URL (host port
 * mapping) and would point at nothing from here.
 */
const SERVER_API_URL =
  process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1'

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function buildQuery(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      search.set(key, String(value))
    }
  }

  const query = search.toString()
  return query ? `?${query}` : ''
}

/**
 * Reads the backend during server rendering. Prices and stock change per
 * request, so nothing is cached: `no-store` also opts the route out of static
 * generation, which is what we want for a catalog this size.
 */
export async function serverFetch<T>(
  path: string,
  params: Record<string, QueryValue> = {}
): Promise<T> {
  const response = await fetch(`${SERVER_API_URL}${path}${buildQuery(params)}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new ApiError(response.status, `GET ${path} responded ${response.status}`)
  }

  return (await response.json()) as T
}
