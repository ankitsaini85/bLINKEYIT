import React, { useEffect, useState } from 'react'
import { FaCheckCircle, FaClock, FaTimes, FaTimesCircle } from 'react-icons/fa'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'

const AdminApprovalsModal = ({ isOpen, onClose }) => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getAdminApprovals,
        data: { status: activeTab, page, limit: 10 }
      })
      if (response.data.success) {
        setRequests(response.data.data)
        setTotalPages(response.data.totalPages || 1)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [activeTab])

  useEffect(() => {
    if (isOpen) {
      fetchRequests()
    }
  }, [isOpen, activeTab, page])

  const handleApprove = async (id) => {
    try {
      const response = await Axios({ ...SummaryApi.approveAdmin, data: { requestId: id } })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchRequests()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Provide rejection reason')
      return
    }
    try {
      const response = await Axios({ ...SummaryApi.rejectAdmin, data: { requestId: selectedRequest._id, rejectionReason } })
      if (response.data.success) {
        toast.success(response.data.message)
        setShowRejectModal(false)
        setRejectionReason('')
        setSelectedRequest(null)
        fetchRequests()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className='text-green-500' size={16} />
      case 'rejected':
        return <FaTimesCircle className='text-red-500' size={16} />
      default:
        return <FaClock className='text-yellow-500' size={16} />
    }
  }

  if (!isOpen) return null

  return (
    <>
      <section className='fixed inset-0 bg-black/40 z-40' onClick={onClose}></section>
      <section className='fixed inset-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white rounded-t-lg md:rounded-lg w-full md:max-w-3xl md:max-h-[90vh] flex flex-col z-50 overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 md:p-6 border-b bg-gradient-to-r from-orange-500 to-orange-600 text-white'>
          <div>
            <h2 className='text-lg md:text-xl font-bold'>Admin Approval Requests</h2>
            <p className='text-orange-100 text-xs md:text-sm mt-1'>Review and manage shopkeeper registrations</p>
          </div>
          <button onClick={onClose} className='text-white hover:text-orange-200 transition text-2xl'>
            <FaTimes size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className='flex gap-0 px-4 pt-4 border-b bg-gray-50 overflow-x-auto'>
          {['pending', 'approved', 'rejected'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setPage(1) }}
              className={`px-4 md:px-6 py-2 text-sm font-semibold capitalize whitespace-nowrap transition border-b-2 ${
                activeTab === tab 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'pending' && '⏳'} {tab === 'approved' && '✅'} {tab === 'rejected' && '❌'} {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-4 md:p-6'>
          {loading ? (
            <p className='text-center text-gray-500 py-8'>Loading requests...</p>
          ) : requests.length === 0 ? (
            <p className='text-center text-gray-500 py-8'>No {activeTab} requests</p>
          ) : (
            <div className='space-y-3'>
              {requests.map(req => (
                <div key={req._id} className='border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition'>
                  <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-4'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-2'>
                        {getStatusIcon(req.status)}
                        <h3 className='font-bold text-gray-800 text-base'>{req.name}</h3>
                      </div>
                      <div className='space-y-1 text-sm text-gray-700'>
                        <p>📧 <span className='font-medium'>{req.email}</span></p>
                        <p>📱 <span className='font-medium'>{req.phone}</span></p>
                        <p>🏪 <span className='font-medium'>{req.shopName}</span></p>
                        {req.shopDescription && <p className='text-gray-600'>📝 {req.shopDescription}</p>}
                        <p className='text-xs text-gray-500 mt-2'>Applied on {new Date(req.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        {req.rejectionReason && (
                          <div className='mt-2 p-2 bg-red-50 border border-red-200 rounded'>
                            <p className='text-xs font-medium text-red-700'>Rejection Reason:</p>
                            <p className='text-xs text-red-600 mt-1'>{req.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {activeTab === 'pending' && (
                      <div className='flex flex-col md:flex-row gap-2 w-full md:w-auto'>
                        <button 
                          onClick={() => handleApprove(req._id)} 
                          className='flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition'
                        >
                          ✓ Approve
                        </button>
                        <button 
                          onClick={() => { setSelectedRequest(req); setShowRejectModal(true) }} 
                          className='flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition'
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex items-center justify-center gap-2 p-4 border-t bg-gray-50'>
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => Math.max(p - 1, 1))} 
              className='px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-100 transition'
            >
              ← Previous
            </button>
            <span className='text-sm font-medium text-gray-700'>Page <span className='font-bold text-orange-600'>{page}</span> of <span className='font-bold text-orange-600'>{totalPages}</span></span>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(p => Math.min(p + 1, totalPages))} 
              className='px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-100 transition'
            >
              Next →
            </button>
          </div>
        )}
      </section>

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <section className='fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-0 md:p-4'>
          <div className='bg-white rounded-t-lg md:rounded-lg p-4 md:p-6 max-w-md w-full md:mx-auto'>
            <h3 className='text-lg md:text-xl font-bold text-gray-800 mb-2'>Reject Request</h3>
            <p className='text-sm text-gray-600 mb-4'>Rejecting <span className='font-medium'>{selectedRequest?.name}</span>'s admin application</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className='w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition text-sm'
              placeholder='Provide reason for rejection (required)'
            />
            <div className='flex gap-2'>
              <button 
                onClick={() => { setShowRejectModal(false); setRejectionReason('') }} 
                className='flex-1 border border-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition'
              >
                Cancel
              </button>
              <button 
                onClick={handleReject} 
                className='flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition'
              >
                Reject
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default AdminApprovalsModal
