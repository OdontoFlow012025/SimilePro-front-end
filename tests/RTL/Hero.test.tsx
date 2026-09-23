import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Hero from '@/components/Hero'

const mockDict = {
  hero: {
    titlePrefix: 'Manage your clinic with',
    titleSuffix: 'ease',
    description: 'OdontoFlow helps you organize patients, appointments, and billing in one place.',
    startTrial: 'Start Free Trial',
    watchVideo: 'Watch Video',
    trustedBy: 'Trusted by 500+ clinics',
    dailyRevenue: 'Daily Revenue'
  }
}

describe('Hero component', () => {
  it('renders the hero title and description', () => {
    render(<Hero dict={mockDict} />)
    
    expect(screen.getByText('Manage your clinic with')).toBeInTheDocument()
    expect(screen.getByText('ease')).toBeInTheDocument()
    expect(screen.getByText('OdontoFlow helps you organize patients, appointments, and billing in one place.')).toBeInTheDocument()
  })

  it('renders action buttons', () => {
    render(<Hero dict={mockDict} />)
    
    expect(screen.getByRole('button', { name: 'Start Free Trial' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Watch Video/i })).toBeInTheDocument()
  })

  it('renders trust indicators', () => {
    render(<Hero dict={mockDict} />)
    
    expect(screen.getByText('Trusted by 500+ clinics')).toBeInTheDocument()
    expect(screen.getByText('Daily Revenue')).toBeInTheDocument()
    expect(screen.getByText('$4,250.00')).toBeInTheDocument()
  })
})
