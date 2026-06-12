import { useState } from 'react'
import { productsApi } from '../services/api.js'

export default function ProductForm({ navigate, params }) {
  const isEdit = !!params
  const [form, setForm] = useState({
    name: params?.name || '',
    sku: params?.sku || '',
    price: params?.price || '',
    quantity: params?.quantity ?? '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    const payload = { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity, 10) }

    const apiCall = isEdit
      ? productsApi.update(params.id, payload)
      : productsApi.create(payload)

    apiCall
      .then(() => {
        setSuccess(isEdit ? 'Product updated!' : 'Product created!')
        setTimeout(() => navigate('products'), 1000)
      })
      .catch(err => {
        const msg = err.response?.data?.detail || 'An error occurred'
        setError(typeof msg === 'string' ? msg : msg.join(', '))
      })
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>{isEdit ? 'Edit Product' : 'New Product'}</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price ($)</label>
              <input name="price" type="number" step="0.01" min="0.01" value={form.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Quantity in Stock</label>
              <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} required />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Create'}</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('products')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
