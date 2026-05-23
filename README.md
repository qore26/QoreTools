# QoreTools - Beautiful File Conversion Platform

QoreTools is a modern, beautiful web application for converting files between various formats. Built with ASP.NET Core and featuring a stunning dark-themed UI with smooth animations.

## Features

✨ **Beautiful Dark UI** - Modern dark theme with stunning animations and gradients
📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
🚀 **Fast Conversion** - Quick file conversion with real-time progress tracking
🎨 **Multiple Formats** - Support for documents, images, and archives
🔒 **Secure** - Files are processed server-side and never stored permanently
💾 **File Preview** - Preview converted images directly in the browser
⬇️ **Easy Download** - One-click download of converted files
🎯 **User-Friendly** - Intuitive drag-and-drop interface

## Supported Formats

### Documents
- PDF
- Word (DOCX, DOC)
- Text (TXT)
- Excel (XLSX)
- PowerPoint (PPTX)

### Images
- JPEG/JPG
- PNG
- GIF
- BMP
- WebP
- SVG

### Archives
- ZIP
- RAR
- 7Z

## Technology Stack

- **Backend**: ASP.NET Core (.NET 10)
- **Frontend**: HTML5, CSS3, JavaScript
- **Image Processing**: SixLabors.ImageSharp
- **Styling**: Custom CSS with animations and gradients

## Local Development Setup

### Prerequisites
- .NET 10 SDK or later
- Visual Studio Code or Visual Studio 2022+

### Installation

1. Clone or download the project:
```bash
cd QoreTools
```

2. Restore NuGet packages:
```bash
dotnet restore
```

3. Run the application:
```bash
dotnet run
```

4. Open your browser and navigate to:
```
https://localhost:5001
```
or
```
http://localhost:5000
```

## Building for Production

### Build Release Version
```bash
dotnet build -c Release
```

### Publish
```bash
dotnet publish -c Release -o ./publish
```

## Deployment to Render

### Prerequisites
- Render account (https://render.com)
- GitHub repository with your code

### Deployment Steps

1. **Push to GitHub**
   - Create a GitHub repository
   - Push the QoreTools project to GitHub

2. **Connect to Render**
   - Go to https://render.com
   - Click "New +" and select "Web Service"
   - Connect your GitHub account
   - Select the QoreTools repository

3. **Configure Deployment**
   - **Name**: QoreTools
   - **Environment**: .NET
   - **Build Command**: `dotnet build -c Release`
   - **Start Command**: `dotnet QoreTools.dll --urls "http://0.0.0.0:${PORT}"`
   - **Instance Type**: Free (or paid for better performance)

4. **Environment Variables**
   - Add `ASPNETCORE_ENVIRONMENT=Production`
   - Add `ASPNETCORE_URLS=http://0.0.0.0:10000` (Render uses port 10000)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for the deployment to complete
   - Your site will be available at `https://your-app-name.onrender.com`

## API Endpoints

### Convert File
```
POST /api/convert
Content-Type: multipart/form-data

Parameters:
- file (IFormFile): The file to convert
- sourceFormat (string): Source format (e.g., "pdf", "jpg")
- targetFormat (string): Target format (e.g., "png", "docx")
- quality (int): Quality level 1-100 (default: 90)

Returns: Converted file as binary
```

### Get Supported Formats
```
GET /api/convert/formats

Returns:
{
  "documents": ["pdf", "docx", "doc", "txt", "xlsx", "pptx"],
  "images": ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"],
  "archives": ["zip", "rar", "7z"]
}
```

## Project Structure

```
QoreTools/
├── wwwroot/                    # Static files
│   ├── index.html             # Main HTML
│   ├── css/
│   │   └── styles.css         # All styles and animations
│   ├── js/
│   │   └── app.js             # Frontend JavaScript
│   └── assets/                # Images, logos, etc.
├── Controllers/
│   └── ConvertController.cs    # API endpoints
├── Services/
│   └── FileConversionService.cs # Business logic
├── Program.cs                  # Application startup
├── QoreTools.csproj           # Project file
└── README.md                  # This file
```

## Features in Detail

### Drag & Drop Upload
- Users can drag files directly onto the upload zone
- Visual feedback with hover effects
- Click to browse alternative

### Format Selection
- Dynamically updated target formats based on source
- Only valid conversion combinations available
- Quality slider for image conversions

### Real-time Progress
- Visual progress bar during conversion
- Percentage display
- Animated progress fill

### File Preview
- Image previews display immediately after conversion
- File size and name information
- Easy identify converted content

### Download Management
- One-click file download
- Automatic filename generation
- Browser-based download (no server storage)

## Performance Optimization

- Static file caching headers
- GZIP compression enabled
- CSS and JavaScript minification ready
- Lazy loading for images
- Efficient image processing with SixLabors.ImageSharp

## Security Features

- File size validation (50 MB limit)
- Format validation before conversion
- No permanent file storage
- CORS properly configured
- Content-Type validation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Customization

### Change Colors
Edit the CSS variables in `wwwroot/css/styles.css`:
```css
:root {
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --primary-light: #818cf8;
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    /* ... other variables ... */
}
```

### Add New Formats
Update the `conversionMap` in:
- `wwwroot/js/app.js` (frontend)
- `Services/FileConversionService.cs` (backend)

### Adjust File Size Limit
Edit `MaxFileSize` in `Controllers/ConvertController.cs`:
```csharp
private const long MaxFileSize = 50 * 1024 * 1024; // Change this value
```

## License

This project is provided as-is for your use.

## Support & Feedback

For issues or feature requests, please check the project repository or contact support.

---

**Made with ❤️ - Qore Team**
