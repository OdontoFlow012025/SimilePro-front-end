import { describe, it, expect, vi } from 'vitest'
import { middleware } from '@/middleware'
import { NextRequest } from 'next/server'

// Mock next-i18n-router
vi.mock('next-i18n-router', () => ({
  i18nRouter: vi.fn()
}))

describe('Middleware', () => {
  it('allows public paths without auth', () => {
    const req = new NextRequest('http://localhost:3000/en/login')
    const res = middleware(req)
    // The middleware delegates to i18nRouter for public paths
    expect(res).toBeUndefined() // Since we mocked i18nRouter without a return value
  })

  it('redirects private paths to login if no auth_token', () => {
    const req = new NextRequest('http://localhost:3000/en/dashboard')
    const res = middleware(req)
    
    // It should return a NextResponse.redirect
    expect(res?.status).toBe(307)
    expect(res?.headers.get('location')).toBe('http://localhost:3000/en/login')
  })

  it('redirects login to dashboard if auth_token is present', () => {
    const req = new NextRequest('http://localhost:3000/en/login')
    // simulate cookie
    req.cookies.set('auth_token', 'test_token')
    
    const res = middleware(req)
    expect(res?.status).toBe(307)
    expect(res?.headers.get('location')).toBe('http://localhost:3000/en/dashboard')
  })
})
