# Concur Data Transformer

A modern web application that converts Concur text files to Excel format. Built with Next.js and deployed on Vercel.

## Features

- 🚀 **Fast Processing**: Convert large text files to Excel in seconds
- 🔒 **Secure & Private**: Files are processed locally and never stored
- 📊 **Accurate Results**: Precisely extracts 7 key columns from Concur data
- 🎨 **Modern UI**: Beautiful, responsive interface with drag-and-drop upload
- ☁️ **Cloud Ready**: Deploy instantly to Vercel

## What it does

This application processes Concur text files and extracts the following 7 columns:

1. **Date_d_c** - Transaction date
2. **Partner_id** - Partner identifier
3. **Quantity_n_c** - Quantity value
4. **UserName_t_c** - User name (Last + First)
5. **Department_t_c** - Department
6. **Purpose_t_c** - Purpose description
7. **Value_n_c** - Transaction value

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd concur-data-transformer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to configure your project.

### Option 2: Deploy via GitHub

1. Push your code to a GitHub repository
2. Connect your GitHub account to Vercel
3. Import your repository in Vercel dashboard
4. Deploy with one click

### Option 3: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure build settings (should auto-detect Next.js)
5. Deploy

## File Format

The application expects Concur text files with the following format:

- Each line should start with "DETAIL" for data rows
- Data is pipe-separated (|)
- The application extracts specific column indexes based on the Concur export format

## API Endpoints

### POST /api/convert

Converts uploaded text file to Excel format.

**Request:**
- Content-Type: multipart/form-data
- Body: file (text file)

**Response:**
```json
{
  "success": true,
  "rowsProcessed": 559,
  "excelData": "base64-encoded-excel-data",
  "filename": "converted_file.xlsx"
}
```

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **File Processing**: SheetJS (xlsx)
- **File Upload**: react-dropzone
- **Icons**: Lucide React
- **Deployment**: Vercel

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── convert/route.ts    # File conversion API
│   │   └── download/route.ts   # File download API
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   └── FileUpload.tsx          # File upload component
├── package.json                # Dependencies
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── vercel.json                 # Vercel deployment config
└── README.md                   # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues or questions, please create an issue in the GitHub repository.
