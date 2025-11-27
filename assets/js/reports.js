// Reports Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeReports();
    setupEventListeners();
    loadReportsData();
});

// Sample reports data
const reportsData = [
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
        submittedDate: '2024-11-25T10:30:00Z',
        assignedTo: 'Marie Chantal Rwakazina',
        lastUpdate: '2024-11-25T14:20:00Z',
        images: ['road-damage-1.jpg'],
        comments: [
            {
                id: 'c1',
                author: 'John Doe',
                text: 'This has been an ongoing issue for 3 weeks now',
                timestamp: '2024-11-25T10:35:00Z'
            }
        ]
    },
    {
        id: 'RPT-002',
        title: 'Street Light Not Working',
        description: 'Multiple street lights along KG 203 St are not functioning, creating safety concerns for evening commuters.',
        category: 'infrastructure',
        status: 'in-progress',
        priority: 'medium',
        district: 'Kicukiro',
        sector: 'Gatenga',
        location: 'KG 203 St, Gatenga Commercial Center',
        submittedBy: 'Alice Uwimana',
        submittedDate: '2024-11-24T16:45:00Z',
        assignedTo: 'Uwimana Claire',
        lastUpdate: '2024-11-25T09:15:00Z',
        images: ['streetlight-1.jpg'],
        comments: [
            {
                id: 'c2',
                author: 'Uwimana Claire',
                text: 'Report received. Technical team has been notified.',
                timestamp: '2024-11-24T17:00:00Z'
            },
            {
                id: 'c3',
                author: 'Alice Uwimana',
                text: 'Thank you for the quick response!',
                timestamp: '2024-11-24T17:05:00Z'
            }
        ]
    },
    {
        id: 'RPT-003',
        title: 'Water Supply Interruption',
        description: 'No water supply for the past 48 hours in Nyanza Cell. Residents are facing difficulties.',
        category: 'infrastructure',
        status: 'resolved',
        priority: 'high',
        district: 'Kicukiro',
        sector: 'Kicukiro',
        location: 'Nyanza Cell, Block A',
        submittedBy: 'Eric Nshimiyimana',
        submittedDate: '2024-11-22T08:20:00Z',
        assignedTo: 'Paul Rwabukwisi',
        lastUpdate: '2024-11-23T15:30:00Z',
        resolvedDate: '2024-11-23T15:30:00Z',
        images: [],
        comments: [
            {
                id: 'c4',
                author: 'Paul Rwabukwisi',
                text: 'Water utility company has been contacted. Repair crew dispatched.',
                timestamp: '2024-11-22T09:00:00Z'
            },
            {
                id: 'c5',
                author: 'Eric Nshimiyimana',
                text: 'Water supply restored. Thank you for the quick resolution!',
                timestamp: '2024-11-23T15:35:00Z'
            }
        ]
    },
    {
        id: 'RPT-004',
        title: 'Garbage Collection Delay',
        description: 'Garbage has not been collected for over a week in Kimironko Sector, causing hygiene concerns.',
        category: 'environment',
        status: 'pending',
        priority: 'medium',
        district: 'Gasabo',
        sector: 'Kimironko',
        location: 'Kimironko Market Area',
        submittedBy: 'Grace Mukamana',
        submittedDate: '2024-11-25T07:15:00Z',
        assignedTo: 'Jean Baptiste Munyangabe',
        lastUpdate: '2024-11-25T07:15:00Z',
        images: ['garbage-1.jpg', 'garbage-2.jpg'],
        comments: []
    },
    {
        id: 'RPT-005',
        title: 'School Building Roof Leak',
        description: 'Classroom roof is leaking during rainy season, disrupting classes and damaging educational materials.',
        category: 'education',
        status: 'in-progress',
        priority: 'high',
        district: 'Nyarugenge',
        sector: 'Nyarugenge',
        location: 'Nyarugenge Primary School',
        submittedBy: 'Teacher Marie',
        submittedDate: '2024-11-23T12:00:00Z',
        assignedTo: 'Kayitesi Solange',
        lastUpdate: '2024-11-24T08:30:00Z',
        images: ['roof-leak-1.jpg'],
        comments: [
            {
                id: 'c6',
                author: 'Kayitesi Solange',
                text: 'Education department has been notified. Repair budget being allocated.',
                timestamp: '2024-11-24T08:30:00Z'
            }
        ]
    },
    {
        id: 'RPT-006',
        title: 'Public Transport Safety',
        description: 'Buses are overcrowded during peak hours, creating safety risks for passengers.',
        category: 'transport',
        status: 'pending',
        priority: 'medium',
        district: 'Gasabo',
        sector: 'Remera',
        location: 'Remera Bus Station',
        submittedBy: 'David Nkunda',
        submittedDate: '2024-11-25T18:20:00Z',
        assignedTo: null,
        lastUpdate: '2024-11-25T18:20:00Z',
        images: [],
        comments: []
    }
];

let currentFilter = 'all';
let currentStatus = 'all';
let currentPriority = 'all';
let searchQuery = '';

// Initialize reports functionality
function initializeReports() {
    setupMobileMenu();
    setupNotifications();
    setupUserMenu();
    updateReportStats();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('reportSearch');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Filter functionality
    const statusFilter = document.getElementById('statusFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const dateSort = document.getElementById('dateSort');

    if (statusFilter) {
        statusFilter.addEventListener('change', handleStatusFilter);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleCategoryFilter);
    }
    if (priorityFilter) {
        priorityFilter.addEventListener('change', handlePriorityFilter);
    }
    if (dateSort) {
        dateSort.addEventListener('change', handleDateSort);
    }

    // Menu toggle for mobile
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }

    // User menu functionality
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', toggleUserMenu);
    }

    // Notifications
    const notificationsBtn = document.getElementById('notificationsBtn');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', showNotifications);
    }

    // Report new issue button
    const reportIssueBtn = document.getElementById('reportIssueBtn');
    if (reportIssueBtn) {
        reportIssueBtn.addEventListener('click', () => {
            showNotification('Redirecting to report new issue...', 'info');
            setTimeout(() => {
                window.location.href = 'index.html#report-issue';
            }, 1000);
        });
    }
}

// Load and display reports data
function loadReportsData() {
    displayReports(reportsData);
    updateReportStats();
}

// Display reports in the table
function displayReports(reports) {
    const reportsTableBody = document.getElementById('reportsTableBody');
    if (!reportsTableBody) return;

    if (reports.length === 0) {
        reportsTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">
                    <div class="empty-state">
                        <i class="fas fa-file-alt"></i>
                        <h3>No reports found</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    reportsTableBody.innerHTML = reports.map(report => createReportRow(report)).join('');
}

// Create report table row
function createReportRow(report) {
    const statusClass = report.status.replace('-', '');
    const priorityClass = report.priority;
    const timeAgo = getTimeAgo(report.submittedDate);

    return `
        <tr class="report-row" data-report-id="${report.id}" onclick="showReportDetails('${report.id}')">
            <td class="report-id">
                <span class="id-badge">${report.id}</span>
            </td>
            <td class="report-title">
                <div class="title-container">
                    <h4>${report.title}</h4>
                    <p class="description-preview">${report.description.length > 60 ? report.description.substring(0, 60) + '...' : report.description}</p>
                </div>
            </td>
            <td class="report-category">
                <span class="category-badge">${formatCategory(report.category)}</span>
            </td>
            <td class="report-status">
                <span class="status-badge ${statusClass}">${formatStatus(report.status)}</span>
            </td>
            <td class="report-priority">
                <span class="priority-badge ${priorityClass}">${report.priority.toUpperCase()}</span>
            </td>
            <td class="report-location">
                <div class="location-info">
                    <div class="location-main">${report.district}</div>
                    <div class="location-sub">${report.sector}</div>
                </div>
            </td>
            <td class="report-submitter">
                <div class="submitter-info">
                    <span class="submitter-name">${report.submittedBy}</span>
                </div>
            </td>
            <td class="report-date">
                <div class="date-info">
                    <span class="date-main">${formatDateShort(report.submittedDate)}</span>
                    <span class="date-relative">${timeAgo}</span>
                </div>
            </td>
        </tr>
    `;
}

// Handle search functionality
function handleSearch(event) {
    searchQuery = event.target.value.toLowerCase();
    filterReports();
}

// Handle status filter
function handleStatusFilter(event) {
    currentStatus = event.target.value;
    filterReports();
}

// Handle category filter
function handleCategoryFilter(event) {
    currentFilter = event.target.value;
    filterReports();
}

// Handle priority filter
function handlePriorityFilter(event) {
    currentPriority = event.target.value;
    filterReports();
}

// Handle date sort
function handleDateSort(event) {
    const sortOrder = event.target.value;
    let sortedReports = [...getFilteredReports()];
    
    if (sortOrder === 'newest') {
        sortedReports.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));
    } else if (sortOrder === 'oldest') {
        sortedReports.sort((a, b) => new Date(a.submittedDate) - new Date(b.submittedDate));
    } else if (sortOrder === 'updated') {
        sortedReports.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));
    }
    
    displayReports(sortedReports);
}

// Filter reports based on all criteria
function filterReports() {
    const filteredReports = getFilteredReports();
    displayReports(filteredReports);
    updateFilterStats(filteredReports);
}

// Get filtered reports
function getFilteredReports() {
    let filteredReports = reportsData;

    // Filter by status
    if (currentStatus !== 'all') {
        filteredReports = filteredReports.filter(report => report.status === currentStatus);
    }

    // Filter by category
    if (currentFilter !== 'all') {
        filteredReports = filteredReports.filter(report => report.category === currentFilter);
    }

    // Filter by priority
    if (currentPriority !== 'all') {
        filteredReports = filteredReports.filter(report => report.priority === currentPriority);
    }

    // Filter by search query
    if (searchQuery) {
        filteredReports = filteredReports.filter(report => 
            report.title.toLowerCase().includes(searchQuery) ||
            report.description.toLowerCase().includes(searchQuery) ||
            report.category.toLowerCase().includes(searchQuery) ||
            report.district.toLowerCase().includes(searchQuery) ||
            report.sector.toLowerCase().includes(searchQuery) ||
            report.location.toLowerCase().includes(searchQuery)
        );
    }

    return filteredReports;
}

// Show report details modal
function showReportDetails(reportId) {
    const report = reportsData.find(r => r.id === reportId);
    if (!report) return;

    // Create or update modal
    let modal = document.getElementById('reportDetailsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'reportDetailsModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }

    const statusClass = report.status.replace('-', '');
    const timeAgo = getTimeAgo(report.submittedDate);

    modal.innerHTML = `
        <div class="modal-content report-details-modal">
            <div class="modal-header">
                <div class="report-header-info">
                    <h2>${report.title}</h2>
                    <div class="report-badges">
                        <span class="status-badge ${statusClass}">${formatStatus(report.status)}</span>
                        <span class="priority-badge ${report.priority}">${report.priority.toUpperCase()}</span>
                        <span class="category-badge">${formatCategory(report.category)}</span>
                    </div>
                </div>
                <button class="close-btn" onclick="closeReportDetails()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="modal-body">
                <div class="report-details-content">
                    <div class="report-info-section">
                        <h3>Report Information</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Report ID:</label>
                                <span>${report.id}</span>
                            </div>
                            <div class="info-item">
                                <label>Submitted by:</label>
                                <span>${report.submittedBy}</span>
                            </div>
                            <div class="info-item">
                                <label>Date Submitted:</label>
                                <span>${formatDate(report.submittedDate)}</span>
                            </div>
                            <div class="info-item">
                                <label>Location:</label>
                                <span>${report.location}, ${report.sector}, ${report.district}</span>
                            </div>
                            ${report.assignedTo ? `
                                <div class="info-item">
                                    <label>Assigned to:</label>
                                    <span>${report.assignedTo}</span>
                                </div>
                            ` : ''}
                            ${report.resolvedDate ? `
                                <div class="info-item">
                                    <label>Resolved on:</label>
                                    <span>${formatDate(report.resolvedDate)}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="description-section">
                        <h3>Description</h3>
                        <p>${report.description}</p>
                    </div>

                    ${report.comments.length > 0 ? `
                        <div class="comments-section">
                            <h3>Comments & Updates</h3>
                            <div class="comments-list">
                                ${report.comments.map(comment => `
                                    <div class="comment">
                                        <div class="comment-header">
                                            <strong>${comment.author}</strong>
                                            <span class="comment-date">${formatDate(comment.timestamp)}</span>
                                        </div>
                                        <p class="comment-text">${comment.text}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeReportDetails()">Close</button>
                ${report.assignedTo ? `
                    <button class="btn btn-primary" onclick="startChatWithAssignee('${report.id}'); closeReportDetails();">
                        <i class="fas fa-comments"></i> Chat with Assignee
                    </button>
                ` : ''}
                <button class="btn btn-outline" onclick="editReport('${report.id}'); closeReportDetails();">
                    <i class="fas fa-edit"></i> Edit Report
                </button>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

// Close report details modal
function closeReportDetails() {
    const modal = document.getElementById('reportDetailsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Edit report functionality
function editReport(reportId) {
    // For now, show an alert (could be expanded to modal form)
    showNotification('Edit functionality coming soon!', 'info');
}

// Start chat with assignee
function startChatWithAssignee(reportId) {
    const report = reportsData.find(r => r.id === reportId);
    if (!report || !report.assignedTo) return;

    // Store chat target and navigate to chat
    localStorage.setItem('chatTarget', JSON.stringify({
        name: report.assignedTo,
        context: `Report: ${report.title}`,
        reportId: reportId
    }));
    
    showNotification(`Starting chat with ${report.assignedTo}...`, 'success');
    setTimeout(() => {
        window.location.href = 'chat.html';
    }, 1000);
}

// Update report statistics
function updateReportStats() {
    const stats = {
        total: reportsData.length,
        pending: reportsData.filter(r => r.status === 'pending').length,
        inProgress: reportsData.filter(r => r.status === 'in-progress').length,
        resolved: reportsData.filter(r => r.status === 'resolved').length
    };

    // Update stats display if elements exist
    const totalElement = document.getElementById('totalReports');
    const pendingElement = document.getElementById('pendingReports');
    const inProgressElement = document.getElementById('inProgressReports');
    const resolvedElement = document.getElementById('resolvedReports');

    if (totalElement) totalElement.textContent = stats.total;
    if (pendingElement) pendingElement.textContent = stats.pending;
    if (inProgressElement) inProgressElement.textContent = stats.inProgress;
    if (resolvedElement) resolvedElement.textContent = stats.resolved;
}

// Update filter statistics
function updateFilterStats(filteredReports) {
    const resultCount = document.getElementById('resultCount');
    if (resultCount) {
        resultCount.textContent = `Showing ${filteredReports.length} of ${reportsData.length} reports`;
    }
}

// Utility functions
function formatStatus(status) {
    return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatCategory(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

function getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateShort(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Mobile menu and navigation functions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

function setupMobileMenu() {
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        
        if (window.innerWidth <= 768 && 
            sidebar && 
            !sidebar.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            sidebar.classList.remove('open');
        }
    });
}

function setupNotifications() {
    // Setup notification functionality (similar to leaders.js)
}

function setupUserMenu() {
    // Setup user menu functionality (similar to leaders.js)
}

function toggleUserMenu() {
    // Toggle user menu dropdown
}

function showNotifications() {
    // Show notifications dropdown
}

function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('reportDetailsModal');
    if (modal && event.target === modal) {
        closeReportDetails();
    }
});
