import { useState, type FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../context/useNotifications'
import notificationService from '../services/notificationService'
import { Category, type Category as CategoryType } from '../types/notification'

function NewNotificationPage() {
  const navigate = useNavigate()
  const { addNotification } = useNotifications()
  const [header, setHeader] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState<CategoryType>(Category.INFO)
  const [errors, setErrors] = useState({ header: '', body: '' })
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = {
      header: header.trim() ? '' : 'Header is required.',
      body: body.trim() ? '' : 'Body is required.',
    }

    setErrors(nextErrors)
    setServerError('')

    if (nextErrors.header || nextErrors.body) {
      return
    }

    setIsSubmitting(true)

    try {
      const notification = await notificationService.create({
        header,
        body,
        category,
      })
      addNotification(notification)
      navigate('/dashboard')
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message
        setServerError(
          Array.isArray(message)
            ? message.join(', ')
            : message || 'Unable to create notification.',
        )
      } else {
        setServerError('Unable to create notification.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 className="h2 mb-4">New notification</h1>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3 text-start">
              <label htmlFor="header" className="form-label">Header</label>
              <input
                id="header"
                type="text"
                className={`form-control${errors.header ? ' is-invalid' : ''}`}
                value={header}
                onChange={(event) => setHeader(event.target.value)}
              />
              {errors.header && <div className="invalid-feedback">{errors.header}</div>}
            </div>
            <div className="mb-3 text-start">
              <label htmlFor="body" className="form-label">Body</label>
              <textarea
                id="body"
                className={`form-control${errors.body ? ' is-invalid' : ''}`}
                rows={4}
                value={body}
                onChange={(event) => setBody(event.target.value)}
              />
              {errors.body && <div className="invalid-feedback">{errors.body}</div>}
            </div>
            <div className="mb-3 text-start">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                id="category"
                className="form-select"
                value={category}
                onChange={(event) => setCategory(event.target.value as CategoryType)}
              >
                <option value={Category.INFO}>INFO</option>
                <option value={Category.WARNING}>WARNING</option>
                <option value={Category.ERROR}>ERROR</option>
              </select>
            </div>
            {serverError && <div className="alert alert-danger">{serverError}</div>}
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create notification'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default NewNotificationPage
