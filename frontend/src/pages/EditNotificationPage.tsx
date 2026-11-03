import { isAxiosError } from 'axios'
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useNotifications } from '../context/useNotifications'
import notificationService from '../services/notificationService'
import { Category, type Category as CategoryType } from '../types/notification'

function EditNotificationPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { notifications, setNotifications } = useNotifications()
  const [header, setHeader] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState<CategoryType>(Category.INFO)
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState({ header: '', body: '' })
  const [pageError, setPageError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!id) {
      return
    }

    async function loadNotification() {
      try {
        const existingNotification = notifications.find(
          (item) => item._id === id,
        )
        const notification =
          existingNotification ?? (await notificationService.getOne(id))
        if (!existingNotification) {
          setNotifications([...notifications, notification])
        }
        setHeader(notification.header)
        setBody(notification.body)
        setCategory(notification.category)
      } catch {
        setPageError('Unable to load notification. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadNotification()
  }, [id, notifications, setNotifications])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = {
      header: header.trim() ? '' : 'Header is required.',
      body: body.trim() ? '' : 'Body is required.',
    }
    setErrors(nextErrors)
    setPageError('')

    if (!id || nextErrors.header || nextErrors.body) {
      return
    }

    setIsSubmitting(true)

    try {
      const updatedNotification = await notificationService.update(id, {
        header,
        body,
        category,
      })
      setNotifications(
        notifications.map((notification) =>
          notification._id === id ? updatedNotification : notification,
        ),
      )
      navigate('/dashboard')
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message
        setPageError(
          Array.isArray(message)
            ? message.join(', ')
            : message || 'Unable to update notification.',
        )
      } else {
        setPageError('Unable to update notification.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <main className="container py-5"><p>Loading notification...</p></main>
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 className="h2 mb-4">Edit notification</h1>
          {pageError && <div className="alert alert-danger">{pageError}</div>}
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
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default EditNotificationPage
