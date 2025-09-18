import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { excelData } = await request.json()

    if (!excelData) {
      return NextResponse.json(
        { error: 'No Excel data provided' },
        { status: 400 }
      )
    }

    // Convert base64 back to buffer
    const buffer = Buffer.from(excelData, 'base64')

    // Return the Excel file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="concur_data.xlsx"',
      },
    })

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    )
  }
}
