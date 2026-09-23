import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Stats from '@/components/Stats'

const mockDict = {
  stats: {
    clinics: 'Active Clinics',
    dentists: 'Dentists using',
    patients: 'Patients registered',
    uptime: 'System Uptime'
  }
}

describe('Stats component', () => {
  it('renders all statistics data and labels', () => {
    render(<Stats dict={mockDict} />)
    expect(screen.getByText('500+')).toBeInTheDocument()
    expect(screen.getByText('Active Clinics')).toBeInTheDocument()
    expect(screen.getByText('2,500+')).toBeInTheDocument()
    expect(screen.getByText('Dentists using')).toBeInTheDocument()
    expect(screen.getByText('1M+')).toBeInTheDocument()
    expect(screen.getByText('Patients registered')).toBeInTheDocument()
    expect(screen.getByText('99.9%')).toBeInTheDocument()
    expect(screen.getByText('System Uptime')).toBeInTheDocument()
  })
})
