import React, { useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validValue = Object.values(data).every(el => el)

  useEffect(() => {
    if (!(location?.state?.data?.success)) {
      navigate("/")
    }

    if (location?.state?.email) {
      setData(prev => ({ ...prev, email: location.state.email }))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (data.newPassword !== data.confirmPassword) {
      toast.error("New password and confirm password must be the same.")
      return
    }

    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: data
      })

      if (response.data.error) {
        toast.error(response.data.message)
      }

      if (response.data.success) {
        toast.success(response.data.message)
        setData({
          email: "",
          newPassword: "",
          confirmPassword: ""
        })
        navigate("/login")
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-6 w-full max-w-lg mx-auto rounded-lg p-8 shadow-lg'>

        <h2 className='text-2xl font-semibold text-center text-neutral-900 mb-2'>Reset Password</h2>
        <p className='text-center text-sm text-gray-600 mb-6'>Enter your new password</p>

        <form className='grid gap-5' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label htmlFor='newPassword' className='text-sm text-neutral-800 font-medium'>New Password:</label>
            <div className='bg-white p-3 border border-gray-300 rounded flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200'>
              <input
                type={showPassword ? "text" : "password"}
                id='newPassword'
                name='newPassword'
                value={data.newPassword}
                onChange={handleChange}
                placeholder='Enter your new password'
                className='w-full outline-none bg-transparent text-neutral-900 placeholder:text-gray-400'
              />
              <div onClick={() => setShowPassword(prev => !prev)} className='cursor-pointer text-lg text-gray-600 ml-2'>
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          <div className='grid gap-1'>
            <label htmlFor='confirmPassword' className='text-sm text-neutral-800 font-medium'>Confirm Password:</label>
            <div className='bg-white p-3 border border-gray-300 rounded flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200'>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id='confirmPassword'
                name='confirmPassword'
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder='Confirm your password'
                className='w-full outline-none bg-transparent text-neutral-900 placeholder:text-gray-400'
              />
              <div onClick={() => setShowConfirmPassword(prev => !prev)} className='cursor-pointer text-lg text-gray-600 ml-2'>
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          <button
            disabled={!validValue}
            className={`${validValue
              ? "bg-green-700 hover:bg-green-800"
              : "bg-gray-400 cursor-not-allowed"
              } text-white py-3 rounded-md font-semibold text-base tracking-wide shadow`}
          >
            Change Password
          </button>
        </form>

        <p className='text-center text-sm mt-4 text-neutral-700'>
          Already have an account?{" "}
          <Link to={"/login"} className='font-semibold text-green-700 hover:text-green-800'>
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}

export default ResetPassword
