import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ThemeToggle } from '@/components/ThemeToggle'
import React from 'react'

// Mock next-themes
let mockTheme = 'light'
const setMockTheme = vi.fn((newTheme) => {
  mockTheme = newTheme
})

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: setMockTheme,
  }),
}))

describe('ThemeToggle component', () => {
  it('renders the theme toggle button', () => {
    render(<ThemeToggle />)
    const button = screen.getByLabelText('Toggle theme')
    expect(button).toBeInTheDocument()
  })

  it('toggles from light to dark theme on click', () => {
    mockTheme = 'light'
    render(<ThemeToggle />)
    const button = screen.getByLabelText('Toggle theme')
    fireEvent.click(button)
    expect(setMockTheme).toHaveBeenCalledWith('dark')
  })
})
