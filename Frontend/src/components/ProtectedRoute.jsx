import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="p-8 text-center text-primary">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  return <Outlet />
}