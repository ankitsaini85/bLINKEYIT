import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from '../utils/isAdmin'
import AdminApprovalsModal from './AdminApprovalsModal'

const UserMenu = ({close}) => {
   const user = useSelector((state)=> state.user)
   const dispatch = useDispatch()
   const navigate = useNavigate()
  const [openApprovals, setOpenApprovals] = useState(false)

   const handleLogout = async()=>{
        try {
          const response = await Axios({
             ...SummaryApi.logout
          })
          console.log("logout",response)
          if(response.data.success){
            if(close){
              close()
            }
            dispatch(logout())
            localStorage.clear()
            toast.success(response.data.message)
            navigate("/")
          }
        } catch (error) {
          console.log(error)
          AxiosToastError(error)
        }
   }

   const handleClose = ()=>{
      if(close){
        close()
      }
   }
  return (
    <div className='p-4 space-y-4'>
        {/* Account Header */}
        <div>
          <div className='font-bold text-gray-800 text-sm md:text-base'>My Account</div>
          <div className='text-xs md:text-sm flex items-center gap-2 mt-1 p-2 bg-orange-50 rounded-lg'>
            <span className='max-w-52 text-ellipsis line-clamp-1 font-medium text-gray-700'>{user.name || user.mobile}</span>
            {user.role !== "USER" && <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              user.role === "SUPERADMIN" ? "bg-red-100 text-red-700" : "bg-purple-100 text-purple-700"
            }`}>{user.role === "SUPERADMIN" ? "Super Admin" : "Admin"}</span>}
            <Link onClick={handleClose} to={"/dashboard/profile"} className='ml-auto hover:text-orange-600 transition'>
              <HiOutlineExternalLink size={16}/>
            </Link>
          </div>
        </div>

        <Divider/>

        {/* Menu Items */}
        <div className='text-sm space-y-1'>
            {user.role === "ADMIN" && (
              <Link onClick={handleClose} to={"/dashboard/category"} className='block px-3 py-2 rounded-lg hover:bg-orange-100 text-gray-700 hover:text-orange-700 font-medium transition'>📁 Category</Link>
            )}

            {user.role === "ADMIN" && (
              <Link onClick={handleClose} to={"/dashboard/subcategory"} className='block px-3 py-2 rounded-lg hover:bg-orange-100 text-gray-700 hover:text-orange-700 font-medium transition'>📂 Sub Category</Link>
            )}

            {user.role === "ADMIN" && (
              <Link onClick={handleClose} to={"/dashboard/upload-product"} className='block px-3 py-2 rounded-lg hover:bg-orange-100 text-gray-700 hover:text-orange-700 font-medium transition'>⬆️ Upload Product</Link>
            )}

            {user.role === "ADMIN" && (
              <Link onClick={handleClose} to={"/dashboard/product"} className='block px-3 py-2 rounded-lg hover:bg-orange-100 text-gray-700 hover:text-orange-700 font-medium transition'>📦 Products</Link>
            )}

            {user.role === "SUPERADMIN" && (
              <Link onClick={handleClose} to={"/dashboard/users"} className='block px-3 py-2 rounded-lg hover:bg-orange-100 text-gray-700 hover:text-orange-700 font-medium transition'>👥 Users</Link>
            )}

            {user.role === "SUPERADMIN" && (
              <button onClick={() => setOpenApprovals(true)} className='w-full text-left px-3 py-2 rounded-lg hover:bg-orange-100 text-gray-700 hover:text-orange-700 font-medium transition'>✅ Admin Approvals</button>
            )}

            {user.role === "ADMIN" && (
              <Link onClick={handleClose} to={"/dashboard/analytics"} className='block px-3 py-2 rounded-lg hover:bg-orange-100 text-gray-700 hover:text-orange-700 font-medium transition'>📊 Analytics</Link>
            )}

            {user.role === "ADMIN" && (
              <Link onClick={handleClose} to={"/dashboard/bulk-upload"} className='block px-3 py-2 rounded-lg hover:bg-orange-100 text-gray-700 hover:text-orange-700 font-medium transition'>📥 Bulk Upload</Link>
            )}

            {/* Common Items */}
            <Divider />

            <Link onClick={handleClose} to={"/dashboard/myorders"} className='block px-3 py-2 rounded-lg hover:bg-blue-100 text-gray-700 hover:text-blue-700 font-medium transition'>🛒 My Orders</Link>

            <Link onClick={handleClose} to={"/dashboard/address"} className='block px-3 py-2 rounded-lg hover:bg-blue-100 text-gray-700 hover:text-blue-700 font-medium transition'>📍 Save Address</Link>

            <button onClick={handleLogout} className='w-full text-left px-3 py-2 rounded-lg hover:bg-red-100 text-gray-700 hover:text-red-700 font-medium transition'>🚪 Log Out</button>
        </div>

        <AdminApprovalsModal isOpen={openApprovals} onClose={() => setOpenApprovals(false)} />
    </div>
  )
}

export default UserMenu