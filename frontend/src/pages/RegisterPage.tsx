import { isAxiosError } from 'axios'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

function RegisterPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({
    fullName: '',
    username: '',
    password: '',
  })
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = {
      fullName: fullName.trim() ? '' : 'Full name is required.',
      username: !username.trim()
        ? 'Username is required.'
        : /\s/.test(username)
          ? 'Username must not contain spaces.'
          : '',
      password:
        password.length >= 6 ? '' : 'Password must be at least 6 characters.',
    }

    setErrors(nextErrors)
    setServerError('')

    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    setIsSubmitting(true)

    try {
      await authService.register(fullName, username, password)
      navigate('/login', {
        state: { successMessage: 'Registration successful. Please log in.' },
      })
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message
        setServerError(
          Array.isArray(message)
            ? message.join(', ')
            : message || 'Unable to register. Please try again.',
        )
      } else {
        setServerError('Unable to register. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <h1 className="h2 mb-4">Register</h1>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3 text-start">
              <label htmlFor="fullName" className="form-label">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                className={`form-control${errors.fullName ? ' is-invalid' : ''}`}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
              {errors.fullName && (
                <div className="invalid-feedback">{errors.fullName}</div>
              )}
            </div>
            <div className="mb-3 text-start">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                className={`form-control${errors.username ? ' is-invalid' : ''}`}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>
            <div className="mb-3 text-start">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`form-control${errors.password ? ' is-invalid' : ''}`}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>
            {serverError && (
              <div className="alert alert-danger" role="alert">
                {serverError}
              </div>
            )}
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default RegisterPage
