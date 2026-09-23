import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import RootLayout from '@/app/[locale]/layout'
import React from 'react'

// Mock next/font/google
vi.mock('next/font/google', () => ({
  Manrope: () => ({ className: 'mock-manrope' })
}))

// Mock ScrollToTop
vi.mock('@/components/ScrollToTop', () => ({
  default: () => <div data-testid="scroll-to-top" />
}))

describe('RootLayout', () => {
  it('renders children and wrappers correctly', async () => {
    let container: any;
    
    await act(async () => {
      const LayoutComponent = await RootLayout({ 
        children: <div data-testid="layout-child">Child Application Content</div>, 
        params: Promise.resolve({ locale: 'pt-BR' }) 
      })
      const result = render(LayoutComponent)
      container = result.container
    })

    expect(screen.getByTestId('layout-child')).toBeInTheDocument()
    expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument()
    // It should have the lang attribute correctly passed
    expect(document.documentElement).toHaveAttribute('lang', 'pt-BR')
  })
})
