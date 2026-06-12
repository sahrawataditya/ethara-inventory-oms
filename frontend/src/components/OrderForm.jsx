import { useState, useEffect } from 'react'
import { ordersApi, productsApi, customersApi } from '../services/api.js'

export default function OrderForm({ navigate, params }) {
  const isDetail = !!params
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [customerId, setCustomerId] = useState('')
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    customersApi.list().then(res => setCustomers(res.data)).catch(() => {})
    productsApi.list().then(res => setProducts(res.data)).catch(() => {})
  }, [])

  if (isDetail) {
    return (
      <div>
        <h1 style={{ marginBottom: 24 }}>Order #{params.id}</h1>
        <div className="card">
          <p><strong>Customer:</strong> {params.customer_name}</p>
          <p><strong>Total:</strong> ${params.total_amount.toFixed(2)}</p>
          <p><strong>Date:</strong> {new Date(params.created_at).toLocaleString()}</p>
          <table style={{ marginTop: 16 }}>
            <thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr></thead>
            <tbody>
              {params.items.map(item => (
                <tr key={item.id}>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.unit_price.toFixed(2)}</td>
                  <td>${(item.unit_price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate('orders')}>Back</button>
        </div>
      </div>
    )
  }

  function addItem() {
    setItems([...items, { product_id: '', quantity: 1 }])
  }

  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index))
  }

  function updateItem(index, field, value) {
    const updated = items.map((item, i) => i === index ? { ...item, [field]: value } : item)
    setItems(updated)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!customerId) { setError('Select a customer'); return }
    const validItems = items.filter(i => i.product_id)
    if (validItems.length === 0) { setError('Add at least one product'); return }

    ordersApi.create({
      customer_id: parseInt(customerId, 10),
      items: validItems.map(i => ({ product_id: parseInt(i.product_id, 10), quantity: parseInt(i.quantity, 10) })),
    })
      .then(() => {
        setSuccess('Order created!')
        setTimeout(() => navigate('orders'), 1000)
      })
      .catch(err => {
        const msg = err.response?.data?.detail || 'An error occurred'
        setError(typeof msg === 'string' ? msg : msg.join(', '))
      })
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>New Order</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer</label>
            <select value={customerId} onChange={e => setCustomerId(e.target.value)} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '0.9rem', background: '#fff' }}>
              <option value="">Select customer...</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
            </select>
          </div>
          <h3 style={{ margin: '16px 0 8px' }}>Items</h3>
          {items.map((item, i) => (
            <div key={i} className="form-row" style={{ alignItems: 'flex-end', marginBottom: 8 }}>
              <div className="form-group" style={{ flex: 3 }}>
                <label>Product</label>
                <select value={item.product_id} onChange={e => updateItem(i, 'product_id', e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '0.9rem', background: '#fff' }}>
                  <option value="">Select...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} (${p.price.toFixed(2)}, stock: {p.quantity})</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Qty</label>
                <input type="number" min="1" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} />
              </div>
              {items.length > 1 && (
                <button type="button" className="btn btn-danger btn-sm" style={{ marginBottom: 16 }} onClick={() => removeItem(i)}>X</button>
              )}
            </div>
          ))}
          <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>+ Add Item</button>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="submit" className="btn btn-primary">Create Order</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('orders')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
