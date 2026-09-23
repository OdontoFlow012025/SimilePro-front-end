import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ScrollToTop from '@/components/ScrollToTop'

describe('ScrollToTop component', () => {
  beforeEach(() => {
    // Reset window.scrollY and mock scrollTo
    window.scrollY = 0;
    window.scrollTo = vi.fn();
    
    // Clear dom
    document.body.innerHTML = '';
  })

  it('does not render the button initially', () => {
    render(<ScrollToTop />)
    const button = screen.queryByLabelText('Scroll to top')
    expect(button).not.toBeInTheDocument()
  })

  it('renders the button when scrolled down past 300px', () => {
    render(<ScrollToTop />)
    
    // Simulate scroll
    window.scrollY = 400
    fireEvent.scroll(window)
    
    const button = screen.getByLabelText('Scroll to top')
    expect(button).toBeInTheDocument()
  })

  it('calls window.scrollTo when clicked', () => {
    render(<ScrollToTop />)
    
    // Simulate scroll to make button visible
    window.scrollY = 400
    fireEvent.scroll(window)
    
    const button = screen.getByLabelText('Scroll to top')
    fireEvent.click(button)
    
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    })
  })
})
