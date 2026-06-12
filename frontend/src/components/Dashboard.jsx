import { useState, useEffect } from 'react'
import { dashboardApi } from '../services/api.js'

export default function Dashboard({ navigate }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    dashboardApi.get()
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load dashboard'))
  }, [])

  if (error) return <div className="alert alert-error">{error}</div>
  if (!data) return <p>Loading...</p>

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>
      <div className="grid">
        <div className="stat"><div className="stat-value">{data.total_products}</div><div className="stat-label">Total Products</div></div>
        <div className="stat"><div className="stat-value">{data.total_customers}</div><div className="stat-label">Total Customers</div></div>
        <div className="stat"><div className="stat-value">{data.total_orders}</div><div className="stat-label">Total Orders</div></div>
        <div className="stat"><div className="stat-value">{data.low_stock_products.length}</div><div className="stat-label">Low Stock Items</div></div>
      </div>
      {data.low_stock_products.length > 0 && (
        <div className="card">
          <h2>Low Stock Products (&lt;10 units)</h2>
          <table>
            <thead>
              <tr><th>Name</th><th>SKU</th><th>Quantity</th></tr>
            </thead>
            <tbody>
              {data.low_stock_products.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td><span className="badge badge-warning">{p.quantity}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
