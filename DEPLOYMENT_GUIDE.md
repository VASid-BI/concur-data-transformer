# Deployment Guide - Concur Data Transformer

## Quick Start

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Deploy from your project directory**:
   ```bash
   cd "/Users/sid/Desktop/Concur Data Transformation"
   vercel
   ```

3. **Follow the prompts**:
   - Link to existing project or create new
   - Choose your Vercel account
   - Confirm settings

4. **Your app will be live** at the provided Vercel URL!

### Option 2: Deploy via GitHub + Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Deploy with default settings

### Option 3: Use the deployment script

```bash
cd "/Users/sid/Desktop/Concur Data Transformation"
./scripts/deploy.sh
```

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**: [http://localhost:3000](http://localhost:3000)

## Testing the Application

1. **Upload a test file**: Use your `Rawdra.txt` file
2. **Verify conversion**: Check that all 7 columns are extracted correctly
3. **Download Excel**: Ensure the Excel file downloads properly

## Features Included

✅ **Modern Web Interface**
- Drag-and-drop file upload
- Real-time processing feedback
- Beautiful, responsive design

✅ **Robust File Processing**
- Handles large text files
- Extracts 7 specific columns from Concur data
- Error handling for malformed data

✅ **Excel Generation**
- Creates properly formatted Excel files
- Uses industry-standard XLSX format
- Maintains data integrity

✅ **Cloud Deployment Ready**
- Optimized for Vercel
- Serverless functions for scalability
- No database required

## Column Mapping

The application extracts these columns from your Concur text files:

| Column | Index | Description |
|--------|-------|-------------|
| Date_d_c | 2 | Transaction date |
| Partner_id | 79 | Partner identifier |
| Quantity_n_c | 65 | Quantity value |
| UserName_t_c | 5,6 | User name (Last + First) |
| Department_t_c | 9 | Department |
| Purpose_t_c | 68 | Purpose description |
| Value_n_c | 248 | Transaction value |

## Troubleshooting

### Common Issues

1. **File upload fails**:
   - Ensure file is .txt format
   - Check file size (should be reasonable)
   - Verify file contains "DETAIL" lines

2. **Conversion errors**:
   - Check that file follows Concur export format
   - Ensure pipe-separated values
   - Verify sufficient columns in data

3. **Deployment issues**:
   - Check Vercel CLI is installed
   - Verify all dependencies in package.json
   - Check build logs in Vercel dashboard

### Support

For issues or questions:
1. Check the console for error messages
2. Review the API response in browser dev tools
3. Test with a smaller sample file first

## Next Steps

After deployment, you can:

1. **Customize the UI**: Modify colors, layout, or branding
2. **Add authentication**: Implement user login if needed
3. **Add file validation**: More robust file format checking
4. **Add batch processing**: Handle multiple files at once
5. **Add data preview**: Show sample data before conversion

## Security Notes

- Files are processed in memory only
- No data is stored on servers
- All processing happens server-side
- HTTPS enforced on Vercel deployment
