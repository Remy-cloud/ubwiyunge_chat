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
    const userData = localStorage.getItem('ubwiyunge_current_user');
    const authStatus = localStorage.getItem('ubwiyunge_is_authenticated');

    if (userData && authStatus === 'true') {
        try {
            currentUser = JSON.parse(userData);
            isAuthenticated = true;
            updateAuthUI();
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
        }
    }
}

function redirectToLogin() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'login.html' && currentPage !== 'register.html') {
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 100);
    }
}

// Update UI based on authentication status
function updateAuthUI() {
    if (!currentUser) return;

    // Update user info displays
    const userNameElements = document.querySelectorAll('.user-name, #userName');
    const userEmailElements = document.querySelectorAll('.user-email, #userEmail');
    const userAvatarElements = document.querySelectorAll('.user-avatar, #userAvatar');

    userNameElements.forEach(element => {
        if (element) {
            element.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
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
    localStorage.removeItem('ubwiyunge_current_user');
    localStorage.removeItem('ubwiyunge_is_authenticated');
    currentUser = null;
    isAuthenticated = false;
}
