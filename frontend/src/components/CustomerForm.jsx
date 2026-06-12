import { useState } from 'react'
import { customersApi } from '../services/api.js'

export default function CustomerForm({ navigate }) {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    customersApi.create(form)
      .then(() => {
        setSuccess('Customer created!')
        setTimeout(() => navigate('customers'), 1000)
      })
      .catch(err => {
        const msg = err.response?.data?.detail || 'An error occurred'
        setError(typeof msg === 'string' ? msg : msg.join(', '))
      })
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>New Customer</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="full_name" value={form.full_name} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} required />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="submit" className="btn btn-primary">Create</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('customers')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
