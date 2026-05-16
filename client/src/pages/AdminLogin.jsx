import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import fetchUserDetails from '../utils/fetchUserDetails'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../store/userSlice'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'

const AdminLogin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [data, setData] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const validValue = Object.values(data).every(Boolean)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await Axios({ ...SummaryApi.adminLogin, data })

      if (response.data.error) {
        toast.error(response.data.message)
        return
      }

      if (response.data.success) {
        toast.success(response.data.message)
        localStorage.setItem('accesstoken', response.data.data.accesstoken)
        localStorage.setItem('refreshToken', response.data.data.refreshToken)

        const userDetails = await fetchUserDetails()
        dispatch(setUserDetails(userDetails.data))
        setData({ email: '', password: '' })
        navigate('/dashboard/analytics')
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-6 w-full max-w-lg mx-auto rounded-lg p-8 shadow-lg'>
        <h2 className='text-2xl font-semibold text-center text-neutral-900 mb-6'>Admin Login</h2>
        <p className='text-sm text-center text-neutral-600 mb-6'>Admins log in here. Need access? Submit an admin registration request.</p>

        <form className='grid gap-5' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label className='text-sm text-neutral-800 font-medium'>Email</label>
            <input
              type='email'
              name='email'
              value={data.email}
              onChange={handleChange}
              placeholder='Admin email'
              className='bg-white p-3 border border-gray-300 rounded text-neutral-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none'
            />
          </div>

          <div className='grid gap-1'>
            <label className='text-sm text-neutral-800 font-medium'>Password</label>
            <div className='bg-white p-3 border border-gray-300 rounded flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200'>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={data.password}
                onChange={handleChange}
                placeholder='Admin password'
                className='w-full outline-none bg-transparent text-neutral-900 placeholder:text-gray-400'
              />
              <div onClick={() => setShowPassword(prev => !prev)} className='cursor-pointer text-lg text-gray-600 ml-2'>
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          <button
            disabled={!validValue}
            className={`${validValue ? 'bg-purple-700 hover:bg-purple-800' : 'bg-gray-400 cursor-not-allowed'} text-white py-3 rounded-md font-semibold text-base tracking-wide shadow`}
          >
            Admin Login
          </button>
        </form>

        <div className='flex items-center justify-between text-sm mt-4 text-neutral-700'>
          <Link to={'/admin-register'} className='font-semibold text-blue-700 hover:text-blue-800'>Register as Admin</Link>
          <Link to={'/superadmin-login'} className='font-semibold text-purple-700 hover:text-purple-800'>Superadmin Login</Link>
        </div>

        <p className='text-center text-sm mt-4 text-neutral-600'>
          Are you a customer?{' '}
          <Link to={'/login'} className='font-semibold text-green-700 hover:text-green-800'>
            Go to User Login
          </Link>
        </p>
      </div>
    </section>
  )
}

export default AdminLogin
