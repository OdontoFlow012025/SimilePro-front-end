import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LandingPage from '@/app/[locale]/page'
import React from 'react'

// Mock getDictionary to avoid server-only issues and provide deterministic data
vi.mock('@/utils/get-dictionary', () => ({
  getDictionary: vi.fn().mockResolvedValue({
    navbar: { features: 'Nav' },
    hero: { titlePrefix: 'Hero Title' },
    stats: { clinics: 'Stats Clinics' },
    features: { title: 'Feat Title' },
    roles: { title: 'Roles Title' },
    testimonials: { title: 'Testimonials Title' },
    cta: { title: 'CTA Title' },
    footer: { description: 'Footer Desc' }
  })
}))

// Mock components to avoid deep rendering issues, we just want to know if the page assembles them
vi.mock('@/components/Navbar', () => ({ default: () => <div data-testid="navbar" /> }))
vi.mock('@/components/Hero', () => ({ default: () => <div data-testid="hero" /> }))
vi.mock('@/components/Stats', () => ({ default: () => <div data-testid="stats" /> }))
vi.mock('@/components/Features', () => ({ default: () => <div data-testid="features" /> }))
vi.mock('@/components/RoleSection', () => ({ default: () => <div data-testid="role-section" /> }))
vi.mock('@/components/Testimonials', () => ({ default: () => <div data-testid="testimonials" /> }))
vi.mock('@/components/CTABanner', () => ({ default: () => <div data-testid="cta-banner" /> }))
vi.mock('@/components/Footer', () => ({ default: () => <div data-testid="footer" /> }))

describe('Landing Page', () => {
  it('renders all section components correctly', async () => {
    // Next.js app router async page component requires special handling in testing
    // We can resolve it by awaiting the component function itself or wrapping in Suspense.
    // For an async Server Component, calling it directly is easier in Vitest.
    
    let container: any;
    
    await act(async () => {
      const PageComponent = await LandingPage({ params: Promise.resolve({ locale: 'en' }) })
      const result = render(PageComponent)
      container = result.container
    })
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
    expect(screen.getByTestId('hero')).toBeInTheDocument()
    expect(screen.getByTestId('stats')).toBeInTheDocument()
    expect(screen.getByTestId('features')).toBeInTheDocument()
    expect(screen.getByTestId('role-section')).toBeInTheDocument()
    expect(screen.getByTestId('testimonials')).toBeInTheDocument()
    expect(screen.getByTestId('cta-banner')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })
})
