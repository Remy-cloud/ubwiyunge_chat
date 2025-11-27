// Profile Management Module
class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.isEditing = false;
        this.originalFormData = {};
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeProfile();
            });
        } else {
            this.initializeProfile();
        }
    }

    initializeProfile() {
        this.currentUser = this.getCurrentUser();
        this.loadUserProfile();
        this.bindEvents();
    }

    getCurrentUser() {
        // Get current user from localStorage (set during login/registration)
        const savedUser = localStorage.getItem('currentUser');
        
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                return user;
            } catch (error) {
                console.error('Error parsing saved user:', error);
            }
        }
        
        // If no saved user, return null (auth.js handles redirect)
        console.warn('No authenticated user found');
        return null;
    }

    loadUserProfile() {
        const user = this.currentUser;
        
        // If no user, don't try to load profile
        if (!user) {
            console.warn('No user data available');
            return;
        }
        
        // Update header dropdown information
        const headerUsername = document.getElementById('headerUsername');
        const headerUserEmail = document.getElementById('headerUserEmail');
        if (headerUsername) {
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
            headerUsername.textContent = fullName || 'Guest';
        }
        if (headerUserEmail) {
            headerUserEmail.textContent = user.email || 'guest@example.com';
        }
        
        // Update form fields
        const elements = {
            profileAvatar: document.getElementById('profileAvatar'),
            firstName: document.getElementById('firstName'),
            lastName: document.getElementById('lastName'),
            email: document.getElementById('email'),
            phone: document.getElementById('phone'),
            district: document.getElementById('district'),
            sector: document.getElementById('sector'),
            address: document.getElementById('address'),
            position: document.getElementById('position'),
            department: document.getElementById('department'),
            officeAddress: document.getElementById('officeAddress')
        };

        // Update each element if it exists
        if (elements.profileAvatar && user.avatar) {
            elements.profileAvatar.src = user.avatar;
        }
        if (elements.firstName) elements.firstName.value = user.firstName || '';
        if (elements.lastName) elements.lastName.value = user.lastName || '';
        if (elements.email) elements.email.value = user.email || '';
        if (elements.phone) elements.phone.value = user.phone || '';
        if (elements.district) elements.district.value = user.district || '';
        if (elements.sector) elements.sector.value = user.sector || '';
        if (elements.address) elements.address.value = user.address || '';

        // Show/hide leader-specific fields
        const leaderFields = document.getElementById('leaderFields');
        if (user.role === 'leader') {
            if (leaderFields) leaderFields.style.display = 'block';
            if (elements.position) elements.position.value = user.position || '';
            if (elements.department) elements.department.value = user.department || '';
            if (elements.officeAddress) elements.officeAddress.value = user.officeAddress || '';
        } else {
            if (leaderFields) leaderFields.style.display = 'none';
        }
    }

    bindEvents() {
        // Edit Profile Button
        const editBtn = document.getElementById('editProfileBtn');
        if (editBtn) {
            editBtn.addEventListener('click', () => this.toggleEditMode());
        }

        // Cancel Edit Button
        const cancelBtn = document.getElementById('cancelEditBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelEdit());
        }

        // Profile Form Submit
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Change Avatar Button
        const changeAvatarBtn = document.getElementById('changeAvatarBtn');
        if (changeAvatarBtn) {
            changeAvatarBtn.addEventListener('click', () => {
                document.getElementById('avatarUpload').click();
            });
        }

        // Load profile on DOM ready
        document.addEventListener('DOMContentLoaded', () => {
            this.loadUserProfile();
        });
    }

    toggleEditMode() {
        this.isEditing = !this.isEditing;
        
        const formFields = ['firstName', 'lastName', 'email', 'phone', 'district', 'sector', 'address'];
        const leaderFields = ['position', 'department', 'officeAddress'];
        const editBtn = document.getElementById('editProfileBtn');
        const formActions = document.getElementById('formActions');
        const changeAvatarBtn = document.getElementById('changeAvatarBtn');

        // Add leader fields to editable fields if user is a leader
        let allFields = [...formFields];
        if (this.currentUser.role === 'leader') {
            allFields = [...formFields, ...leaderFields];
        }

        if (this.isEditing) {
            // Store original form data
            this.storeOriginalFormData();
            
            // Enable form fields
            allFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.readOnly = false;
                    field.style.background = 'var(--white)';
                    field.style.border = '1px solid var(--gray-300)';
                }
            });

            // Update UI
            editBtn.innerHTML = '<i class="fas fa-times"></i> Cancel Edit';
            editBtn.classList.remove('btn-primary');
            editBtn.classList.add('btn-secondary');
            if (formActions) formActions.style.display = 'flex';
            if (changeAvatarBtn) changeAvatarBtn.style.display = 'block';

        } else {
            // Disable form fields
            this.disableEditMode();
            this.loadUserProfile(); // Restore original data
        }
    }

    disableEditMode() {
        const formFields = ['firstName', 'lastName', 'email', 'phone', 'district', 'sector', 'address'];
        const leaderFields = ['position', 'department', 'officeAddress'];
        const editBtn = document.getElementById('editProfileBtn');
        const formActions = document.getElementById('formActions');
        const changeAvatarBtn = document.getElementById('changeAvatarBtn');

        // Add leader fields if user is a leader
        let allFields = [...formFields];
        if (this.currentUser.role === 'leader') {
            allFields = [...formFields, ...leaderFields];
        }

        // Disable form fields
        allFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.readOnly = true;
                field.style.background = 'var(--gray-50)';
                field.style.border = '1px solid var(--gray-300)';
            }
        });

        // Update UI
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
        editBtn.classList.remove('btn-secondary');
        editBtn.classList.add('btn-primary');
        if (formActions) formActions.style.display = 'none';
        if (changeAvatarBtn) changeAvatarBtn.style.display = 'none';
        
        this.isEditing = false;
    }

    storeOriginalFormData() {
        const formFields = ['firstName', 'lastName', 'email', 'phone', 'district', 'sector', 'address'];
        const leaderFields = ['position', 'department', 'officeAddress'];
        
        let allFields = [...formFields];
        if (this.currentUser.role === 'leader') {
            allFields = [...formFields, ...leaderFields];
        }

        allFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                this.originalFormData[fieldId] = field.value;
            }
        });
    }

    cancelEdit() {
        // Restore original form data
        Object.keys(this.originalFormData).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = this.originalFormData[fieldId];
            }
        });

        this.disableEditMode();
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            district: document.getElementById('district').value.trim(),
            sector: document.getElementById('sector').value.trim(),
            address: document.getElementById('address').value.trim()
        };

        // Add leader-specific fields if user is a leader
        if (this.currentUser.role === 'leader') {
            formData.position = document.getElementById('position').value.trim();
            formData.department = document.getElementById('department').value.trim();
            formData.officeAddress = document.getElementById('officeAddress').value.trim();
        }

        // Validate form data
        if (!this.validateFormData(formData)) {
            return;
        }

        // Update user data
        Object.assign(this.currentUser, formData);
        
        // Save updated user data to localStorage
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        // Also update in registeredUsers array if it exists
        try {
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const userIndex = registeredUsers.findIndex(u => u.id === this.currentUser.id);
            if (userIndex >= 0) {
                registeredUsers[userIndex] = { ...this.currentUser };
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            }
        } catch (error) {
            console.error('Error updating registeredUsers:', error);
        }
        
        // Show success message
        this.showNotification('Profile updated successfully!', 'success');
        
        // Disable edit mode
        this.disableEditMode();
        
        // Simulate API call
        setTimeout(() => {
            console.log('Profile updated:', this.currentUser);
        }, 500);
    }

    validateFormData(data) {
        // Basic validation
        if (!data.firstName || !data.lastName) {
            this.showNotification('First name and last name are required', 'error');
            return false;
        }

        if (!data.email || !data.email.includes('@')) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }

        return true;
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? 'var(--primary-green)' : type === 'error' ? '#e74c3c' : 'var(--primary-blue)'};
            color: white;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    updateProfile(userData) {
        // Handle profile updates
        Object.assign(this.currentUser, userData);
        this.loadUserProfile();
    }
}

// Handle avatar upload
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const profileAvatar = document.getElementById('profileAvatar');
            if (profileAvatar) {
                profileAvatar.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
}

// Initialize Profile Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const profileManager = new ProfileManager();
});

// Export for global access
window.ProfileManager = ProfileManager;
window.handleAvatarUpload = handleAvatarUpload;