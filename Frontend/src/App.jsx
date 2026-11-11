import { Routes, Route, Navigate} from 'react-router'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import AppLayout from './layouts/AppLayout'
import CustomersList from './pages/admin/CustomersList'
import AddCustomer from './pages/admin/AddCustomer'
import CustomerDetails from './pages/admin/CustomerDetails'
import EditCustomer from './pages/admin/EditCustomer'
import EditProfile from './pages/customer/EditProfile'
import Settings from './pages/customer/Settings'

const adminLinks = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/customers', label: 'Customers' },
]

const customerLinks = [
  { to: '/dashboard', label: 'My profile', end: true },
  { to: '/settings', label: 'Settings' },
]

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer only */}
      <Route element={<ProtectedRoute role="customer" />}>
        <Route element={<AppLayout links={customerLinks} homeTo="/dashboard" />}>
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Admin only */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AppLayout links={adminLinks} homeTo="/admin" />}>
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