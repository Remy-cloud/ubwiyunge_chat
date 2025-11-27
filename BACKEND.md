# Backend Integration Guide

## 🎯 Simple Backend for School Project

This is a lightweight backend integration for the Ubwiyunge Community Feedback Platform, designed to be simple and suitable for academic purposes.

## 🏗️ Architecture

- **Server**: Node.js with Express.js
- **Database**: SQLite3 (no setup required)
- **File Storage**: Local uploads directory
- **API**: RESTful endpoints

## 🚀 Quick Start

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api/

## 📊 API Endpoints

### Issues
- `GET /api/issues` - Get all issues
- `GET /api/issues/:id` - Get specific issue
- `POST /api/issues` - Create new issue (with photo upload)
- `PATCH /api/issues/:id/status` - Update issue status

### Leaders
- `GET /api/leaders` - Get all leaders
- `GET /api/leaders/:id` - Get specific leader

### Statistics
- `GET /api/stats` - Get platform statistics

## 🗄️ Database

The SQLite database (`ubwiyunge.db`) contains three main tables:

1. **users** - User information
2. **issues** - Community issues/reports
3. **leaders** - Government leaders information

Sample data is automatically inserted on first run.

## 📁 File Uploads

- Images uploaded to `/uploads/` directory
- Maximum file size: 10MB
- Supported formats: Images only
- Accessible via: `http://localhost:3000/uploads/filename`

## 🔧 Development

For development with auto-reload:
```bash
npm run dev
```

## 🧪 Testing API

Test the API endpoints:

```bash
# Get all issues
curl http://localhost:3000/api/issues

# Get platform statistics
curl http://localhost:3000/api/stats

# Get all leaders
curl http://localhost:3000/api/leaders
```

## 🎓 School Project Features

✅ **Simple Setup**: No complex configuration  
✅ **REST API**: Standard HTTP methods  
✅ **File Upload**: Image attachment support  
✅ **Database**: SQLite (no server required)  
✅ **Sample Data**: Pre-populated for testing  
✅ **Error Handling**: Basic error responses  
✅ **CORS**: Frontend integration enabled  

## 📝 Notes

- Database file is created automatically
- No authentication required (suitable for school project)
- All data persists between server restarts
- Frontend and backend run on same port (3000)
