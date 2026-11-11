import { Routes, Route } from 'react-router'
import ProtectedRoute from './components/ProtectedRoute'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

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
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Anything else */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App