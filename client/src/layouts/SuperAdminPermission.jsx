import React from 'react'
import { useSelector } from 'react-redux'

const SuperAdminPermission = ({children}) => {
    const user = useSelector(state => state.user)

  return (
    <>
        {
            user.role === 'SUPERADMIN' ?  children : <p className='text-red-600 bg-red-100 p-4'>Access restricted to Super Admin only. This page is for user management.</p>
        }
    </>
  )
}

export default SuperAdminPermission
