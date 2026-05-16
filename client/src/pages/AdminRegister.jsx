import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'

const AdminRegister = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    shopName: '',
    shopDescription: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await Axios({
        ...SummaryApi.adminRegister,
        data
      })

      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/admin-login')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const isValid = Object.values(data).every(Boolean)

  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-6 w-full max-w-lg mx-auto rounded-lg p-8 shadow-lg'>
        <h2 className='text-2xl font-semibold text-center text-neutral-900 mb-6'>Admin Registration</h2>
        <p className='text-sm text-center text-neutral-600 mb-6'>Submit your shop details. Superadmin will approve before you can log in.</p>

        <form className='grid gap-4' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label className='text-sm text-neutral-800 font-medium'>Full Name</label>
            <input name='name' value={data.name} onChange={handleChange} className='border p-3 rounded outline-none focus:border-blue-500' placeholder='Enter name' />
          </div>
          <div className='grid gap-1'>
            <label className='text-sm text-neutral-800 font-medium'>Email</label>
            <input type='email' name='email' value={data.email} onChange={handleChange} className='border p-3 rounded outline-none focus:border-blue-500' placeholder='Enter email' />
          </div>
          <div className='grid gap-1'>
            <label className='text-sm text-neutral-800 font-medium'>Phone</label>
            <input name='phone' value={data.phone} onChange={handleChange} className='border p-3 rounded outline-none focus:border-blue-500' placeholder='10-digit phone' />
          </div>
          <div className='grid gap-1'>
            <label className='text-sm text-neutral-800 font-medium'>Password</label>
            <input type='password' name='password' value={data.password} onChange={handleChange} className='border p-3 rounded outline-none focus:border-blue-500' placeholder='Min 8 characters' />
          </div>
          <div className='grid gap-1'>
            <label className='text-sm text-neutral-800 font-medium'>Shop Name</label>
            <input name='shopName' value={data.shopName} onChange={handleChange} className='border p-3 rounded outline-none focus:border-blue-500' placeholder='Your shop name' />
          </div>
          <div className='grid gap-1'>
            <label className='text-sm text-neutral-800 font-medium'>Shop Description</label>
            <textarea name='shopDescription' value={data.shopDescription} onChange={handleChange} className='border p-3 rounded outline-none focus:border-blue-500' rows={3} placeholder='What you sell (optional)' />
          </div>

          <button disabled={!isValid} className={`${isValid ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-400 cursor-not-allowed'} text-white py-3 rounded-md font-semibold text-base tracking-wide shadow`}>
            Submit for Approval
          </button>
        </form>

        <p className='text-center text-sm mt-4 text-neutral-700'>
          Already have approval?{' '}
          <Link to={'/admin-login'} className='font-semibold text-blue-700 hover:text-blue-800'>
            Admin Login
          </Link>
        </p>
      </div>
    </section>
  )
}

export default AdminRegister
