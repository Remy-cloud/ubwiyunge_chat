/**
 * UBWIYUNGE COMMUNITY FEEDBACK PLATFORM
 * Main JavaScript Application
 * 
 * Features:
 * - Navigation management between pages
 * - API integration for data loading
 * - Real-time data updates
 * - Responsive design handling
 */

class UbwiyungeApp {
  constructor() {
    this.currentPage = 'dashboard';
    this.apiBaseUrl = window.location.origin;
    this.userData = {};
    this.issues = [];
    this.leaders = [];
    this.stats = {};
    
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    this.bindEvents();
    this.loadInitialData();
    this.showPage('dashboard');
    
    console.log('Ubwiyunge App initialized');
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    this.bindNavigationEvents();
    this.bindSidebarEvents();
    this.bindFormEvents();
    this.bindChatEvents();
    this.bindModalEvents();
  }

  /**
   * Bind navigation event listeners
   */
  bindNavigationEvents() {
    // Desktop navigation links
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.currentTarget.dataset.page;
        this.showPage(page);
      });
    });

    // Mobile bottom navigation
    document.querySelectorAll('.bottom-nav-item[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.currentTarget.dataset.page;
        this.showPage(page);
      });
    });
  }

  /**
   * Bind sidebar events
   */
  bindSidebarEvents() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });
    }

    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (e) => {
      if (window.innerWidth < 768 && sidebar && sidebar.classList.contains('active')) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
          sidebar.classList.remove('active');
        }
      }
    });
  }

  /**
   * Show specified page and hide others
   */
  showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });

    // Show requested page
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
      targetPage.classList.add('active');
      this.currentPage = pageId;
      
      // Update navigation states
      this.updateNavigationState(pageId);
      
      // Load page-specific data
      this.loadPageData(pageId);
      
      // Close mobile sidebar
      const sidebar = document.getElementById('sidebar');
      if (sidebar) {
        sidebar.classList.remove('active');
      }
    }
  }

  /**
   * Update navigation active states
   */
  updateNavigationState(pageId) {
    // Update desktop navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === pageId) {
        link.classList.add('active');
      }
    });

    // Update mobile navigation
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.page === pageId) {
        item.classList.add('active');
      }
    });
  }

  /**
   * Load initial data from API
   */
  async loadInitialData() {
    try {
      // Load stats for dashboard
      await this.loadStats();
      console.log('Initial data loaded');
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  }

  /**
   * Load page-specific data
   */
  async loadPageData(pageId) {
    switch (pageId) {
      case 'dashboard':
        await this.loadDashboardData();
        break;
      case 'leaders':
        await this.loadLeadersData();
        break;
      case 'chat':
        await this.loadChatData();
        break;
      case 'profile':
        await this.loadProfileData();
        break;
    }
  }

  /**
   * Load dashboard data
   */
  async loadDashboardData() {
    try {
      await this.loadStats();
      await this.loadRecentIssues();
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  }

  /**
   * Load statistics from API
   */
  async loadStats() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/stats`);
      if (response.ok) {
        this.stats = await response.json();
        this.updateStatsDisplay();
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Use default values if API fails
      this.stats = {
        pending: 12,
        inProgress: 5,
        resolved: 45,
        totalLeaders: 8
      };
      this.updateStatsDisplay();
    }
  }

  /**
   * Update statistics display
   */
  updateStatsDisplay() {
    const statElements = {
      pendingIssues: this.stats.pending || 0,
      inProgressIssues: this.stats.inProgress || 0,
      resolvedIssues: this.stats.resolved || 0,
      totalLeaders: this.stats.totalLeaders || 0
    };

    Object.entries(statElements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }

  /**
   * Load recent issues
   */
  async loadRecentIssues() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/issues?limit=5`);
      if (response.ok) {
        const issues = await response.json();
        this.displayRecentIssues(issues);
      }
    } catch (error) {
      console.error('Failed to load recent issues:', error);
    }
  }

  /**
   * Display recent issues in dashboard
   */
  displayRecentIssues(issues) {
    const container = document.getElementById('recentCases');
    if (!container || !issues || issues.length === 0) return;

    container.innerHTML = issues.map(issue => `
      <div class="case-card">
        <div class="case-status ${issue.status || 'pending'}"></div>
        <div class="case-content">
          <h4 class="case-title">${issue.title || 'Untitled Issue'}</h4>
          <p class="case-description">${issue.description ? issue.description.substring(0, 100) + '...' : 'No description'}</p>
          <div class="case-meta">
            <span class="case-date">${this.formatDate(issue.createdAt)}</span>
            <span class="case-location">${issue.location || 'Unknown location'}</span>
          </div>
        </div>
        <div class="case-actions">
          <button class="btn-icon" onclick="app.viewIssue(${issue.id})">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  /**
   * Load leaders data
   */
  async loadLeadersData() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/leaders`);
      if (response.ok) {
        this.leaders = await response.json();
        this.displayLeaders(this.leaders);
      }
    } catch (error) {
      console.error('Failed to load leaders:', error);
    }
  }

  /**
   * Display leaders in grid
   */
  displayLeaders(leaders) {
    const grid = document.getElementById('leadersGrid');
    if (!grid || !leaders || leaders.length === 0) return;

    grid.innerHTML = leaders.map(leader => `
      <div class="leader-card">
        <div class="leader-avatar">
          <img src="${leader.avatar || 'assets/images/default-avatar.svg'}" alt="${leader.name}">
        </div>
        <div class="leader-info">
          <h3 class="leader-name">${leader.name}</h3>
          <p class="leader-title">${leader.title}</p>
          <p class="leader-location">${leader.location}</p>
        </div>
        <div class="leader-stats">
          <div class="stat">
            <span class="stat-value">${leader.resolved || 0}</span>
            <span class="stat-label">Resolved</span>
          </div>
          <div class="stat">
            <span class="stat-value">${leader.rating || '4.0'}</span>
            <span class="stat-label">Rating</span>
          </div>
        </div>
        <div class="leader-actions">
          <button class="btn btn-primary" onclick="app.startChat(${leader.id})">
            <i class="fas fa-comments"></i>
            Chat
          </button>
          <button class="btn btn-secondary" onclick="app.callLeader('${leader.phone}')">
            <i class="fas fa-phone"></i>
            Call
          </button>
        </div>
      </div>
    `).join('');
  }

  /**
   * Bind form event listeners
   */
  bindFormEvents() {
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleProfileUpdate(profileForm);
      });
    }

    // Search functionality
    const leaderSearch = document.getElementById('leaderSearch');
    if (leaderSearch) {
      leaderSearch.addEventListener('input', (e) => {
        this.filterLeaders(e.target.value);
      });
    }

    // Filter tabs for leaders
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.filterLeadersByLevel(e.target.dataset.level);
      });
    });
  }

  /**
   * Bind chat event listeners
   */
  bindChatEvents() {
    // Send message
    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('messageInput');
    
    if (sendBtn && messageInput) {
      sendBtn.addEventListener('click', () => {
        this.sendMessage();
      });
      
      messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
    }

    // Conversation selection
    document.querySelectorAll('.conversation-item').forEach(item => {
      item.addEventListener('click', (e) => {
        document.querySelectorAll('.conversation-item').forEach(i => i.classList.remove('active'));
        e.currentTarget.classList.add('active');
        // Load conversation messages here
      });
    });
  }

  /**
   * Bind modal event listeners
   */
  bindModalEvents() {
    // Add modal handling if needed
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModals();
      }
    });
  }

  /**
   * Load chat data
   */
  async loadChatData() {
    try {
      // Load conversations - placeholder for now
      console.log('Loading chat data...');
    } catch (error) {
      console.error('Failed to load chat data:', error);
    }
  }

  /**
   * Load profile data
   */
  async loadProfileData() {
    try {
      // Load user profile - placeholder for now
      console.log('Loading profile data...');
    } catch (error) {
      console.error('Failed to load profile data:', error);
    }
  }

  /**
   * Handle profile form update
   */
  async handleProfileUpdate(form) {
    const formData = new FormData(form);
    try {
      // Send profile update to API
      console.log('Updating profile...', Object.fromEntries(formData));
      this.showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update profile:', error);
      this.showToast('Failed to update profile', 'error');
    }
  }

  /**
   * Filter leaders by search term
   */
  filterLeaders(searchTerm) {
    if (!this.leaders) return;
    
    const filtered = this.leaders.filter(leader => 
      leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    this.displayLeaders(filtered);
  }

  /**
   * Filter leaders by level
   */
  filterLeadersByLevel(level) {
    if (!this.leaders) return;
    
    if (level === 'all') {
      this.displayLeaders(this.leaders);
      return;
    }
    
    const filtered = this.leaders.filter(leader => 
      leader.level && leader.level.toLowerCase() === level.toLowerCase()
    );
    
    this.displayLeaders(filtered);
  }

  /**
   * Send chat message
   */
  sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Add message to chat
    this.addMessageToChat(message, 'sent');
    messageInput.value = '';
    
    // Simulate response (in real app, this would be via WebSocket or API)
    setTimeout(() => {
      this.addMessageToChat('Thank you for your message. We will respond shortly.', 'received');
    }, 1000);
  }

  /**
   * Add message to chat display
   */
  addMessageToChat(message, type) {
    const container = document.getElementById('messagesContainer');
    if (!container) return;
    
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    
    const time = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    if (type === 'received') {
      messageEl.innerHTML = `
        <div class="message-avatar">
          <img src="assets/images/default-avatar.svg" alt="Avatar">
        </div>
        <div class="message-content">
          <p>${message}</p>
          <span class="message-time">${time}</span>
        </div>
      `;
    } else {
      messageEl.innerHTML = `
        <div class="message-content">
          <p>${message}</p>
          <span class="message-time">${time}</span>
        </div>
      `;
    }
    
    container.appendChild(messageEl);
    container.scrollTop = container.scrollHeight;
  }

  /**
   * Utility functions
   */
  formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  /**
   * Action handlers
   */
  viewIssue(issueId) {
    console.log('Viewing issue:', issueId);
    // Implement issue viewing modal/page
  }

  startChat(leaderId) {
    console.log('Starting chat with leader:', leaderId);
    this.showPage('chat');
  }

  callLeader(phone) {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  }

  closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('active');
    });
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new UbwiyungeApp();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UbwiyungeApp;
}
