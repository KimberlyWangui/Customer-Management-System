import { Routes, Route } from 'react-router'
import ProtectedRoute from './components/ProtectedRoute'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLayout from './layouts/AdminLayout'
import CustomersList from './pages/admin/CustomersList'
import AddCustomer from './pages/admin/AddCustomer'
import CustomerDetails from './pages/admin/CustomerDetails'
import EditCustomer from './pages/admin/EditCustomer'

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer only */}
      <Route element={<ProtectedRoute role="customer" />}>
        <Route path="/dashboard" element={<CustomerDashboard />} />
      </Route>

      {/* Admin only */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/customers" element={<CustomersList />} />
          <Route path="/admin/customers/new" element={<AddCustomer />} />
          <Route path="/admin/customers/:id" element={<CustomerDetails />} />
          <Route path="/admin/customers/:id/edit" element={<EditCustomer />} />
        </Route>
      </Route>

      {/* Anything else */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App