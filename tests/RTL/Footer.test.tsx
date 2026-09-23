import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from '@/components/Footer'

const mockDict = {
  footer: {
    description: 'The best software for dentists.',
    product: 'Product',
    resources: 'Resources',
    company: 'Company',
    links: {
      features: 'Features',
      pricing: 'Pricing',
      integrations: 'Integrations',
      enterprise: 'Enterprise',
      blog: 'Blog',
      caseStudies: 'Case Studies',
      helpCenter: 'Help Center',
      apiDocs: 'API Docs',
      aboutUs: 'About Us',
      careers: 'Careers',
      legal: 'Legal',
      contact: 'Contact'
    },
    legal: {
      copyright: '© 2026 OdontoFlow. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service'
    }
  }
}

describe('Footer component', () => {
  it('renders the brand name and description', () => {
    render(<Footer dict={mockDict} locale="en" />)
    
    expect(screen.getByText('OdontoFlow')).toBeInTheDocument()
    expect(screen.getByText('The best software for dentists.')).toBeInTheDocument()
  })

  it('renders section headers', () => {
    render(<Footer dict={mockDict} locale="en" />)
    
    expect(screen.getByText('Product')).toBeInTheDocument()
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByText('Company')).toBeInTheDocument()
  })

  it('renders footer links', () => {
    render(<Footer dict={mockDict} locale="en" />)
    
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.getByText('Careers')).toBeInTheDocument()
  })

  it('renders copyright and legal links', () => {
    render(<Footer dict={mockDict} locale="en" />)
    
    expect(screen.getByText('© 2026 OdontoFlow. All rights reserved.')).toBeInTheDocument()
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
  })
})
