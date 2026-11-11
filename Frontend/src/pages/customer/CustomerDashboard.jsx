import { useAuth } from '../../context/AuthContext'

export default function CustomerDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-primary">Welcome, {user.name}</h1>
      <p className="text-gray-600">Customer dashboard</p>
      <button onClick={logout} className="mt-4 bg-primary text-white px-4 py-2 rounded-lg">
        Log out
      </button>
    </div>
  )
}