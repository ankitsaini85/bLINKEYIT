import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'
import { HiPencil } from "react-icons/hi"
import { MdDelete } from "react-icons/md"
import EditSubCategory from '../components/EditSubCategory'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [ImageURL, setImageURL] = useState("")
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({ _id: "" })
  const [deleteSubCategory, setDeleteSubCategory] = useState({ _id: "" })
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false)

  const fetchSubCategory = async () => {
    try {
      setLoading(true)
      const response = await Axios({ ...SummaryApi.getSubCategory })
      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubCategory()
  }, [])

  const column = [
    columnHelper.accessor('name', {
      header: "Name"
    }),
    columnHelper.accessor('image', {
      header: "Image",
      cell: ({ row }) => (
        <div className='flex justify-center items-center'>
          <img
            src={row.original.image}
            alt={row.original.name}
            className='w-10 h-10 rounded-md object-cover border cursor-pointer'
            onClick={() => setImageURL(row.original.image)}
          />
        </div>
      )
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => (
        <div className='flex flex-wrap gap-2'>
          {row.original.category.map((c) => (
            <span key={c._id} className='text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-800 shadow-sm'>
              {c.name}
            </span>
          ))}
        </div>
      )
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => (
        <div className='flex items-center justify-center gap-2'>
          <button
            onClick={() => {
              setOpenEdit(true)
              setEditData(row.original)
            }}
            className='p-2 bg-green-100 hover:bg-green-200 rounded-full text-green-700'
          >
            <HiPencil size={18} />
          </button>
          <button
            onClick={() => {
              setOpenDeleteConfirmBox(true)
              setDeleteSubCategory(row.original)
            }}
            className='p-2 bg-red-100 hover:bg-red-200 rounded-full text-red-600'
          >
            <MdDelete size={18} />
          </button>
        </div>
      )
    })
  ]

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchSubCategory()
        setOpenDeleteConfirmBox(false)
        setDeleteSubCategory({ _id: "" })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className='p-4'>
      <div className='bg-white px-4 py-3 shadow-sm rounded-md flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold text-gray-800'>Sub Categories</h2>
        <button
          onClick={() => setOpenAddSubCategory(true)}
          className='bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 text-sm font-medium transition'
        >
          + Add Sub Category
        </button>
      </div>

      <div className='overflow-auto w-full max-w-[95vw]'>
        <DisplayTable
          data={data}
          column={column}
          loading={loading}
        />
      </div>

      {openAddSubCategory && (
        <UploadSubCategoryModel
          close={() => setOpenAddSubCategory(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {ImageURL && (
        <ViewImage
          url={ImageURL}
          close={() => setImageURL("")}
        />
      )}

      {openEdit && (
        <EditSubCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {openDeleteConfirmBox && (
        <CofirmBox
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handleDeleteSubCategory}
        />
      )}
    </section>
  )
}

export default SubCategoryPage
