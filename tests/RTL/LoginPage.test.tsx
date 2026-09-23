import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginPage from '@/app/[locale]/(public)/login/page'
import { useRouter } from 'next/navigation'
import React from 'react'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

// Mock ThemeToggle
vi.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => <button data-testid="mock-theme-toggle">Theme</button>
}))

describe('Login Page', () => {
  const mockPush = vi.fn()
  const mockRefresh = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useRouter as any).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    })
  })

  it('renders the login page layout', async () => {
    await act(async () => {
      render(
        <React.Suspense fallback="loading">
          <LoginPage params={Promise.resolve({ locale: 'en' })} />
        </React.Suspense>
      )
    })
    
    expect(await screen.findByText('Access OdontoFlow')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In (Mock)' })).toBeInTheDocument()
    expect(screen.getByText('Back to Home')).toBeInTheDocument()
  })

  it('handles login and redirects to dashboard', async () => {
    await act(async () => {
      render(
        <React.Suspense fallback="loading">
          <LoginPage params={Promise.resolve({ locale: 'es' })} />
        </React.Suspense>
      )
    })
    
    const signInBtn = await screen.findByRole('button', { name: 'Sign In (Mock)' })
    fireEvent.click(signInBtn)
    
    expect(document.cookie).toContain('auth_token=true')
    expect(mockRefresh).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/es/dashboard')
  })
})
