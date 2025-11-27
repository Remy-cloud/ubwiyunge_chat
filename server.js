const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for development
    crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Middleware
app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Sample data for development
let reports = [
    {
        id: 'RPT-001',
        title: 'Road Repair Needed',
        description: 'Potholes on KN 15 Ave need urgent attention. The road has become dangerous for both vehicles and pedestrians.',
        category: 'infrastructure',
        status: 'pending',
        priority: 'high',
        district: 'Gasabo',
        sector: 'Kacyiru',
        location: 'KN 15 Ave, near Nakumatt',
        submittedBy: 'John Doe',
        submittedDate: new Date('2024-11-25T10:30:00Z'),
        assignedTo: 'Marie Chantal Rwakazina',
        lastUpdate: new Date('2024-11-25T14:20:00Z'),
        images: [],
        comments: []
    },
    {
        id: 'RPT-002',
        title: 'Street Light Not Working',
        description: 'Multiple street lights along KG 203 St are not functioning, creating safety concerns.',
        category: 'infrastructure',
        status: 'in-progress',
        priority: 'medium',
        district: 'Kicukiro',
        sector: 'Gatenga',
        location: 'KG 203 St, Gatenga Commercial Center',
        submittedBy: 'Alice Uwimana',
        submittedDate: new Date('2024-11-24T16:45:00Z'),
        assignedTo: 'Uwimana Claire',
        lastUpdate: new Date('2024-11-25T09:15:00Z'),
        images: [],
        comments: []
    }
];

let users = [
    {
        id: 'user-1',
        username: 'johndoe',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+250 788 123 456',
        location: 'Kigali, Rwanda',
        role: 'citizen',
        isVerified: true,
        createdDate: new Date('2024-01-15T10:30:00Z')
    }
];

// API Routes

// Get all reports
app.get('/api/reports', (req, res) => {
    const { status, category, priority, search } = req.query;
    let filteredReports = reports;

    if (status && status !== 'all') {
        filteredReports = filteredReports.filter(report => report.status === status);
    }

    if (category && category !== 'all') {
        filteredReports = filteredReports.filter(report => report.category === category);
    }

    if (priority && priority !== 'all') {
        filteredReports = filteredReports.filter(report => report.priority === priority);
    }

    if (search) {
        const searchLower = search.toLowerCase();
        filteredReports = filteredReports.filter(report =>
            report.title.toLowerCase().includes(searchLower) ||
            report.description.toLowerCase().includes(searchLower) ||
            report.location.toLowerCase().includes(searchLower)
        );
    }

    res.json(filteredReports);
});

// Get single report
app.get('/api/reports/:id', (req, res) => {
    const report = reports.find(r => r.id === req.params.id);
    if (!report) {
        return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
});

// Create new report
app.post('/api/reports', (req, res) => {
    const {
        title,
        description,
        category,
        district,
        sector,
        location,
        priority = 'medium',
        submittedBy = 'Anonymous'
    } = req.body;

    if (!title || !description || !category || !district || !sector) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const newReport = {
        id: 'RPT-' + String(Date.now()).slice(-6).padStart(3, '0'),
        title,
        description,
        category,
        status: 'pending',
        priority,
        district,
        sector,
        location: location || `${sector}, ${district}`,
        submittedBy,
        submittedDate: new Date(),
        assignedTo: null,
        lastUpdate: new Date(),
        images: [],
        comments: []
    };

    reports.unshift(newReport);
    res.status(201).json(newReport);
});

// Update report
app.put('/api/reports/:id', (req, res) => {
    const reportIndex = reports.findIndex(r => r.id === req.params.id);
    if (reportIndex === -1) {
        return res.status(404).json({ error: 'Report not found' });
    }

    const updatedReport = {
        ...reports[reportIndex],
        ...req.body,
        lastUpdate: new Date()
    };

    reports[reportIndex] = updatedReport;
    res.json(updatedReport);
});

// Add comment to report
app.post('/api/reports/:id/comments', (req, res) => {
    const report = reports.find(r => r.id === req.params.id);
    if (!report) {
        return res.status(404).json({ error: 'Report not found' });
    }

    const { text, author = 'Anonymous' } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Comment text is required' });
    }

    const comment = {
        id: 'c' + Date.now(),
        author,
        text,
        timestamp: new Date()
    };

    report.comments.push(comment);
    report.lastUpdate = new Date();

    res.status(201).json(comment);
});

// Get dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
    const stats = {
        totalReports: reports.length,
        pendingReports: reports.filter(r => r.status === 'pending').length,
        inProgressReports: reports.filter(r => r.status === 'in-progress').length,
        resolvedReports: reports.filter(r => r.status === 'resolved').length,
        totalUsers: users.length,
        activeLeaders: 8 // Static for demo
    };

    res.json(stats);
});

// Get recent reports for dashboard
app.get('/api/dashboard/recent-reports', (req, res) => {
    const recentReports = reports
        .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
        .slice(0, 5);
    
    res.json(recentReports);
});

// User authentication endpoints
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Simple authentication for demo
    const user = users.find(u => u.email === email);
    if (user && password === 'password123') {
        const { password: _, ...userWithoutPassword } = user;
        res.json({ 
            success: true, 
            user: userWithoutPassword,
            token: 'demo-token-' + Date.now()
        });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

app.post('/api/auth/register', (req, res) => {
    const { email, username, firstName, lastName, phone, location } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
        return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const newUser = {
        id: 'user-' + Date.now(),
        username,
        email,
        firstName,
        lastName,
        phone,
        location,
        role: 'citizen',
        isVerified: false,
        createdDate: new Date()
    };

    users.push(newUser);
    res.status(201).json({ success: true, message: 'User created successfully' });
});

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/leaders', (req, res) => {
    res.sendFile(path.join(__dirname, 'leaders.html'));
});

app.get('/reports', (req, res) => {
    res.sendFile(path.join(__dirname, 'reports.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        service: 'Ubwiyunge Community Platform API'
    });
});

// 404 handler
app.use('*', (req, res) => {
    if (req.originalUrl.startsWith('/api/')) {
        res.status(404).json({ error: 'API endpoint not found' });
    } else {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Ubwiyunge Community Platform Server Started');
    console.log('📍 Server running on http://localhost:' + PORT);
    console.log('📊 API available at http://localhost:' + PORT + '/api');
    console.log('🏠 Dashboard: http://localhost:' + PORT);
    console.log('👥 Leaders: http://localhost:' + PORT + '/leaders');
    console.log('📋 Reports: http://localhost:' + PORT + '/reports');
    console.log('💬 Chat: http://localhost:' + PORT + '/chat');
    console.log('👤 Profile: http://localhost:' + PORT + '/profile');
    console.log('💚 Server ready for connections...\n');
});

module.exports = app;
