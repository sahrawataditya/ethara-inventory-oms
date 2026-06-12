import { useState, useEffect } from 'react'
import { ordersApi } from '../services/api.js'

export default function OrderList({ navigate }) {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    ordersApi.list()
      .then(res => setOrders(res.data))
      .catch(() => setError('Failed to load orders'))
  }, [])

  function handleDelete(id) {
    if (!confirm('Cancel this order?')) return
    ordersApi.delete(id)
      .then(() => setOrders(orders.filter(o => o.id !== id)))
      .catch(() => setError('Failed to cancel order'))
  }

  return (
    <div>
      <div className="toolbar">
        <h1>Orders</h1>
        <button className="btn btn-primary" onClick={() => navigate('orderNew')}>+ New Order</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card">
        <table>
          <thead>
            <tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th></th></tr>
          </thead>
          <tbody>
            {orders.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#a0aec0' }}>No orders yet</td></tr>}
            {orders.map(o => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.customer_name}</td>
                <td>{o.items.length}</td>
                <td>${o.total_amount.toFixed(2)}</td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('orderDetail', o)}>View</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(o.id)}>Cancel</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
