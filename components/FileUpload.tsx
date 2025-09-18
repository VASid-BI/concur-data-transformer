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
      // Convert base64 to blob and download
      const byteCharacters = atob(excelData)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = uploadedFile.name.replace('.txt', '_converted.xlsx')
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
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
