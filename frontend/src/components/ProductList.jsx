import { useState, useEffect } from 'react'
import { productsApi } from '../services/api.js'

export default function ProductList({ navigate }) {
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    productsApi.list()
      .then(res => setProducts(res.data))
      .catch(() => setError('Failed to load products'))
  }, [])

  function handleDelete(id) {
    if (!confirm('Delete this product?')) return
    productsApi.delete(id)
      .then(() => setProducts(products.filter(p => p.id !== id)))
      .catch(() => setError('Failed to delete product'))
  }

  return (
    <div>
      <div className="toolbar">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={() => navigate('productNew')}>+ Add Product</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card">
        <table>
          <thead>
            <tr><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {products.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#a0aec0' }}>No products yet</td></tr>}
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.quantity < 10 ? <span className="badge badge-warning">{p.quantity}</span> : p.quantity}</td>
                <td>
                  <div className="actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('productEdit', p)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
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
