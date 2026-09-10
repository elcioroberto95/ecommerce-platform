import { NextResponse } from 'next/server'

// Liveness for the load balancer: answers from the Next process itself and
// never calls the API, so a slow backend cannot get the frontend restarted.
export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'frontend',
    timestamp: new Date().toISOString(),
  })
}
