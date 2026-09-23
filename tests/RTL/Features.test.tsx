import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Features from '@/components/Features'

const mockDict = {
  features: {
    title: 'Platform Features',
    subtitle: 'Everything you need',
    scheduling: { title: 'Scheduling', description: 'Manage appointments easily' },
    financial: { title: 'Financial', description: 'Control your finances' },
    charts: { title: 'Charts', description: 'Electronic charts' }
  }
}

describe('Features component', () => {
  it('renders title and subtitle', () => {
    render(<Features dict={mockDict} />)
    expect(screen.getByText('Platform Features')).toBeInTheDocument()
    expect(screen.getByText('Everything you need')).toBeInTheDocument()
  })

  it('renders all feature cards', () => {
    render(<Features dict={mockDict} />)
    expect(screen.getByText('Scheduling')).toBeInTheDocument()
    expect(screen.getByText('Manage appointments easily')).toBeInTheDocument()
    expect(screen.getByText('Financial')).toBeInTheDocument()
    expect(screen.getByText('Control your finances')).toBeInTheDocument()
    expect(screen.getByText('Charts')).toBeInTheDocument()
    expect(screen.getByText('Electronic charts')).toBeInTheDocument()
  })
})
