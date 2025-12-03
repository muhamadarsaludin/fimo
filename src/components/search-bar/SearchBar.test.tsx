import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SearchBar from './SearchBar'

describe('SearchBar', () => {
  it('should render input with placeholder', () => {
    render(<SearchBar placeholder="Search here..." />)
    const input = screen.getByPlaceholderText('Search here...')
    expect(input).toBeInTheDocument()
  })

  it('should call onChange when input value changes', () => {
    const handleChange = vi.fn()
    render(<SearchBar onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    
    fireEvent.change(input, { target: { value: 'test' } })
    
    expect(handleChange).toHaveBeenCalledWith('test', expect.any(Object))
  })

  it('should call onSubmit when form is submitted', () => {
    const handleSubmit = vi.fn()
    render(<SearchBar onSubmit={handleSubmit} />)
    const form = screen.getByRole('search')
    const input = screen.getByRole('textbox')
    
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.submit(form)
    
    expect(handleSubmit).toHaveBeenCalledWith('test', expect.any(Object))
  })

  it('should show clear button when value exists', () => {
    render(<SearchBar defaultValue="test" showClear />)
    const clearButton = screen.getByRole('button', { name: /clear search/i })
    expect(clearButton).toBeInTheDocument()
  })

  it('should call onClear when clear button is clicked', () => {
    const handleClear = vi.fn()
    render(<SearchBar defaultValue="test" onClear={handleClear} showClear />)
    const clearButton = screen.getByRole('button', { name: /clear search/i })
    
    fireEvent.click(clearButton)
    
    expect(handleClear).toHaveBeenCalledWith('')
  })

  it('should call onFocus when input is focused', () => {
    const handleFocus = vi.fn()
    render(<SearchBar onFocus={handleFocus} />)
    const input = screen.getByRole('textbox')
    
    fireEvent.focus(input)
    
    expect(handleFocus).toHaveBeenCalled()
  })

  it('should call onBlur when input loses focus', () => {
    const handleBlur = vi.fn()
    render(<SearchBar onBlur={handleBlur} />)
    const input = screen.getByRole('textbox')
    
    fireEvent.blur(input)
    
    expect(handleBlur).toHaveBeenCalled()
  })

  it('should hide clear button when showClear is false', () => {
    render(<SearchBar defaultValue="test" showClear={false} />)
    const clearButton = screen.queryByRole('button', { name: /clear search/i })
    expect(clearButton).not.toBeInTheDocument()
  })

  it('should hide start icon when showStartIcon is false', () => {
    const { container } = render(<SearchBar showStartIcon={false} />)
    const icon = container.querySelector('.search-bar__icon')
    expect(icon).not.toBeInTheDocument()
  })
})

