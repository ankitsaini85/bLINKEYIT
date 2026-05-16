import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { FaUsers, FaShoppingCart, FaRupeeSign, FaExclamationTriangle } from 'react-icons/fa'

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getAnalytics
      })

      if (response.data.success) {
        setAnalytics(response.data.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4 md:p-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center py-12'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500'></div>
            <p className='text-gray-600 mt-4'>Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4 md:p-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center py-12 bg-white rounded-lg'>
            <p className='text-red-600 font-medium'>Failed to load analytics</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className='min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4 md:p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-6 md:mb-8'>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>Analytics Dashboard</h1>
          <p className='text-gray-600 text-sm mt-1'>Real-time business insights and metrics</p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8'>
          {/* Total Users */}
          <div className='bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition duration-300 p-5 md:p-6 border-l-4 border-blue-500'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-xs md:text-sm font-medium'>Total Users</p>
                <p className='text-2xl md:text-3xl font-bold text-gray-800 mt-1'>{analytics.totalUsers}</p>
              </div>
              <div className='bg-blue-100 p-3 rounded-full'>
                <FaUsers size={24} className='text-blue-600' />
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className='bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition duration-300 p-5 md:p-6 border-l-4 border-green-500'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-xs md:text-sm font-medium'>Total Orders</p>
                <p className='text-2xl md:text-3xl font-bold text-gray-800 mt-1'>{analytics.totalOrders}</p>
              </div>
              <div className='bg-green-100 p-3 rounded-full'>
                <FaShoppingCart size={24} className='text-green-600' />
              </div>
            </div>
          </div>

          {/* Total Sales */}
          <div className='bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition duration-300 p-5 md:p-6 border-l-4 border-purple-500'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-xs md:text-sm font-medium'>Total Sales</p>
                <p className='text-2xl md:text-3xl font-bold text-purple-600 mt-1'>₹{(analytics.totalSales).toLocaleString('en-IN')}</p>
              </div>
              <div className='bg-purple-100 p-3 rounded-full'>
                <FaRupeeSign size={24} className='text-purple-600' />
              </div>
            </div>
          </div>

          {/* Low Stock */}
          <div className='bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition duration-300 p-5 md:p-6 border-l-4 border-red-500'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-xs md:text-sm font-medium'>Low Stock Products</p>
                <p className='text-2xl md:text-3xl font-bold text-red-600 mt-1'>{analytics.lowStockCount || analytics.lowStockProducts.length}</p>
              </div>
              <div className='bg-red-100 p-3 rounded-full'>
                <FaExclamationTriangle size={24} className='text-red-600' />
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Products */}
        <div className='bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8'>
          <h3 className='text-lg md:text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2'>
            <span className='text-2xl'>🚨</span> Low Stock Alert
          </h3>
          {analytics.lowStockProducts.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className='hidden md:block overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b-2 border-gray-200'>
                      <th className='text-left py-3 px-4 font-semibold text-gray-700'>Product Name</th>
                      <th className='text-left py-3 px-4 font-semibold text-gray-700'>Current Stock</th>
                      <th className='text-left py-3 px-4 font-semibold text-gray-700'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.lowStockProducts.map((product) => (
                      <tr key={product._id} className='border-b hover:bg-orange-50 transition'>
                        <td className='py-3 px-4 font-medium text-gray-800'>{product.name}</td>
                        <td className='py-3 px-4'>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            product.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className='py-3 px-4'>
                          {product.stock < 5 ? (
                            <span className='text-red-600 font-bold'>🔴 Critical</span>
                          ) : (
                            <span className='text-yellow-600 font-bold'>🟡 Warning</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className='md:hidden space-y-3'>
                {analytics.lowStockProducts.map((product) => (
                  <div key={product._id} className={`p-4 rounded-lg border-l-4 ${
                    product.stock < 5 ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
                  }`}>
                    <h4 className='font-semibold text-gray-800'>{product.name}</h4>
                    <div className='flex justify-between items-center mt-2'>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {product.stock} units
                      </span>
                      <span className='text-sm font-medium'>
                        {product.stock < 5 ? '🔴 Critical' : '🟡 Warning'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className='text-center py-8 bg-green-50 rounded-lg'>
              <p className='text-green-700 font-medium'>✓ All products have sufficient stock</p>
            </div>
          )}
        </div>

        {/* Orders by Status */}
        {analytics.ordersByStatus.length > 0 && (
          <div className='bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8'>
            <h3 className='text-lg md:text-xl font-semibold mb-4 text-gray-800'>Orders by Status</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4'>
              {analytics.ordersByStatus.map((status) => (
                <div key={status._id} className='p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200 hover:shadow-md transition'>
                  <p className='text-gray-600 text-sm font-medium capitalize'>{status._id || 'Unknown'}</p>
                  <p className='text-3xl font-bold text-orange-600 mt-2'>{status.count}</p>
                  <p className='text-xs text-gray-500 mt-1'>orders</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Products */}
        {analytics.topProducts.length > 0 && (
          <div className='bg-white rounded-lg shadow-md p-4 md:p-6'>
            <h3 className='text-lg md:text-xl font-semibold mb-4 text-gray-800'>⭐ Top 5 Best Selling Products</h3>
            <div className='space-y-2 md:space-y-3'>
              {analytics.topProducts.map((item, index) => (
                <div
                  key={item._id}
                  className='flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition border-l-4 border-orange-400'
                >
                  <div className='flex items-center gap-3 flex-1'>
                    <span className='text-lg md:text-xl font-bold text-white bg-orange-500 w-8 h-8 flex items-center justify-center rounded-full'>
                      {index + 1}
                    </span>
                    <div className='flex-1'>
                      <p className='font-semibold text-gray-800 text-sm md:text-base'>
                        {item.product?.[0]?.name || 'Unknown Product'}
                      </p>
                      <p className='text-xs md:text-sm text-gray-500 mt-1'>
                        {item.product?.[0]?.description?.slice(0, 40)}...
                      </p>
                    </div>
                  </div>
                  <div className='text-right mt-2 md:mt-0'>
                    <p className='text-2xl md:text-3xl font-bold text-green-600'>{item.count}</p>
                    <p className='text-xs text-gray-500'>total orders</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default AnalyticsDashboard
