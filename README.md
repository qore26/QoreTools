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

### Overview
QoreTools is deployed to Render using **Docker**, since Render doesn't have native .NET runtime support. The Docker configuration automatically builds and runs your .NET application in a containerized environment.

### Prerequisites
- Render account (https://render.com)
- GitHub repository with your code
- The project includes `Dockerfile` and `render.yaml` for automatic deployment

### Deployment Steps

#### 1. Push to GitHub
```bash
git add .
git commit -m "Add Docker configuration"
git push origin main
```

Ensure these files are committed:
- `Dockerfile` - Multi-stage build configuration
- `.dockerignore` - Docker build optimization
- `render.yaml` - Render deployment configuration
- `QoreTools.csproj` - Project file with dependencies

#### 2. Connect Repository to Render

1. Go to https://render.com and sign in
2. Click **"New +"** → **"Web Service"**
3. Select **"Build and deploy from a Git repository"**
4. Connect your GitHub account and select the QoreTools repository
5. Fill in the following settings:
   - **Name**: `qoretools` (or your preferred name)
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your default branch)
   - **Runtime**: Docker (should auto-detect from Dockerfile)
   - **Plan**: Free tier (or upgrade as needed)

#### 3. Environment Variables
Render will automatically use the variables from `render.yaml`. The following are pre-configured:
- `ASPNETCORE_ENVIRONMENT=Production`
- `ASPNETCORE_URLS=http://+:8080` (configured in Dockerfile)

#### 4. Deploy
1. Click **"Create Web Service"**
2. Render will:
   - Build the Docker image from your Dockerfile
   - Push the image to its registry
   - Deploy and start your container
3. Monitor the build logs in real-time
4. Once deployed, your app will be live at: `https://qoretools-xxxxx.onrender.com`

### Accessing Your Deployment
- **Application URL**: `https://qoretools-xxxxx.onrender.com` (Render auto-assigns a unique subdomain)
- **API Base URL**: `https://qoretools-xxxxx.onrender.com/api/convert`

### How Docker Deployment Works

The `Dockerfile` uses a **multi-stage build** for efficiency:

1. **Build Stage**: 
   - Uses `mcr.microsoft.com/dotnet/sdk:10.0` (includes compiler)
   - Restores NuGet packages
   - Compiles and publishes the Release build
   - Creates optimized output in `/app/publish`

2. **Runtime Stage**:
   - Uses `mcr.microsoft.com/dotnet/aspnet:10.0` (smaller, runtime only)
   - Copies published output from build stage
   - Runs the application on port 8080
   - Sets production environment automatically

### Troubleshooting

**Build fails or deployment errors**:
- Check the build logs in Render dashboard
- Ensure all dependencies in `QoreTools.csproj` are compatible
- Verify GitHub connection is authorized

**Application won't start**:
- Check runtime logs in Render dashboard
- Verify `ASPNETCORE_ENVIRONMENT=Production` is set
- Ensure port binding is correct (should be 8080)

**Slow deployment on free tier**:
- Free tier instances may spin down after 15 minutes of inactivity
- Consider upgrading to Starter plan for consistent performance
- First request after dormancy may take 30+ seconds

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
