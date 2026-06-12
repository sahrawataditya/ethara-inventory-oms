import { useState, useEffect } from 'react'
import { customersApi } from '../services/api.js'

export default function CustomerList({ navigate }) {
  const [customers, setCustomers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    customersApi.list()
      .then(res => setCustomers(res.data))
      .catch(() => setError('Failed to load customers'))
  }, [])

  function handleDelete(id) {
    if (!confirm('Delete this customer?')) return
    customersApi.delete(id)
      .then(() => setCustomers(customers.filter(c => c.id !== id)))
      .catch(() => setError('Failed to delete customer'))
  }

  return (
    <div>
      <div className="toolbar">
        <h1>Customers</h1>
        <button className="btn btn-primary" onClick={() => navigate('customerNew')}>+ Add Customer</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th></th></tr>
          </thead>
          <tbody>
            {customers.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: '#a0aec0' }}>No customers yet</td></tr>}
            {customers.map(c => (
              <tr key={c.id}>
                <td>{c.full_name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>
                  <div className="actions">
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
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
