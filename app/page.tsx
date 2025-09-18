'use client'

import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'

interface ConversionResult {
  rowsProcessed: number
  filename: string
  success: boolean
}

export default function Home() {
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileProcessed = (file: File, conversionResult: any) => {
    setResult({
      rowsProcessed: conversionResult.rowsProcessed,
      filename: file.name,
      success: true
    })
    setError(null)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setResult(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Concur Data Transformer
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Convert your Concur text files to Excel format with just a few clicks. 
          Upload your .txt file and get a properly formatted Excel spreadsheet instantly.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Instructions */}
        <div className="card mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How it works</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Upload your Concur text file (.txt format)</li>
                <li>• The system extracts 7 key columns: Date, Partner ID, Quantity, User Name, Department, Purpose, and Value</li>
                <li>• Download your converted Excel file instantly</li>
                <li>• All data is processed securely and never stored</li>
              </ul>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <FileUpload 
          onFileProcessed={handleFileProcessed}
          onError={handleError}
          result={result}
        />

        {/* Success Message */}
        {result && (
          <div className="mt-8 card border-green-200 bg-green-50">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Conversion Successful!</h3>
                <p className="text-sm text-green-700">
                  Processed {result.rowsProcessed} rows from {result.filename}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-8 card border-red-200 bg-red-50">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fast Processing</h3>
            <p className="text-sm text-gray-600">
              Convert large text files to Excel in seconds with our optimized processing engine.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-sm text-gray-600">
              Your files are processed locally and never stored on our servers.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Accurate Results</h3>
            <p className="text-sm text-gray-600">
              Precisely extracts the 7 key columns from your Concur data with 100% accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
