# Ubwiyunge Community Feedback Platform

A real-time chat-based platform connecting Rwandan citizens with their local government leaders.

## 🎯 Mission
"To empower Rwandan citizens with direct digital access to their local leaders, fostering transparent governance and accountable public service delivery that strengthens democratic participation at all administrative levels."

## 🚀 Features
- Real-time chat interface between citizens and leaders
- Issue reporting with photo attachments
- Leader directory and smart routing
- Community engagement and discussions
- Mobile-first responsive design
- Multi-language support (Kinyarwanda/English)

## 🛠 Tech Stack
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: SQLite3 with Sequelize ORM
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Real-time**: WebSocket connections
- **File Storage**: Local/Cloud storage for images

## 📁 Project Structure
```
ubwiyunge_chat/
├── server.js              # Main server file
├── config/                # Configuration files
├── models/                # Database models
├── routes/                # API routes
├── middleware/            # Custom middleware
├── controllers/           # Route controllers
├── public/                # Static files (frontend)
├── uploads/               # File uploads directory
└── tests/                 # Test files
```

## 🔧 Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/ubwiyunge_chat.git
cd ubwiyunge_chat
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Access the application
- Frontend: http://localhost:3000
- API Documentation: See [BACKEND.md](./BACKEND.md)

## 📚 Documentation
- [Frontend Guide](./FRONTEND.md) - UI components and frontend features
- [Backend Guide](./BACKEND.md) - API endpoints and database schema

## 📋 Development Phases

### Phase 1: Foundation ✅
- [x] Project setup
- [x] Basic UI
- [x] Database setup
- [x] Backend API integration

### Phase 2: Core Features ✅
- [x] Issue reporting system
- [x] Leader directory
- [x] File upload functionality
- [x] REST API endpoints

### Phase 3: Enhanced Features
- [ ] Community engagement
- [ ] Notifications
- [ ] Analytics dashboard
- [ ] Multi-language support

### Phase 4: Deployment
- [ ] Security audit
- [ ] Performance optimization
- [ ] Production deployment

## 🤝 Contributing
This project is part of an academic assignment for the ALU Software Engineering program.

## 📄 License
MIT License - see LICENSE file for details.
