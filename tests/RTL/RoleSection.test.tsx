import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import RoleSection from '@/components/RoleSection'

const mockDict = {
  roles: {
    title: 'Made for your role',
    dentists: { title: 'Dentists', description: 'Focus on patients' },
    receptionists: { title: 'Receptionists', description: 'Manage the front desk' },
    managers: { title: 'Managers', description: 'Track clinic performance' }
  }
}

describe('RoleSection component', () => {
  it('renders the section title', () => {
    render(<RoleSection dict={mockDict} />)
    expect(screen.getByText('Made for your role')).toBeInTheDocument()
  })

  it('renders role cards correctly', () => {
    render(<RoleSection dict={mockDict} />)
    expect(screen.getByText('Dentists')).toBeInTheDocument()
    expect(screen.getByText('Focus on patients')).toBeInTheDocument()
    expect(screen.getByText('Receptionists')).toBeInTheDocument()
    expect(screen.getByText('Manage the front desk')).toBeInTheDocument()
    expect(screen.getByText('Managers')).toBeInTheDocument()
    expect(screen.getByText('Track clinic performance')).toBeInTheDocument()
  })
})
