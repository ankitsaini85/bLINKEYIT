import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'

const MyOrders = () => {
  const user = useSelector(state => state.user)
  const userOrders = useSelector(state => state.orders.order)
  const [allOrders, setAllOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const isAdmin = user.role === 'ADMIN'

  const formatDate = (date) => {
    const d = new Date(date)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const day = d.getDate().toString().padStart(2, '0')
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    let hours = d.getHours()
    const minutes = d.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12
    return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`
  }

  const fetchAllOrders = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getAllOrders,
        data: { page: 1, limit: 100 }
      })
      if (response.data.success) {
        setAllOrders(response.data.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchAllOrders()
    }
  }, [isAdmin])

  const orders = isAdmin ? allOrders : userOrders

  console.log("order Items", orders)
  
  return (
    <div>
      <div className='bg-white shadow-md p-3 font-semibold'>
        <h1>{isAdmin ? 'All Customer Orders' : 'My Orders'}</h1>
      </div>
      {loading && (
        <div className='p-4'>Loading orders...</div>
      )}
      {
        !loading && !orders[0] && (
          <NoData />
        )
      }
      <div className='p-4 grid gap-4'>
        {
          orders.map((order, index) => {
            return (
              <div key={order._id + index + "order"} className='bg-white rounded p-4 shadow-md'>
                <div className='flex justify-between items-start mb-3'>
                  <div>
                    <p className='font-semibold'>Order No: {order?.orderId}</p>
                    {isAdmin && order.userId && (
                      <p className='text-sm text-gray-600'>Customer: {order.userId.name} ({order.userId.email})</p>
                    )}
                    <p className='text-xs text-gray-500'>{formatDate(order.createdAt)}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-semibold text-green-600'>₹{order.totalAmt}</p>
                    <p className='text-xs px-2 py-1 rounded ' style={{
                      backgroundColor: order.payment_status === 'paid' ? '#d4edda' : '#fff3cd',
                      color: order.payment_status === 'paid' ? '#155724' : '#856404'
                    }}>{order.payment_status}</p>
                  </div>
                </div>
                <div className='flex gap-3 items-center'>
                  <img
                    src={order.product_details.image[0]}
                    className='w-16 h-16 object-cover rounded'
                  />
                  <p className='font-medium'>{order.product_details.name}</p>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default MyOrders