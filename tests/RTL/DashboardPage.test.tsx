import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DashboardPage from '@/app/[locale]/(private)/dashboard/page'
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

describe('Dashboard Page', () => {
  const mockPush = vi.fn()
  const mockRefresh = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useRouter as any).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    })
    
    // Define document.cookie setter/getter
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: 'auth_token=mock_value',
    })
  })

  it('renders the dashboard layout', async () => {
    await act(async () => {
      render(
        <React.Suspense fallback="loading">
          <DashboardPage params={Promise.resolve({ locale: 'en' })} />
        </React.Suspense>
      )
    })
    
    // Wait for the 'use(params)' resolution
    expect(await screen.findByText('OdontoFlow Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Protected Area')).toBeInTheDocument()
    expect(screen.getByTestId('mock-theme-toggle')).toBeInTheDocument()
  })

  it('handles logout correctly', async () => {
    await act(async () => {
      render(
        <React.Suspense fallback="loading">
          <DashboardPage params={Promise.resolve({ locale: 'pt-BR' })} />
        </React.Suspense>
      )
    })
    
    const logoutBtn = await screen.findByRole('button', { name: 'Logout' })
    fireEvent.click(logoutBtn)
    
    expect(document.cookie).toContain('auth_token=;')
    expect(mockRefresh).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/pt-BR/login')
  })
})
