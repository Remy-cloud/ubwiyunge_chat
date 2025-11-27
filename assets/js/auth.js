// Authentication JavaScript - Session Management Only
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    updateAuthUI();
    setupLogoutHandlers();
});

// Auth state
let currentUser = null;
let isAuthenticated = false;

// Check authentication status and redirect if needed
function checkAuthStatus() {
    const userData = localStorage.getItem('currentUser');
    const authStatus = localStorage.getItem('isAuthenticated');

    if (userData && authStatus === 'true') {
        try {
            currentUser = JSON.parse(userData);
            isAuthenticated = true;
            updateAuthUI();
            document.body.classList.add('auth-checked');
        } catch (error) {
            console.error('Error parsing saved user data:', error);
            clearSession();
            redirectToLogin();
        }
    } else {
        // Redirect to login for protected pages
        const currentPage = window.location.pathname.split('/').pop();
        const publicPages = ['login.html', 'register.html', ''];
        
        if (!publicPages.includes(currentPage)) {
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
