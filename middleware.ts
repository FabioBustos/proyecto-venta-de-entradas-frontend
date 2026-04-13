import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const start = performance.now()
  const { method, url, headers, geo } = request

  const requestId = crypto.randomUUID().slice(0, 8)
  const ip = headers.get('x-forwarded-for')?.split(',')[0] || 
             headers.get('cf-connecting-ip') || 
             'unknown'
  const userAgent = headers.get('user-agent') || 'unknown'
  const pathname = new URL(url).pathname

  console.log(`
┌─────────────────────────────────────────────────────────────
│ ${new Date().toISOString()}
│ Request: [${requestId}] ${method} ${pathname}
│ IP: ${ip}
│ User-Agent: ${userAgent.slice(0, 50)}...
└─────────────────────────────────────────────────────────────`)

  const response = NextResponse.next()

  response.headers.set('x-request-id', requestId)

  const duration = performance.now() - start
  
  response.headers.set('x-response-time', `${duration.toFixed(2)}ms`)

  console.log(`
┌─────────────────────────────────────────────────────────────
│ ${new Date().toISOString()}
│ Response: [${requestId}] ${method} ${pathname}
│ Status: ${response.status}
│ Duration: ${duration.toFixed(2)}ms
└─────────────────────────────────────────────────────────────`)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
}
