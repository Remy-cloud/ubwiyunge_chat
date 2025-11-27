// Authentication JavaScript - Session Management Only
document.addEventListener('DOMContentLoaded', function() {
    initializeDemoUsers(); // Ensure demo users exist
    checkAuthStatus();
    updateAuthUI();
    setupLogoutHandlers();
});

// Initialize demo users for testing (runs on every page)
function initializeDemoUsers() {
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Only add demo users if none exist
    if (existingUsers.length === 0) {
        const demoUsers = [
            {
                id: 'user_demo_citizen',
                firstName: 'Jean',
                lastName: 'Uwimana',
                email: 'citizen@demo.com',
                phone: '+250 788 123 456',
                district: 'Gasabo',
                sector: 'Kimironko',
                address: 'Kimironko, Gasabo District, Rwanda',
                avatar: 'assets/images/default-avatar.svg',
                role: 'citizen',
                createdDate: new Date().toISOString()
            },
            {
                id: 'user_demo_leader',
                firstName: 'Marie',
                lastName: 'Mukamana',
                email: 'leader@demo.com',
                phone: '+250 788 654 321',
                district: 'Gasabo',
                sector: 'Kacyiru',
                address: 'Kacyiru, Gasabo District, Rwanda',
                avatar: 'assets/images/default-avatar.svg',
                role: 'leader',
                position: 'Executive Secretary',
                department: 'Sector Office',
                officeAddress: 'Kacyiru Sector Office',
                createdDate: new Date().toISOString()
            }
        ];
        localStorage.setItem('registeredUsers', JSON.stringify(demoUsers));
    }
}

// Auth state
let currentUser = null;
let isAuthenticated = false;

// Check authentication status and redirect if needed
function checkAuthStatus() {
    const userData = localStorage.getItem('currentUser');
    const authStatus = localStorage.getItem('isAuthenticated');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (userData && authStatus === 'true') {
        try {
            currentUser = JSON.parse(userData);
            isAuthenticated = true;
            
            // If authenticated user is on login/register page, redirect to dashboard
            if (currentPage === 'login.html' || currentPage === 'register.html') {
                window.location.href = 'index.html';
                return;
            }
            
            updateAuthUI();
            document.body.classList.add('auth-checked');
        } catch (error) {
            console.error('Error parsing saved user data:', error);
            clearSession();
            redirectToLogin();
        }
    } else {
        // Redirect to login for protected pages
        const publicPages = ['login.html', 'register.html', 'index.html', ''];
        
        // Also check if we're on root path
        const isRootPath = window.location.pathname === '/' || window.location.pathname === '';
        
        if (!publicPages.includes(currentPage) && !isRootPath) {
            redirectToLogin();
        } else {
            document.body.classList.add('auth-checked');
        }
    }
}

function redirectToLogin() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'login.html' && currentPage !== 'register.html') {
        window.location.href = 'login.html';
    }
}

// Update UI based on authentication status
function updateAuthUI() {
    if (!currentUser) return;

    // Update user info displays
    const userNameElements = document.querySelectorAll('.user-name, #userName');
    const userEmailElements = document.querySelectorAll('.user-email, #userEmail');
    const userAvatarElements = document.querySelectorAll('.user-avatar, #userAvatar');

    // Update dropdown elements specifically
    const dropdownUsernameElements = document.querySelectorAll('.dropdown-username');
    const dropdownEmailElements = document.querySelectorAll('.dropdown-email');
    const dropdownAvatarElements = document.querySelectorAll('.dropdown-avatar-img');

    const fullName = `${currentUser.firstName} ${currentUser.lastName}`;

    userNameElements.forEach(element => {
        if (element) {
            element.textContent = fullName;
        }
    });

    userEmailElements.forEach(element => {
        if (element) {
            element.textContent = currentUser.email;
        }
    });

    userAvatarElements.forEach(element => {
        if (element && element.tagName === 'IMG') {
            element.src = currentUser.avatar || 'assets/images/default-avatar.svg';
        }
    });

    // Update dropdown specifically
    dropdownUsernameElements.forEach(element => {
        if (element) {
            element.textContent = fullName;
        }
    });

    dropdownEmailElements.forEach(element => {
        if (element) {
            element.textContent = currentUser.email;
        }
    });

    dropdownAvatarElements.forEach(element => {
        if (element) {
            element.src = currentUser.avatar || 'assets/images/default-avatar.svg';
        }
    });
}

// Setup event listeners for logout functionality
function setupLogoutHandlers() {
    document.addEventListener('click', function(e) {
        if (e.target.id === 'logoutBtn' || 
            e.target.classList.contains('logout-btn') || 
            e.target.onclick?.toString().includes('logout') ||
            e.target.getAttribute('onclick')?.includes('logout')) {
            e.preventDefault();
            handleLogout();
        }
    });
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        clearSession();
        window.location.href = 'login.html';
    }
}

// Clear user session
function clearSession() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    currentUser = null;
    isAuthenticated = false;
}

// Make logout function globally available
window.handleLogout = handleLogout;
