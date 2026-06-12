import { useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import ProductList from './components/ProductList.jsx'
import ProductForm from './components/ProductForm.jsx'
import CustomerList from './components/CustomerList.jsx'
import CustomerForm from './components/CustomerForm.jsx'
import OrderList from './components/OrderList.jsx'
import OrderForm from './components/OrderForm.jsx'

const pages = {
  dashboard: { label: 'Dashboard', component: Dashboard },
  products: { label: 'Products', component: ProductList },
  productNew: { label: 'New Product', component: ProductForm, back: 'products' },
  productEdit: { label: 'Edit Product', component: ProductForm, back: 'products' },
  customers: { label: 'Customers', component: CustomerList },
  customerNew: { label: 'New Customer', component: CustomerForm, back: 'customers' },
  orders: { label: 'Orders', component: OrderList },
  orderNew: { label: 'New Order', component: OrderForm, back: 'orders' },
  orderDetail: { label: 'Order Detail', component: OrderForm, back: 'orders' },
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [pageParams, setPageParams] = useState(null)

  function navigate(name, params = null) {
    setPage(name)
    setPageParams(params)
  }

  const current = pages[page]
  const Component = current.component

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-brand">Ethara OMS</div>
        <div className="nav-links">
          <button className={page === 'dashboard' ? 'active' : ''} onClick={() => navigate('dashboard')}>Dashboard</button>
          <button className={page.startsWith('product') ? 'active' : ''} onClick={() => navigate('products')}>Products</button>
          <button className={page.startsWith('customer') ? 'active' : ''} onClick={() => navigate('customers')}>Customers</button>
          <button className={page.startsWith('order') ? 'active' : ''} onClick={() => navigate('orders')}>Orders</button>
        </div>
      </nav>
      <main className="main">
        <Component navigate={navigate} params={pageParams} />
      </main>
    </div>
  )
}
