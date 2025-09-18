import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

// Column mapping based on your Python code
const columnsToExtract = {
  "Date_d_c": 2,
  "Partner_id": 79,
  "Quantity_n_c": 65,
  "UserName_t_c": [5, 6], // Last + First name
  "Department_t_c": 9,
  "Purpose_t_c": 68,
  "Value_n_c": 248
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.name.endsWith('.txt')) {
      return NextResponse.json(
        { error: 'File must be a .txt file' },
        { status: 400 }
      )
    }

    // Read file content
    const text = await file.text()
    const lines = text.split('\n')

    // Process the file
    const data: any[] = []
    let processedRows = 0

    for (const line of lines) {
      // Skip non-DETAIL lines
      if (!line.startsWith('DETAIL')) {
        continue
      }

      const parts = line.trim().split('|')

      // Only process if we have enough fields
      try {
        const row: any = {}
        
        for (const [colName, index] of Object.entries(columnsToExtract)) {
          if (Array.isArray(index)) {
            // Combine Last + First name
            const lastName = parts[index[0]] || ''
            const firstName = parts[index[1]] || ''
            row[colName] = `${lastName} ${firstName}`.trim()
          } else {
            row[colName] = parts[index] || ''
          }
        }
        
        data.push(row)
        processedRows++
      } catch (error) {
        // Skip lines that are shorter than expected
        continue
      }
    }

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'No valid data found in the file' },
        { status: 400 }
      )
    }

    // Create Excel workbook
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Concur Data')

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    })

    // Store the Excel data temporarily (in a real app, you might use Redis or a database)
    // For this demo, we'll return the data and let the client handle the download
    const base64Data = Buffer.from(excelBuffer).toString('base64')
    
    console.log('Excel buffer size:', excelBuffer.length)
    console.log('Base64 data length:', base64Data.length)
    console.log('Rows processed:', processedRows)

    return NextResponse.json({
      success: true,
      rowsProcessed: processedRows,
      excelData: base64Data,
      filename: file.name.replace('.txt', '_converted.xlsx')
    })

  } catch (error) {
    console.error('Conversion error:', error)
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    )
  }
}
