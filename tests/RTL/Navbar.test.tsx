import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Navbar from '@/components/Navbar'

// Mock ThemeToggle as it has its own tests and uses next-themes
vi.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => <button data-testid="mock-theme-toggle">Theme</button>
}))

const mockDict = {
  navbar: {
    features: 'Features',
    solutions: 'Solutions',
    pricing: 'Pricing',
    resources: 'Resources',
    login: 'Login'
  }
}

describe('Navbar component', () => {
  it('renders the brand logo and name', () => {
    render(<Navbar dict={mockDict} locale="en" />)
    expect(screen.getByText('OdontoFlow')).toBeInTheDocument()
  })

  it('renders navigation links with correct localized hrefs', () => {
    render(<Navbar dict={mockDict} locale="pt-BR" />)
    
    const featuresLink = screen.getByText('Features')
    expect(featuresLink).toHaveAttribute('href', '/pt-BR#features')
    
    const pricingLink = screen.getByText('Pricing')
    expect(pricingLink).toHaveAttribute('href', '/pt-BR#pricing')
  })

  it('renders the login link', () => {
    render(<Navbar dict={mockDict} locale="en" />)
    
    const loginLink = screen.getByText('Login')
    expect(loginLink).toHaveAttribute('href', '/en/login')
  })

  it('includes the theme toggle component', () => {
    render(<Navbar dict={mockDict} locale="en" />)
    expect(screen.getByTestId('mock-theme-toggle')).toBeInTheDocument()
  })
})
