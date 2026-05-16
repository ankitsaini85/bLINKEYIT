import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6"
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { Link, useNavigate } from 'react-router-dom'
import fetchUserDetails from '../utils/fetchUserDetails'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../store/userSlice'

const SuperAdminLogin = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const validValue = Object.values(data).every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios({
                ...SummaryApi.superAdminLogin,
                data: data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                localStorage.setItem('accesstoken', response.data.data.accesstoken)
                localStorage.setItem('refreshToken', response.data.data.refreshToken)

                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                setData({ email: "", password: "" })
                navigate("/dashboard/users")
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-6 w-full max-w-lg mx-auto rounded-lg p-8 shadow-lg border-2 border-purple-200'>

                <div className='text-center mb-6'>
                    <h2 className='text-2xl font-semibold text-purple-900'>Super Admin Login</h2>
                    <p className='text-sm text-gray-600 mt-2'>Restricted access for system administrators only</p>
                </div>

                <form className='grid gap-5' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='email' className='text-sm text-neutral-800 font-medium'>Email:</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter superadmin email'
                            className='bg-purple-50 p-3 border border-purple-300 rounded text-neutral-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none'
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='password' className='text-sm text-neutral-800 font-medium'>Password:</label>
                        <div className='bg-purple-50 p-3 border border-purple-300 rounded flex items-center focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-200'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter superadmin password'
                                className='w-full outline-none bg-transparent text-neutral-900 placeholder:text-gray-400'
                            />
                            <div onClick={() => setShowPassword(prev => !prev)} className='cursor-pointer text-lg text-gray-600 ml-2'>
                                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={!validValue}
                        className={`${validValue
                            ? "bg-purple-700 hover:bg-purple-800"
                            : "bg-gray-400 cursor-not-allowed"
                            } text-white py-3 rounded-md font-semibold text-base tracking-wide shadow`}
                    >
                        Super Admin Login
                    </button>
                </form>

                <p className='text-center text-sm mt-4 text-neutral-700'>
                    <Link to={"/login"} className='font-semibold text-purple-700 hover:text-purple-800'>
                        ← Back to Login
                    </Link>
                </p>
            </div>
        </section>
    )
}

export default SuperAdminLogin
