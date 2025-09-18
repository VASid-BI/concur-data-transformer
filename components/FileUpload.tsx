'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Download, AlertCircle, CheckCircle } from 'lucide-react'

interface FileUploadProps {
  onFileProcessed: (file: File, result: any) => void
  onError: (error: string) => void
  result?: any
}

export default function FileUpload({ onFileProcessed, onError, result }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [excelData, setExcelData] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file type
    if (!file.name.endsWith('.txt')) {
      onError('Please upload a .txt file')
      return
    }

    setUploadedFile(file)
    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process file')
      }

      const result = await response.json()
      console.log('API Response:', result)
      console.log('Excel data received:', result.excelData ? 'Yes' : 'No')
      console.log('Excel data length:', result.excelData?.length || 0)
      setExcelData(result.excelData)
      onFileProcessed(file, result)
    } catch (error) {
      onError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }, [onFileProcessed, onError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt']
    },
    multiple: false
  })

  const downloadExcel = async () => {
    if (!uploadedFile || !excelData) {
      onError('No Excel data available for download')
      return
    }

    try {
      console.log('Starting download process...')
      console.log('Excel data length:', excelData.length)
      console.log('Uploaded file name:', uploadedFile.name)
      
      // Convert base64 to blob and download
      const binaryString = atob(excelData)
      const bytes = new Uint8Array(binaryString.length)
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      const blob = new Blob([bytes], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      
      console.log('Blob created:', blob.size, 'bytes')
      console.log('Blob type:', blob.type)
      
      // Try multiple download methods
      const filename = uploadedFile.name.replace('.txt', '_converted.xlsx')
      console.log('Download filename:', filename)
      
      // Method 1: Direct blob download
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // IE/Edge
        window.navigator.msSaveOrOpenBlob(blob, filename)
        console.log('Downloaded via IE/Edge method')
        return
      }
      
      // Method 2: Create object URL and download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.style.display = 'none'
      
      // Add to DOM, click, and remove
      document.body.appendChild(link)
      console.log('Link created and added to DOM')
      
      // Use setTimeout to ensure the link is properly added
      setTimeout(() => {
        link.click()
        console.log('Link clicked')
        
        // Cleanup after a delay
        setTimeout(() => {
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
          console.log('Cleanup completed')
        }, 100)
      }, 10)
      
    } catch (error) {
      console.error('Download error:', error)
      onError('Failed to download Excel file: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="text-lg font-medium text-gray-700">Processing your file...</p>
              <p className="text-sm text-gray-500">Converting text to Excel format</p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-700">
                  {isDragActive ? 'Drop your file here' : 'Upload your Concur text file'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Drag and drop a .txt file, or click to browse
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {uploadedFile && (
        <div className="mt-6 card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                  {excelData && <span className="ml-2 text-green-600">✓ Ready for download</span>}
                </p>
              </div>
            </div>
            <button
              onClick={downloadExcel}
              disabled={!excelData}
              className={`flex items-center space-x-2 ${
                excelData 
                  ? 'btn-primary' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Download className="h-4 w-4" />
              <span>Download Excel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
