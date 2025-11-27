/**
 * UBWIYUNGE COMMUNITY FEEDBACK PLATFORM
 * Main Application Controller
 */

class UbwiyungeApp {
    constructor() {
        this.currentUser = null;
        this.apiBaseUrl = window.location.origin;
        this.init();
    }

    init() {
        this.initializeDemoData(); // Initialize demo data first
        this.setupEventListeners();
        this.loadUserSession();
        this.loadDashboardData();
    }

    // Initialize demo data for the platform
    initializeDemoData() {
        // Initialize demo reports if none exist
        const existingReports = localStorage.getItem('ubwiyunge_reports');
        if (!existingReports || JSON.parse(existingReports).length === 0) {
            const demoReports = [
                {
                    id: 'report_demo_1',
                    title: 'Road Repair Needed on KN 15 Ave',
                    category: 'infrastructure',
                    description: 'There are multiple potholes on KN 15 Ave near Nakumatt that need urgent repair. The road has become dangerous for both vehicles and pedestrians, especially during rainy season.',
                    district: 'Gasabo',
                    sector: 'Kacyiru',
                    specificLocation: 'KN 15 Ave, near Nakumatt',
                    status: 'pending',
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    reporterName: 'Jean Uwimana'
                },
                {
                    id: 'report_demo_2',
                    title: 'Street Lights Not Working',
                    category: 'infrastructure',
                    description: 'Multiple street lights along KG 203 St are not functioning for the past week. This creates safety concerns for residents walking at night.',
                    district: 'Kicukiro',
                    sector: 'Gatenga',
                    specificLocation: 'KG 203 St, Gatenga Commercial Center',
                    status: 'in-progress',
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    reporterName: 'Alice Mukamana'
                },
                {
                    id: 'report_demo_3',
                    title: 'Water Supply Interruption',
                    category: 'infrastructure',
                    description: 'Residents in Kimironko sector have been experiencing frequent water supply interruptions for the past two weeks. This is affecting daily life and businesses.',
                    district: 'Gasabo',
                    sector: 'Kimironko',
                    specificLocation: 'Kimironko Market Area',
                    status: 'pending',
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    reporterName: 'Patrick Habimana'
                },
                {
                    id: 'report_demo_4',
                    title: 'Garbage Collection Delayed',
                    category: 'environment',
                    description: 'Garbage has not been collected in our area for over a week. The situation is becoming a health hazard.',
                    district: 'Nyarugenge',
                    sector: 'Nyamirambo',
                    specificLocation: 'Near Nyamirambo Stadium',
                    status: 'resolved',
                    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                    reporterName: 'Marie Claire'
                },
                {
                    id: 'report_demo_5',
                    title: 'School Building Needs Repair',
                    category: 'education',
                    description: 'The roof of the primary school building is leaking during rain, making it difficult for students to learn.',
                    district: 'Gasabo',
                    sector: 'Remera',
                    specificLocation: 'GS Remera Primary School',
                    status: 'in-progress',
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    reporterName: 'Emmanuel Niyonzima'
                }
            ];
            localStorage.setItem('ubwiyunge_reports', JSON.stringify(demoReports));
        }
    }

    setupEventListeners() {
        // Quick Actions
        const reportIssueBtn = document.getElementById('reportIssueBtn');
        const findLeaderBtn = document.getElementById('findLeaderBtn');
        const startChatBtn = document.getElementById('startChatBtn');

        if (reportIssueBtn) {
            reportIssueBtn.addEventListener('click', () => this.showReportIssueModal());
        }

        if (findLeaderBtn) {
            findLeaderBtn.addEventListener('click', () => {
                window.location.href = 'leaders.html';
            });
        }

        if (startChatBtn) {
            startChatBtn.addEventListener('click', () => {
                window.location.href = 'chat.html';
            });
        }

        // Report Issue Form
        const reportForm = document.getElementById('reportIssueForm');
        if (reportForm) {
            reportForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleReportIssueSubmission();
            });
        }

        // Menu toggle for mobile
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // User menu dropdown
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserDropdown();
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
                    this.closeUserDropdown();
                }
            });
        }
    }

    loadUserSession() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    loadDashboardData() {
        this.updateDashboardStats();
        this.loadRecentCases();
    }

    updateDashboardStats() {
        const reports = JSON.parse(localStorage.getItem('ubwiyunge_reports') || '[]');
        
        const stats = {
            pending: reports.filter(r => r.status === 'pending').length,
            inProgress: reports.filter(r => r.status === 'in-progress').length,
            resolved: reports.filter(r => r.status === 'resolved').length
        };

        document.getElementById('pendingIssues').textContent = stats.pending;
        document.getElementById('inProgressIssues').textContent = stats.inProgress;
        document.getElementById('resolvedIssues').textContent = stats.resolved;
    }

    loadRecentCases() {
        const recentCasesContainer = document.getElementById('recentCases');
        if (!recentCasesContainer) return;

        const reports = JSON.parse(localStorage.getItem('ubwiyunge_reports') || '[]');
        
        if (reports.length === 0) {
            recentCasesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>No recent cases</h3>
                    <p>No issues have been reported recently.</p>
                </div>
            `;
            return;
        }

        const recentReports = reports
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);

        recentCasesContainer.innerHTML = recentReports.map(report => `
            <div class="case-card">
                <div class="case-status ${report.status || 'pending'}"></div>
                <div class="case-content">
                    <h4 class="case-title">${report.title}</h4>
                    <p class="case-description">${this.truncateText(report.description, 100)}</p>
                    <div class="case-meta">
                        <span class="case-date">${this.formatTimeAgo(report.createdAt)}</span>
                        <span class="case-location">${report.sector}, ${report.district}</span>
                        <span class="case-category">${report.category}</span>
                    </div>
                </div>
                <div class="case-actions">
                    <button class="btn-icon" onclick="window.app.showCaseDetails('${report.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    showReportIssueModal() {
        const modal = document.getElementById('reportIssueModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    hideReportIssueModal() {
        const modal = document.getElementById('reportIssueModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    async handleReportIssueSubmission() {
        const form = document.getElementById('reportIssueForm');
        const formData = new FormData(form);
        
        const issueData = {
            id: 'report_' + Date.now(),
            title: formData.get('issueTitle'),
            category: formData.get('issueCategory'),
            description: formData.get('issueDescription'),
            district: formData.get('issueDistrict'),
            sector: formData.get('issueSector'),
            specificLocation: formData.get('specificLocation'),
            status: 'pending',
            createdAt: new Date().toISOString(),
            reporterName: this.currentUser ? 
                `${this.currentUser.firstName} ${this.currentUser.lastName}` : 
                'Anonymous'
        };

        try {
            // Save to localStorage
            const reports = JSON.parse(localStorage.getItem('ubwiyunge_reports') || '[]');
            reports.unshift(issueData);
            localStorage.setItem('ubwiyunge_reports', JSON.stringify(reports));

            // Show success message
            this.showNotification('Issue reported successfully! Redirecting to reports page...', 'success');
            
            // Reset form and close modal
            form.reset();
            this.hideReportIssueModal();

            // Refresh dashboard
            this.loadDashboardData();

            // Redirect to reports page after a short delay
            setTimeout(() => {
                window.location.href = 'reports.html';
            }, 1500);

        } catch (error) {
            console.error('Error submitting issue:', error);
            this.showNotification('Failed to submit issue. Please try again.', 'error');
        }
    }

    showCaseDetails(caseId) {
        const reports = JSON.parse(localStorage.getItem('ubwiyunge_reports') || '[]');
        const report = reports.find(r => r.id === caseId);
        
        if (!report) {
            this.showNotification('Case not found', 'error');
            return;
        }

        // Create and show modal
        this.createCaseDetailsModal(report);
    }

    createCaseDetailsModal(report) {
        // Remove existing modal if any
        const existingModal = document.getElementById('caseDetailsModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'caseDetailsModal';
        modal.className = 'modal';
        
        const location = report.specificLocation ? 
            `${report.specificLocation}, ${report.sector}, ${report.district}` : 
            `${report.sector}, ${report.district}`;
        
        modal.innerHTML = `
            <div class="modal-content case-details-modal">
                <div class="modal-header">
                    <h2 class="modal-title">Case Details</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="case-header">
                        <h3 class="case-title">${report.title}</h3>
                        <div class="case-badges">
                            <span class="status-badge status-${report.status || 'pending'}">${report.status || 'Pending'}</span>
                        </div>
                    </div>
                    
                    <div class="case-info-grid">
                        <div class="info-item">
                            <label>Category:</label>
                            <span>${report.category}</span>
                        </div>
                        <div class="info-item">
                            <label>Location:</label>
                            <span>${location}</span>
                        </div>
                        <div class="info-item">
                            <label>Reported on:</label>
                            <span>${this.formatDate(report.createdAt)}</span>
                        </div>
                        <div class="info-item">
                            <label>Reported by:</label>
                            <span>${report.reporterName || 'Anonymous'}</span>
                        </div>
                    </div>
                    
                    <div class="case-description">
                        <h4>Description</h4>
                        <p>${report.description}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    toggleUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    closeUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }

    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('active');
    }
}

// Initialize the application
window.app = new UbwiyungeApp();
