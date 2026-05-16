import React, { useState, useRef } from 'react'
import { FaDownload, FaCloudUploadAlt } from 'react-icons/fa'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'

const BulkUploadProducts = () => {
  const [file, setFile] = useState(null)
  const [parsedData, setParsedData] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const fileInputRef = useRef(null)

  // Download sample CSV template
  const downloadTemplate = () => {
    const headers = ['name', 'price', 'discount', 'stock', 'unit', 'description', 'category', 'subCategory', 'image']
    const sampleRow = [
      'Sample Product',
      '299.99',
      '10',
      '50',
      'piece',
      'This is a sample product description',
      'Category1,Category2',
      'SubCat1,SubCat2',
      'http://image-url-1.jpg,http://image-url-2.jpg'
    ]

    const csv = [headers.join(','), sampleRow.join(',')].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'product-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Parse CSV file
  const parseCSV = (text) => {
    const lines = text.trim().split('\n')
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map(h => h.trim())
    const data = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',')
      const obj = {}

      headers.forEach((header, idx) => {
        obj[header] = values[idx]?.trim() || ''
      })

      if (obj.name && obj.price) {
        data.push(obj)
      }
    }

    return data
  }

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please select a CSV file')
      return
    }

    setFile(selectedFile)
    const reader = new FileReader()

    reader.onload = (event) => {
      const csv = event.target?.result
      const parsed = parseCSV(csv)
      setParsedData(parsed)
      setUploadResult(null)
    }

    reader.readAsText(selectedFile)
  }

  // Upload products
  const handleUpload = async () => {
    if (parsedData.length === 0) {
      toast.error('No data to upload. Please select a valid CSV file.')
      return
    }

    try {
      setUploading(true)
      const response = await Axios({
        ...SummaryApi.bulkUploadProducts,
        data: {
          products: parsedData
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setUploadResult(responseData.data)
        toast.success(`${responseData.data.insertedCount} products uploaded successfully!`)
        setParsedData([])
        setFile(null)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className='p-4'>
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>📦 Bulk Upload Products</h2>

        {/* Download Template Section */}
        <div className='mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
          <h3 className='text-lg font-semibold text-blue-900 mb-2'>Step 1: Download Template</h3>
          <p className='text-sm text-blue-800 mb-3'>
            Download the sample CSV template to see the correct format for bulk uploading products.
          </p>
          <button
            onClick={downloadTemplate}
            className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition'
          >
            <FaDownload /> Download Template
          </button>
        </div>

        {/* CSV Format Info */}
        <div className='mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200'>
          <h3 className='text-lg font-semibold text-yellow-900 mb-2'>⚠️ CSV Format Requirements</h3>
          <ul className='text-sm text-yellow-800 space-y-1'>
            <li>• <strong>name</strong> (required): Product name</li>
            <li>• <strong>price</strong> (required): Numeric price value</li>
            <li>• <strong>discount</strong> (optional): Discount percentage</li>
            <li>• <strong>stock</strong> (optional): Quantity in stock</li>
            <li>• <strong>unit</strong> (optional): Unit of measurement (default: "piece")</li>
            <li>• <strong>description</strong> (optional): Product description</li>
            <li>• <strong>category</strong> (required): Comma-separated category IDs</li>
            <li>• <strong>subCategory</strong> (required): Comma-separated subcategory IDs</li>
            <li>• <strong>image</strong> (optional): Comma-separated image URLs</li>
          </ul>
        </div>

        {/* Upload Section */}
        <div className='mb-6 p-4 bg-green-50 rounded-lg border border-green-200'>
          <h3 className='text-lg font-semibold text-green-900 mb-2'>Step 2: Upload CSV File</h3>
          <div
            onClick={() => fileInputRef.current?.click()}
            className='p-8 border-2 border-dashed border-green-300 rounded-lg text-center cursor-pointer hover:bg-green-100 transition'
          >
            <FaCloudUploadAlt size={40} className='mx-auto mb-2 text-green-600' />
            <p className='text-green-700 font-medium'>
              Click to select or drag your CSV file here
            </p>
            <p className='text-sm text-green-600'>Maximum file size: 10MB</p>
          </div>
          <input
            ref={fileInputRef}
            type='file'
            accept='.csv'
            onChange={handleFileChange}
            className='hidden'
          />
        </div>

        {/* Preview Section */}
        {parsedData.length > 0 && (
          <div className='mb-6'>
            <h3 className='text-lg font-semibold text-gray-800 mb-3'>Preview ({parsedData.length} rows)</h3>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm border'>
                <thead>
                  <tr className='bg-gray-100'>
                    <th className='border px-4 py-2 text-left'>Name</th>
                    <th className='border px-4 py-2 text-left'>Price</th>
                    <th className='border px-4 py-2 text-left'>Discount</th>
                    <th className='border px-4 py-2 text-left'>Stock</th>
                    <th className='border px-4 py-2 text-left'>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className='hover:bg-gray-50'>
                      <td className='border px-4 py-2'>{row.name}</td>
                      <td className='border px-4 py-2'>₹{row.price}</td>
                      <td className='border px-4 py-2'>{row.discount || '-'}%</td>
                      <td className='border px-4 py-2'>{row.stock || '-'}</td>
                      <td className='border px-4 py-2 text-xs'>{row.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedData.length > 5 && (
                <p className='text-sm text-gray-600 mt-2'>... and {parsedData.length - 5} more rows</p>
              )}
            </div>
          </div>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <div className='mb-6 p-4 rounded-lg border'>
            <h3 className='text-lg font-semibold text-gray-800 mb-3'>Upload Results</h3>
            <div className='grid grid-cols-2 gap-4 mb-4'>
              <div className='p-3 bg-green-100 rounded-lg'>
                <p className='text-sm text-green-700'>Successfully Inserted</p>
                <p className='text-2xl font-bold text-green-600'>{uploadResult.insertedCount}</p>
              </div>
              <div className={`p-3 rounded-lg ${uploadResult.errorCount > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                <p className={`text-sm ${uploadResult.errorCount > 0 ? 'text-red-700' : 'text-green-700'}`}>
                  Errors
                </p>
                <p className={`text-2xl font-bold ${uploadResult.errorCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {uploadResult.errorCount}
                </p>
              </div>
            </div>

            {uploadResult.errors.length > 0 && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                <p className='font-medium text-red-800 mb-2'>Errors:</p>
                <div className='space-y-1 max-h-40 overflow-y-auto'>
                  {uploadResult.errors.map((err, idx) => (
                    <p key={idx} className='text-sm text-red-700'>
                      Row {err.row}: {err.error}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex gap-3'>
          {parsedData.length > 0 && (
            <>
              <button
                onClick={() => {
                  setFile(null)
                  setParsedData([])
                  setUploadResult(null)
                }}
                className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
              >
                Clear
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className='px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition'
              >
                {uploading ? 'Uploading...' : `Upload ${parsedData.length} Products`}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default BulkUploadProducts
