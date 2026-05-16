import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { createColumnHelper } from '@tanstack/react-table'
import DisplayTable from '../components/DisplayTable'
import { HiPencil } from 'react-icons/hi'
import { MdDelete } from 'react-icons/md'
import CofirmBox from '../components/CofirmBox'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [editModal, setEditModal] = useState(false)
  const [editRole, setEditRole] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [viewProducts, setViewProducts] = useState(false)
  const [userProducts, setUserProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [viewOrders, setViewOrders] = useState(false)
  const [userOrders, setUserOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  const columnHelper = createColumnHelper()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getAllUsers,
        data: {
          page: page,
          limit: 10,
          search: search
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setUsers(responseData.data)
        setTotalPages(responseData.totalPages)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    fetchUsers()
  }, [page])

  const handleEditUser = (user) => {
    setEditingUser(user)
    setEditRole(user.role)
    setEditStatus(user.status)
    setEditModal(true)
  }

  const handleSaveEdit = async () => {
    try {
      if (editRole !== editingUser.role) {
        const response = await Axios({
          ...SummaryApi.updateUserRole,
          data: {
            userId: editingUser._id,
            role: editRole
          }
        })

        if (response.data.success) {
          toast.success('Role updated')
        }
      }

      if (editStatus !== editingUser.status) {
        const response = await Axios({
          ...SummaryApi.updateUserStatus,
          data: {
            userId: editingUser._id,
            status: editStatus
          }
        })

        if (response.data.success) {
          toast.success('Status updated')
        }
      }

      setEditModal(false)
      fetchUsers()
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleViewProducts = async (user) => {
    try {
      setProductsLoading(true)
      const response = await Axios({
        ...SummaryApi.getAdminProducts,
        data: { adminId: user._id }
      })

      if (response.data.success) {
        setUserProducts(response.data.data)
        setSelectedUser(user)
        setViewProducts(true)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setProductsLoading(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: { _id: productId }
      })

      if (response.data.success) {
        toast.success('Product deleted')
        // Refresh products list
        await handleViewProducts(selectedUser)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleViewOrders = async (user) => {
    try {
      setOrdersLoading(true)
      const response = await Axios({
        ...SummaryApi.getUserOrders,
        data: { userId: user._id }
      })

      if (response.data.success) {
        setUserOrders(response.data.data)
        setSelectedUser(user)
        setViewOrders(true)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setOrdersLoading(false)
    }
  }

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ row }) => row.original.name || '-'
    }),
    columnHelper.accessor('email', {
      header: 'Email'
    }),
    columnHelper.accessor('mobile', {
      header: 'Mobile',
      cell: ({ row }) => row.original.mobile || '-'
    }),
    columnHelper.accessor('role', {
      header: 'Role',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${row.original.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
          {row.original.role}
        </span>
      )
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${
          row.original.status === 'Active' ? 'bg-green-100 text-green-700' :
          row.original.status === 'Inactive' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {row.original.status}
        </span>
      )
    }),
    columnHelper.accessor('_id', {
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex items-center justify-center gap-2'>
          {row.original.role === 'USER' && (
            <button
              onClick={() => handleViewOrders(row.original)}
              className='p-1 text-sm bg-blue-100 hover:bg-blue-200 rounded text-blue-700 font-medium'
            >
              Orders
            </button>
          )}
          {row.original.role === 'ADMIN' && (
            <button
              onClick={() => handleViewProducts(row.original)}
              className='p-1 text-sm bg-blue-100 hover:bg-blue-200 rounded text-blue-700 font-medium'
            >
              Products
            </button>
          )}
          <button
            onClick={() => handleEditUser(row.original)}
            className='p-2 bg-green-100 hover:bg-green-200 rounded-full text-green-700'
          >
            <HiPencil size={16} />
          </button>
        </div>
      )
    })
  ]

  return (
    <section className='min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4 md:p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-md p-4 md:p-6 mb-6'>
          <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
            <div>
              <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>User Management</h1>
              <p className='text-gray-600 text-sm mt-1'>Manage users, admins, and their activities</p>
            </div>
            <input
              type='text'
              placeholder='Search by name, email, mobile...'
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className='w-full md:w-72 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition'
            />
          </div>
        </div>

        {/* Users Table - Desktop View */}
        <div className='hidden lg:block bg-white rounded-lg shadow-md overflow-hidden'>
          <div className='overflow-x-auto'>
            <DisplayTable data={users} column={columns} loading={loading} />
          </div>
        </div>

        {/* Users Cards - Mobile View */}
        <div className='lg:hidden space-y-4'>
          {loading ? (
            <div className='text-center py-8'>
              <p className='text-gray-500'>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className='text-center py-8 bg-white rounded-lg'>
              <p className='text-gray-500'>No users found</p>
            </div>
          ) : (
            users.map((user) => (
              <div key={user._id} className='bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500'>
                <div className='flex justify-between items-start mb-3'>
                  <div>
                    <h3 className='font-semibold text-gray-800'>{user.name}</h3>
                    <p className='text-sm text-gray-600'>{user.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 
                    user.role === 'SUPERADMIN' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className='mb-3 space-y-1'>
                  <p className='text-sm text-gray-700'><span className='font-medium'>Mobile:</span> {user.mobile || '-'}</p>
                  <p className='text-sm'>
                    <span className='font-medium'>Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      user.status === 'Active' ? 'bg-green-100 text-green-700' :
                      user.status === 'Inactive' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </p>
                </div>
                <div className='flex gap-2 pt-3 border-t'>
                  {user.role === 'USER' && (
                    <button
                      onClick={() => handleViewOrders(user)}
                      className='flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition'
                    >
                      Orders
                    </button>
                  )}
                  {user.role === 'ADMIN' && (
                    <button
                      onClick={() => handleViewProducts(user)}
                      className='flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition'
                    >
                      Products
                    </button>
                  )}
                  <button
                    onClick={() => handleEditUser(user)}
                    className='flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition'
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className='flex flex-col md:flex-row items-center justify-between gap-4 mt-6 bg-white p-4 rounded-lg shadow-md'>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className='w-full md:w-auto px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition'
          >
            ← Previous
          </button>
          <span className='text-sm font-medium text-gray-700'>Page <span className='font-bold text-orange-600'>{page}</span> of <span className='font-bold text-orange-600'>{totalPages}</span></span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className='w-full md:w-auto px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition'
          >
            Next →
          </button>
        </div>

      </div>

      {/* Edit Modal */}
      {editModal && editingUser && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-end md:items-center justify-center p-0 md:p-4 z-50'>
          <div className='bg-white rounded-t-lg md:rounded-lg shadow-xl w-full md:max-w-md md:w-full mx-0 md:mx-auto overflow-hidden'>
            <div className='bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 md:p-6'>
              <h3 className='text-lg md:text-xl font-bold'>Edit {editingUser.name}</h3>
              <p className='text-orange-100 text-sm mt-1'>Update role and status</p>
            </div>
            
            <div className='p-4 md:p-6 space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition'
                >
                  <option value='USER'>USER</option>
                  <option value='ADMIN'>ADMIN</option>
                  <option value='SUPERADMIN'>SUPERADMIN</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition'
                >
                  <option value='Active'>Active</option>
                  <option value='Inactive'>Inactive</option>
                  <option value='Suspended'>Suspended</option>
                  <option value='Blocked'>Blocked</option>
                </select>
              </div>

              <div className='flex gap-3 pt-4'>
                <button
                  onClick={() => setEditModal(false)}
                  className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className='flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition'
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Products Modal */}
      {viewProducts && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-end md:items-center justify-center p-0 md:p-4 z-50'>
          <div className='bg-white rounded-t-lg md:rounded-lg shadow-xl w-full md:max-w-2xl md:w-full mx-0 md:mx-auto overflow-hidden flex flex-col max-h-[90vh] md:max-h-[80vh]'>
            <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 md:p-6 flex-shrink-0'>
              <h3 className='text-lg md:text-xl font-bold'>{editingUser?.name}'s Products</h3>
              <p className='text-blue-100 text-sm mt-1'>{userProducts.length} products uploaded</p>
            </div>

            <div className='overflow-y-auto flex-1'>
              {productsLoading ? (
                <div className='text-center py-8 text-gray-500'>
                  <p>Loading products...</p>
                </div>
              ) : userProducts.length > 0 ? (
                <div className='p-4 md:p-6 space-y-3'>
                  {userProducts.map((prod) => (
                    <div key={prod._id} className='border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition bg-gray-50'>
                      <div className='flex flex-col md:flex-row justify-between items-start gap-3'>
                        <div className='flex-1'>
                          <h4 className='font-semibold text-gray-800 text-base'>{prod.name}</h4>
                          <div className='grid grid-cols-2 gap-2 mt-2 text-sm text-gray-700'>
                            <p>Price: <span className='font-bold text-green-600'>₹{prod.price}</span></p>
                            <p>Stock: <span className='font-bold'>{prod.stock} units</span></p>
                            {prod.category?.length > 0 && (
                              <p className='col-span-2'>Category: <span className='font-medium'>{prod.category.map(c => c.name || c).join(', ')}</span></p>
                            )}
                            {prod.subCategory?.length > 0 && (
                              <p className='col-span-2'>Subcategories: <span className='font-medium'>{prod.subCategory.map(s => s.name || s).join(', ')}</span></p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteProduct(prod._id)}
                          className='w-full md:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2'
                        >
                          <MdDelete size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  <p>No products found</p>
                </div>
              )}
            </div>

            <div className='bg-gray-50 border-t p-4 flex-shrink-0'>
              <button
                onClick={() => setViewProducts(false)}
                className='w-full px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Orders Modal */}
      {viewOrders && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-end md:items-center justify-center p-0 md:p-4 z-50'>
          <div className='bg-white rounded-t-lg md:rounded-lg shadow-xl w-full md:max-w-2xl md:w-full mx-0 md:mx-auto overflow-hidden flex flex-col max-h-[90vh] md:max-h-[80vh]'>
            <div className='bg-gradient-to-r from-green-500 to-green-600 text-white p-4 md:p-6 flex-shrink-0'>
              <h3 className='text-lg md:text-xl font-bold'>{editingUser?.name}'s Orders</h3>
              <p className='text-green-100 text-sm mt-1'>{userOrders.length} total orders</p>
            </div>

            <div className='overflow-y-auto flex-1'>
              {ordersLoading ? (
                <div className='text-center py-8 text-gray-500'>
                  <p>Loading orders...</p>
                </div>
              ) : userOrders.length > 0 ? (
                <div className='p-4 md:p-6 space-y-3'>
                  {userOrders.map((order) => (
                    <div key={order._id} className='border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-green-300 transition bg-gray-50'>
                      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-3'>
                        <div className='flex-1'>
                          <h4 className='font-semibold text-gray-800'>Order #{order.orderId || order._id?.slice(-6)}</h4>
                          <div className='grid grid-cols-2 gap-2 mt-2 text-sm text-gray-700'>
                            <p>Amount: <span className='font-bold text-green-600'>₹{order.totalAmt}</span></p>
                            <p>Payment: <span className={`font-bold ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.payment_status}</span></p>
                            <p className='col-span-2'>Date: <span className='font-medium'>{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  <p>No orders found</p>
                </div>
              )}
            </div>

            <div className='bg-gray-50 border-t p-4 flex-shrink-0'>
              <button
                onClick={() => setViewOrders(false)}
                className='w-full px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default UserManagement
