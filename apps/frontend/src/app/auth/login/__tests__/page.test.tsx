import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import LoginPage from '../page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock AuthContext
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    isLoading: false,
  }),
}))

// Mock useLogin hook
jest.mock('@/hooks/useLogin', () => ({
  useLogin: () => ({
    form: {
      register: jest.fn(() => ({ onChange: jest.fn() })),
      handleSubmit: jest.fn((fn) => fn),
      formState: { errors: {} },
      clearErrors: jest.fn(),
      watch: jest.fn(() => ''),
    },
    onSubmit: jest.fn(),
    isLoading: false,
    apiError: null,
  }),
}))

describe('LoginPage', () => {
  let mockPush: jest.Mock

  beforeEach(() => {
    mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('renders login form', () => {
    render(<LoginPage />)
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Sign in to your account to continue')).toBeInTheDocument()
  })

  it('displays email and password inputs', () => {
    render(<LoginPage />)
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('shows password toggle button', () => {
    render(<LoginPage />)
    const toggleButtons = screen.getAllByRole('button')
    expect(toggleButtons.some((btn) => btn.textContent === '👁️')).toBe(true)
  })

  it('has link to register page', () => {
    render(<LoginPage />)
    const registerLink = screen.getByRole('link', { name: /register here/i })
    expect(registerLink).toHaveAttribute('href', '/auth/register')
  })

  it('has link to forgot password page', () => {
    render(<LoginPage />)
    const forgotLink = screen.getByRole('link', { name: /forgot password/i })
    expect(forgotLink).toHaveAttribute('href', '/auth/forgot-password')
  })

  it('has remember me checkbox', () => {
    render(<LoginPage />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('has submit button', () => {
    render(<LoginPage />)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    expect(submitButton).toBeInTheDocument()
  })
})
