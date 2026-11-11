import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import api from '../../api/axios'
import ConfirmModal from '../../components/ConfirmModal'

export default function CustomersList() {
  const [customers, setCustomers] = useState([])
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Wait until the admin stops typing for 0.4 seconds before searching
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/customers', {
        params: { search: debouncedSearch, page },
      })
      setCustomers(res.data.data)
      setMeta({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
        total: res.data.total,
      })
    } catch {
      setError('Could not load customers. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, page])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/customers/${toDelete.id}`)
      setMessage(`${toDelete.first_name} ${toDelete.last_name} was deleted.`)
      setToDelete(null)

      // If that was the last customer on this page, go back one page
      if (customers.length === 1 && page > 1) {
        setPage(page - 1)
      } else {
        fetchCustomers()
      }
    } catch {
      setError('Could not delete the customer. Please try again.')
      setToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">{meta.total} total</p>
        </div>
        <Link
          to="/admin/customers/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-dark"
        >
          <Plus size={18} /> Add customer
        </Link>
      </div>

      {/* Search */}
      <div className="relative mt-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or phone"
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Messages */}
      {message && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</div>
      )}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {/* Content */}
      {loading ? (
        <p className="mt-8 text-center text-gray-500">Loading customers...</p>
      ) : customers.length === 0 ? (
        <p className="mt-8 text-center text-gray-500">No customers found.</p>
      ) : (
        <>
          {/* Table: tablets and up */}
          <div className="mt-6 hidden overflow-hidden rounded-xl border border-gray-200 bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary-light text-primary-dark">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Address</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.first_name} {c.last_name}</td>
                    <td className="px-4 py-3 text-gray-600">{c.email}</td>
                    <td className="px-4 py-3 text-gray-600">{c.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{c.address || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/customers/${c.id}`} className="rounded-lg p-2 text-gray-500 hover:bg-primary-light hover:text-primary" aria-label="View">
                          <Eye size={18} />
                        </Link>
                        <Link to={`/admin/customers/${c.id}/edit`} className="rounded-lg p-2 text-gray-500 hover:bg-primary-light hover:text-primary" aria-label="Edit">
                          <Pencil size={18} />
                        </Link>
                        <button onClick={() => setToDelete(c)} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards: phones */}
          <div className="mt-6 space-y-3 md:hidden">
            {customers.map((c) => (
              <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="font-semibold text-gray-900">{c.first_name} {c.last_name}</p>
                <p className="text-sm text-gray-600">{c.email}</p>
                <p className="text-sm text-gray-600">{c.phone}</p>
                <div className="mt-3 flex gap-2">
                  <Link to={`/admin/customers/${c.id}`} className="flex-1 rounded-lg border border-gray-300 py-2 text-center text-sm text-gray-700">View</Link>
                  <Link to={`/admin/customers/${c.id}/edit`} className="flex-1 rounded-lg border border-primary py-2 text-center text-sm text-primary">Edit</Link>
                  <button onClick={() => setToDelete(c)} className="flex-1 rounded-lg border border-red-300 py-2 text-sm text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {meta.current_page} of {meta.last_page}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === meta.last_page}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      <ConfirmModal
        open={toDelete !== null}
        title="Delete customer?"
        message={toDelete ? `This will delete ${toDelete.first_name} ${toDelete.last_name}. You can't undo this from the app.` : ''}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  )
}