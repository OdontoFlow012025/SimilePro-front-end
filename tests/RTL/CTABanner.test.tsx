import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CTABanner from '@/components/CTABanner'

const mockDict = {
  cta: {
    title: 'Transform your clinic today',
    description: 'Join thousands of dentists using OdontoFlow.',
    getStarted: 'Get Started Now'
  }
}

describe('CTABanner component', () => {
  it('renders the title and description from the dictionary', () => {
    render(<CTABanner dict={mockDict} />)
    
    const title = screen.getByText('Transform your clinic today')
    const description = screen.getByText('Join thousands of dentists using OdontoFlow.')
    
    expect(title).toBeInTheDocument()
    expect(description).toBeInTheDocument()
  })

  it('renders the call to action button with correct text', () => {
    render(<CTABanner dict={mockDict} />)
    
    const button = screen.getByRole('button', { name: 'Get Started Now' })
    expect(button).toBeInTheDocument()
  })
})
