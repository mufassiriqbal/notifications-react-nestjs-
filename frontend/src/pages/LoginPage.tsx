import { useState, type FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import authService from '../services/authService'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  })
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = {
      username: username.trim() ? '' : 'Username is required.',
      password: password ? '' : 'Password is required.',
    }

    setErrors(nextErrors)
    setServerError('')

    if (nextErrors.username || nextErrors.password) {
      return
    }

    setIsSubmitting(true)

    try {
      const { accessToken, user } = await authService.login(username, password)
      login(accessToken, user)
      navigate('/dashboard')
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message
        setServerError(
          Array.isArray(message)
            ? message.join(', ')
            : message || 'Unable to log in. Please try again.',
        )
      } else {
        setServerError('Unable to log in. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <h1 className="h2 mb-4">Login</h1>
          <form onSubmit={handleSubmit} noValidate>
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
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
