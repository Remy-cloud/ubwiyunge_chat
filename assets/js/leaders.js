// Leaders Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeLeaders();
    setupEventListeners();
    loadLeadersData();
    checkForNewLeaders();
    // Register sample leaders for messaging system
    registerSampleLeadersForMessaging();
});

// Sample leaders data
const leadersData = [
    {
        id: 'mayor_gasabo',
        name: 'Marie Chantal Rwakazina',
        title: 'Mayor of Gasabo District',
        department: 'Executive Office',
        level: 'district',
        location: 'Gasabo District, Kigali City',
        phone: '+250 788 123 456',
        email: 'mayor@gasabo.gov.rw',
        avatar: 'https://via.placeholder.com/80/6366f1/white?text=MCR',
        isOnline: true,
        lastSeen: 'Active now',
        bio: 'Experienced public administrator committed to community development and transparent governance.'
    },
    {
        id: 'exec_kimironko',
        name: 'Jean Baptiste Munyangabe',
        title: 'Executive Secretary',
        department: 'Kimironko Sector',
        level: 'sector',
        location: 'Kimironko, Gasabo District',
        phone: '+250 788 234 567',
        email: 'kimironko@gasabo.gov.rw',
        avatar: 'https://via.placeholder.com/80/10b981/white?text=JBM',
        isOnline: false,
        lastSeen: '2 hours ago',
        bio: 'Dedicated to improving local infrastructure and community services in Kimironko Sector.'
    },
    {
        id: 'coord_gatenga',
        name: 'Uwimana Claire',
        title: 'Cell Coordinator',
        department: 'Gatenga Cell',
        level: 'cell',
        location: 'Gatenga, Kicukiro District',
        phone: '+250 788 345 678',
        email: 'gatenga@kicukiro.gov.rw',
        avatar: 'https://via.placeholder.com/80/f59e0b/white?text=UC',
        isOnline: true,
        lastSeen: 'Active now',
        bio: 'Community-focused leader working on local development initiatives and citizen engagement.'
    },
    {
        id: 'mayor_kicukiro',
        name: 'Paul Rwabukwisi',
        title: 'Mayor of Kicukiro District',
        department: 'Executive Office',
        level: 'district',
        location: 'Kicukiro District, Kigali City',
        phone: '+250 788 456 789',
        email: 'mayor@kicukiro.gov.rw',
        avatar: 'https://via.placeholder.com/80/8b5cf6/white?text=PR',
        isOnline: false,
        lastSeen: '1 day ago',
        bio: 'Focused on urban planning and sustainable development in Kicukiro District.'
    },
    {
        id: 'exec_kicukiro_center',
        name: 'Mukamana Esperance',
        title: 'Executive Secretary',
        department: 'Kicukiro Sector',
        level: 'sector',
        location: 'Kicukiro Center, Kicukiro District',
        phone: '+250 788 567 890',
        email: 'kicukiro.center@kicukiro.gov.rw',
        avatar: 'https://via.placeholder.com/80/ef4444/white?text=ME',
        isOnline: true,
        lastSeen: 'Active now',
        bio: 'Working on youth empowerment and economic development programs in the sector.'
    },
    {
        id: 'coord_nyanza',
        name: 'Nzeyimana Vincent',
        title: 'Cell Coordinator',
        department: 'Nyanza Cell',
        level: 'cell',
        location: 'Nyanza, Kicukiro District',
        phone: '+250 788 678 901',
        email: 'nyanza@kicukiro.gov.rw',
        avatar: 'https://via.placeholder.com/80/06b6d4/white?text=NV',
        isOnline: false,
        lastSeen: '3 hours ago',
        bio: 'Passionate about environmental protection and community health initiatives.'
    },
    {
        id: 'mayor_nyarugenge',
        name: 'Kayitesi Solange',
        title: 'Mayor of Nyarugenge District',
        department: 'Executive Office',
        level: 'district',
        location: 'Nyarugenge District, Kigali City',
        phone: '+250 788 789 012',
        email: 'mayor@nyarugenge.gov.rw',
        avatar: 'https://via.placeholder.com/80/84cc16/white?text=KS',
        isOnline: true,
        lastSeen: 'Active now',
        bio: 'Committed to cultural preservation and tourism development in Nyarugenge.'
    },
    {
        id: 'exec_nyarugenge_center',
        name: 'Bizimana Eric',
        title: 'Executive Secretary',
        department: 'Nyarugenge Sector',
        level: 'sector',
        location: 'Nyarugenge Center, Nyarugenge District',
        phone: '+250 788 890 123',
        email: 'nyarugenge.center@nyarugenge.gov.rw',
        avatar: 'https://via.placeholder.com/80/f97316/white?text=BE',
        isOnline: false,
        lastSeen: '5 hours ago',
        bio: 'Focused on business development and supporting local entrepreneurs.'
    }
];

let currentFilter = 'all';
let searchQuery = '';

// Initialize leaders functionality
function initializeLeaders() {
    setupMobileMenu();
    setupNotifications();
    setupUserMenu();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('leaderSearch');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', handleFilter);
    });

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
}

// Load and display leaders data
function loadLeadersData() {
    // Get registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // ONLY filter users with role = 'leader' (NOT citizens)
    const registeredLeaders = registeredUsers.filter(user => user.role === 'leader');
    
    // Convert registered leaders to match leaders data format
    const dynamicLeaders = registeredLeaders.map(leader => ({
        id: leader.id,
        name: `${leader.firstName} ${leader.lastName}`,
        position: leader.position || 'Community Leader',
        department: leader.department || 'Community Affairs',
        district: leader.district,
        sector: leader.sector,
        phone: leader.phone,
        email: leader.email,
        officeAddress: leader.officeAddress || `${leader.sector}, ${leader.district}`,
        avatar: leader.avatar || 'assets/images/default-avatar.svg',
        isVerified: false, // New registrations start as unverified
        rating: 0,
        totalReports: 0,
        resolvedReports: 0,
        responseTime: 'New',
        bio: `Community leader serving ${leader.sector} sector in ${leader.district} district.`,
        specialties: ['Community Development', 'Public Service'],
        workingHours: 'Mon-Fri: 8:00 AM - 5:00 PM',
        languages: ['Kinyarwanda', 'English'],
        isOnline: false,
        lastActive: leader.createdDate,
        isRegistered: true // Flag to identify registered leaders
    }));
    
    // Combine with existing hardcoded leaders (avoid duplicates by email)
    const allLeaders = [...leadersData];
    dynamicLeaders.forEach(newLeader => {
        const existingLeader = allLeaders.find(existing => existing.email === newLeader.email);
        if (!existingLeader) {
            allLeaders.push(newLeader);
        }
    });
    
    displayLeaders(allLeaders);
    
    // Store combined leaders for filtering
    window.currentLeaders = allLeaders;
}

// Display leaders in the grid
function displayLeaders(leaders) {
    const leadersGrid = document.getElementById('leadersGrid');
    if (!leadersGrid) return;

    if (leaders.length === 0) {
        leadersGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>No leaders found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
        return;
    }

    leadersGrid.innerHTML = leaders.map(leader => createLeaderCard(leader)).join('');
}

// Create leader card HTML
function createLeaderCard(leader) {
    const statusIndicator = leader.isOnline ? 
        '<span class="status-online"><i class="fas fa-circle"></i> Online</span>' : 
        '<span class="status-offline"><i class="fas fa-circle"></i> Offline</span>';
    
    // Show "NEW" badge for recently registered leaders (within last 7 days)
    const isNewRegistration = leader.isRegistered && 
        new Date(leader.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const newBadge = isNewRegistration ? '<span class="new-leader-badge">NEW</span>' : '';
    
    // Use position instead of title for registered leaders
    const titleField = leader.position || leader.title || 'Community Leader';
    const locationField = leader.district ? `${leader.sector}, ${leader.district}` : leader.location;

    return `
        <div class="leader-card" data-level="${leader.level || 'community'}" data-leader-id="${leader.id}">
            <div class="leader-header">
                <div class="leader-avatar">
                    <img src="${leader.avatar}" alt="${leader.name}" onerror="this.src='https://via.placeholder.com/80/6366f1/white?text=${leader.name.split(' ').map(n => n[0]).join('')}'">
                    <div class="status-indicator ${leader.isOnline ? 'online' : 'offline'}"></div>
                </div>
                <div class="leader-basic-info">
                    <h3 class="leader-name">${leader.name} ${newBadge}</h3>
                    <p class="leader-title">${titleField}</p>
                    <p class="leader-department">${leader.department}</p>
                    ${statusIndicator}
                </div>
            </div>
            
            <div class="leader-info">
                <div class="leader-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${locationField}</span>
                </div>
                <div class="leader-bio">
                    <p>${leader.bio}</p>
                </div>
            </div>
            
            <div class="leader-contact">
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>${leader.phone}</span>
                    <button class="contact-btn" onclick="callLeader('${leader.phone}', '${leader.name}')" title="Call">
                        <i class="fas fa-phone"></i>
                    </button>
                </div>
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>${leader.email}</span>
                    <button class="contact-btn" onclick="emailLeader('${leader.email}', '${leader.name}')" title="Email">
                        <i class="fas fa-envelope"></i>
                    </button>
                </div>
            </div>
            
            <div class="leader-actions">
                <button class="btn btn-primary" onclick="startChat('${leader.id}', '${leader.name}')">
                    <i class="fas fa-comments"></i>
                    Start Chat
                </button>
                <button class="btn btn-secondary" onclick="viewLeaderProfile('${leader.id}')">
                    <i class="fas fa-user"></i>
                    View Profile
                </button>
            </div>
        </div>
    `;
}

// Handle search functionality
function handleSearch(event) {
    searchQuery = event.target.value.toLowerCase();
    filterLeaders();
}

// Handle filter tabs
function handleFilter(event) {
    // Remove active class from all tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    currentFilter = event.target.dataset.level;
    filterLeaders();
}

// Filter leaders based on search and level
function filterLeaders() {
    let filteredLeaders = window.currentLeaders || leadersData;

    // Filter by level
    if (currentFilter !== 'all') {
        filteredLeaders = filteredLeaders.filter(leader => leader.level === currentFilter);
    }

    // Filter by search query
    if (searchQuery) {
        filteredLeaders = filteredLeaders.filter(leader => 
            leader.name.toLowerCase().includes(searchQuery) ||
            leader.position.toLowerCase().includes(searchQuery) ||
            leader.department.toLowerCase().includes(searchQuery) ||
            leader.district.toLowerCase().includes(searchQuery) ||
            leader.sector.toLowerCase().includes(searchQuery)
        );
    }

    displayLeaders(filteredLeaders);
}

// Start chat with a leader
function startChat(leaderId, leaderName) {
    // Store simple chat info
    localStorage.setItem('chatWith', JSON.stringify({
        id: leaderId,
        name: leaderName,
        role: 'leader'
    }));
    
    // Redirect to chat page
    window.location.href = 'chat.html';
}

// View leader profile (could open modal or navigate to detail page)
function viewLeaderProfile(leaderId) {
    const leader = (window.currentLeaders || leadersData).find(l => l.id === leaderId);
    if (!leader) return;

    // For now, show an alert with leader info (could be expanded to modal)
    showLeaderModal(leader);
}

// Show leader details in modal
function showLeaderModal(leader) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('leaderModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'leaderModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-content leader-modal-content">
            <div class="modal-header">
                <h3>${leader.name}</h3>
                <button class="close-btn" onclick="closeLeaderModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="leader-profile">
                    <div class="leader-avatar-large">
                        <img src="${leader.avatar}" alt="${leader.name}">
                        <div class="status-indicator ${leader.isOnline ? 'online' : 'offline'}"></div>
                    </div>
                    <div class="leader-details">
                        <h4>${leader.title}</h4>
                        <p class="department">${leader.department}</p>
                        <p class="location"><i class="fas fa-map-marker-alt"></i> ${leader.location}</p>
                        <p class="status">${leader.isOnline ? 'Online now' : `Last seen ${leader.lastSeen}`}</p>
                        <div class="bio">
                            <h5>About</h5>
                            <p>${leader.bio}</p>
                        </div>
                        <div class="contact-info">
                            <h5>Contact Information</h5>
                            <p><i class="fas fa-phone"></i> ${leader.phone}</p>
                            <p><i class="fas fa-envelope"></i> ${leader.email}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeLeaderModal()">Close</button>
                <button class="btn btn-primary" onclick="startChat('${leader.id}', '${leader.name}'); closeLeaderModal();">
                    <i class="fas fa-comments"></i> Start Chat
                </button>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

// Close leader modal
function closeLeaderModal() {
    const modal = document.getElementById('leaderModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Call leader functionality
function callLeader(phone, name) {
    if (confirm(`Call ${name} at ${phone}?`)) {
        // In a real app, this would initiate a phone call
        window.open(`tel:${phone}`);
        showNotification(`Calling ${name}...`, 'info');
    }
}

// Email leader functionality
function emailLeader(email, name) {
    const subject = encodeURIComponent(`Community Inquiry - Ubwiyunge Platform`);
    const body = encodeURIComponent(`Dear ${name},\n\nI am reaching out through the Ubwiyunge Community Platform regarding...\n\nBest regards`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
    showNotification(`Opening email to ${name}...`, 'info');
}

// Mobile menu functionality
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

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Setup notifications
function setupNotifications() {
    // Simulate some notifications
    const notificationBadge = document.querySelector('.notification-badge');
    if (notificationBadge) {
        // Show notification count (could be fetched from server)
        const notificationCount = 3;
        if (notificationCount > 0) {
            notificationBadge.textContent = notificationCount > 9 ? '9+' : notificationCount;
            notificationBadge.style.display = 'block';
        }
    }
}

// Check for new leaders and show notification
function checkForNewLeaders() {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // ONLY check for users with role = 'leader' (NOT citizens)
    const newLeaders = registeredUsers.filter(user => 
        user.role === 'leader' && 
        new Date(user.createdDate) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
    );
    
    if (newLeaders.length > 0 && !sessionStorage.getItem('newLeaderNotificationShown')) {
        const message = newLeaders.length === 1 
            ? `New leader ${newLeaders[0].firstName} ${newLeaders[0].lastName} has joined!`
            : `${newLeaders.length} new leaders have joined the platform!`;
        
        showNotification(message, 'success');
        sessionStorage.setItem('newLeaderNotificationShown', 'true');
    }
}

// Show notifications dropdown
function showNotifications() {
    // Create notifications dropdown if it doesn't exist
    let dropdown = document.getElementById('notificationsDropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = 'notificationsDropdown';
        dropdown.className = 'notifications-dropdown';
        dropdown.innerHTML = `
            <div class="dropdown-header">
                <h4>Notifications</h4>
                <button class="mark-all-read">Mark all read</button>
            </div>
            <div class="notifications-list">
                <div class="notification-item unread">
                    <i class="fas fa-comment text-primary"></i>
                    <div class="notification-content">
                        <p>New message from Marie Chantal Rwakazina</p>
                        <small>2 minutes ago</small>
                    </div>
                </div>
                <div class="notification-item unread">
                    <i class="fas fa-file-alt text-success"></i>
                    <div class="notification-content">
                        <p>Your report has been reviewed</p>
                        <small>1 hour ago</small>
                    </div>
                </div>
                <div class="notification-item">
                    <i class="fas fa-users text-info"></i>
                    <div class="notification-content">
                        <p>New leader added to your district</p>
                        <small>2 days ago</small>
                    </div>
                </div>
            </div>
            <div class="dropdown-footer">
                <a href="#" class="view-all">View all notifications</a>
            </div>
        `;
        document.body.appendChild(dropdown);
        
        // Position the dropdown
        const notificationsBtn = document.getElementById('notificationsBtn');
        const rect = notificationsBtn.getBoundingClientRect();
        dropdown.style.top = (rect.bottom + 10) + 'px';
        dropdown.style.right = '20px';
    }
    
    // Toggle dropdown
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    
    // Close dropdown when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(event) {
            if (!dropdown.contains(event.target) && !document.getElementById('notificationsBtn').contains(event.target)) {
                dropdown.style.display = 'none';
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 100);
}

// User menu functionality
function setupUserMenu() {
    // Create user menu dropdown
    let userDropdown = document.getElementById('userMenuDropdown');
    if (!userDropdown) {
        userDropdown = document.createElement('div');
        userDropdown.id = 'userMenuDropdown';
        userDropdown.className = 'user-menu-dropdown';
        userDropdown.innerHTML = `
            <div class="dropdown-header">
                <div class="user-info">
                    <div class="user-avatar-small">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <p class="user-name">John Doe</p>
                        <p class="user-email">john.doe@example.com</p>
                    </div>
                </div>
            </div>
            <div class="dropdown-menu">
                <a href="profile.html" class="dropdown-item">
                    <i class="fas fa-user"></i> Profile
                </a>
                <a href="#" class="dropdown-item">
                    <i class="fas fa-cog"></i> Settings
                </a>
                <a href="#" class="dropdown-item">
                    <i class="fas fa-question-circle"></i> Help
                </a>
                <hr class="dropdown-divider">
                <a href="#" class="dropdown-item" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        `;
        document.body.appendChild(userDropdown);
    }
}

// Toggle user menu
function toggleUserMenu() {
    const dropdown = document.getElementById('userMenuDropdown');
    if (!dropdown) return;
    
    // Position the dropdown
    const userMenuBtn = document.getElementById('userMenuBtn');
    const rect = userMenuBtn.getBoundingClientRect();
    dropdown.style.top = (rect.bottom + 10) + 'px';
    dropdown.style.right = '20px';
    
    // Toggle dropdown
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    
    // Close dropdown when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(event) {
            if (!dropdown.contains(event.target) && !userMenuBtn.contains(event.target)) {
                dropdown.style.display = 'none';
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 100);
}

// Logout functionality
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
        window.location.href = 'index.html';
    }
}

// Utility function to show notifications
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

// Responsive handling
window.addEventListener('resize', function() {
    // Close sidebar on desktop view
    if (window.innerWidth > 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('open');
        }
    }
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    // Close leader modal
    const leaderModal = document.getElementById('leaderModal');
    if (leaderModal && event.target === leaderModal) {
        closeLeaderModal();
    }
});

// Register sample leaders for messaging system
function registerSampleLeadersForMessaging() {
    const sampleLeaders = [
        {
            id: 'mayor_gasabo',
            name: 'Marie Chantal Rwakazina',
            email: 'mayor@gasabo.gov.rw',
            avatar: 'https://via.placeholder.com/80/6366f1/white?text=MCR'
        },
        {
            id: 'exec_kimironko',
            name: 'Jean Baptiste Munyangabe',
            email: 'kimironko@gasabo.gov.rw',
            avatar: 'https://via.placeholder.com/80/10b981/white?text=JBM'
        },
        {
            id: 'coord_gatenga',
            name: 'Uwimana Claire',
            email: 'gatenga@kicukiro.gov.rw',
            avatar: 'https://via.placeholder.com/80/f59e0b/white?text=UC'
        },
        {
            id: 'mayor_kicukiro',
            name: 'Paul Rwabukwisi',
            email: 'mayor@kicukiro.gov.rw',
            avatar: 'https://via.placeholder.com/80/8b5cf6/white?text=PR'
        },
        {
            id: 'exec_kicukiro_center',
            name: 'Mukamana Esperance',
            email: 'kicukiro.center@kicukiro.gov.rw',
            avatar: 'https://via.placeholder.com/80/ef4444/white?text=ME'
        },
        {
            id: 'coord_nyanza',
            name: 'Nzeyimana Vincent',
            email: 'nyanza@kicukiro.gov.rw',
            avatar: 'https://via.placeholder.com/80/06b6d4/white?text=NV'
        },
        {
            id: 'mayor_nyarugenge',
            name: 'Kayitesi Solange',
            email: 'mayor@nyarugenge.gov.rw',
            avatar: 'https://via.placeholder.com/80/84cc16/white?text=KS'
        },
        {
            id: 'exec_nyarugenge_center',
            name: 'Bizimana Eric',
            email: 'nyarugenge.center@nyarugenge.gov.rw',
            avatar: 'https://via.placeholder.com/80/f97316/white?text=BE'
        }
    ];

    // Register each sample leader
    sampleLeaders.forEach(leader => {
        // Check if leader is already registered
        const existingLeader = JSON.parse(localStorage.getItem('registeredUsers') || '[]').find(user => user.email === leader.email);
        if (!existingLeader) {
            // Simulate registration process
            setTimeout(() => {
                // Add leader to registered users in localStorage
                const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                registeredUsers.push({
                    id: leader.id,
                    firstName: leader.name.split(' ')[0],
                    lastName: leader.name.split(' ')[1],
                    email: leader.email,
                    phone: '', // No phone for sample leaders
                    role: 'leader',
                    password: 'TempP@ssw0rd', // Temporary password
                    createdDate: new Date().toISOString(),
                    position: '', // No specific position
                    department: '', // No specific department
                    district: '', // No specific district
                    sector: '', // No specific sector
                    avatar: leader.avatar,
                    isOnline: true,
                    lastSeen: 'Active now'
                });
                
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                
                // Show notification
                showNotification(`Registered sample leader: ${leader.name}`, 'success');
            }, 1000);
        }
    });
}
