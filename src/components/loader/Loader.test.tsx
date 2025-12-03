import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Loader from './Loader'

describe('Loader', () => {
  it('should render loader element', () => {
    render(<Loader />)
    const loader = screen.getByRole('status', { name: /loading/i })
    expect(loader).toBeInTheDocument()
  })
})

