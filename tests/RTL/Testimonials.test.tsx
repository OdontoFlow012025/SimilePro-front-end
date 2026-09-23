import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Testimonials from '@/components/Testimonials'

const mockDict = {
  testimonials: {
    title: 'What they say',
    t1: 'Great software!',
    t1_role: 'Clinic Owner',
    t2: 'Very intuitive.',
    t2_role: 'Dentist',
    t3: 'Saves so much time.',
    t3_role: 'Office Manager'
  }
}

describe('Testimonials component', () => {
  it('renders section title', () => {
    render(<Testimonials dict={mockDict} />)
    expect(screen.getByText('What they say')).toBeInTheDocument()
  })

  it('renders all testimonials with quotes, names, and roles', () => {
    render(<Testimonials dict={mockDict} />)
    
    // T1
    expect(screen.getByText('"Great software!"')).toBeInTheDocument()
    expect(screen.getByText('Dr. Sarah Jenkins')).toBeInTheDocument()
    expect(screen.getByText('Clinic Owner')).toBeInTheDocument()
    
    // T2
    expect(screen.getByText('"Very intuitive."')).toBeInTheDocument()
    expect(screen.getByText('Dr. Carlos Mendez')).toBeInTheDocument()
    expect(screen.getByText('Dentist')).toBeInTheDocument()
    
    // T3
    expect(screen.getByText('"Saves so much time."')).toBeInTheDocument()
    expect(screen.getByText('Emily Chen')).toBeInTheDocument()
    expect(screen.getByText('Office Manager')).toBeInTheDocument()
  })
})
