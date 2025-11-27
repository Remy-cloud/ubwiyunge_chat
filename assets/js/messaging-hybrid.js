// Messaging System for Ubwiyunge Community Platform
// UNCOMMENTED TO USE INSTEAD OF SIMPLE-CHAT.JS
class MessagingSystem {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.messages = this.loadMessages();
        this.contacts = this.loadContacts();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadConversationsList();
        this.handleSelectedLeaderFromRedirect();
    }

    // Handle leader selection from leaders page redirect
    handleSelectedLeaderFromRedirect() {
        const selectedLeader = localStorage.getItem('selectedLeaderForChat');
        if (selectedLeader) {
            try {
                const leaderData = JSON.parse(selectedLeader);
                
                // Add leader to contacts if not already present
                this.addLeaderToContacts(leaderData);
                
                // Start or select conversation with the leader
                const conversationId = this.getOrCreateConversationId(leaderData.contactId);
                
                // Clear the localStorage item to avoid repeated actions
                localStorage.removeItem('selectedLeaderForChat');
                
                // Select the conversation
                this.selectConversation(conversationId);
                
                console.log('Auto-selected conversation with leader:', leaderData.contactName);
            } catch (error) {
                console.error('Error handling selected leader:', error);
            }
        }
    }

    // Add leader to contacts if not already present
    addLeaderToContacts(leaderData) {
        const existingContact = this.contacts.find(contact => contact.id === leaderData.contactId);
        if (!existingContact) {
            const newContact = {
                id: leaderData.contactId,
                name: leaderData.contactName,
                title: leaderData.contactTitle,
                avatar: leaderData.contactAvatar || 'assets/images/default-avatar.svg',
                status: 'online',
                role: 'leader'
            };
            this.contacts.push(newContact);
            this.saveContacts();
        }
    }

    // Get or create conversation ID for a contact
    getOrCreateConversationId(contactId) {
        const existingConversation = this.getConversationsWithLastMessage()
            .find(conv => conv.contact && conv.contact.id === contactId);
        
        if (existingConversation) {
            return existingConversation.id;
        }
        
        // Create new conversation ID
        return `conv_${this.currentUser.id}_${contactId}_${Date.now()}`;
    }

    getCurrentUser() {
        // Get real authenticated user from localStorage
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            const user = JSON.parse(userData);
            return {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                avatar: user.avatar || 'assets/images/default-avatar.svg',
                status: 'online',
                role: user.role,
                email: user.email
            };
        }
        
        // Fallback if no user is logged in
        return {
            id: 'guest',
            name: 'Guest User',
            avatar: 'assets/images/default-avatar.svg',
            status: 'offline',
            role: 'citizen'
        };
    }

    loadContacts() {
        // Load registered users from localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        let contacts = [];
        
        if (this.currentUser.role === 'citizen') {
            // Citizens can only message leaders
            contacts = registeredUsers
                .filter(user => user.role === 'leader')
                .map(leader => ({
                    id: leader.id,
                    name: `${leader.firstName} ${leader.lastName}`,
                    role: leader.position || 'Community Leader',
                    avatar: leader.avatar || 'assets/images/default-avatar.svg',
                    status: 'online', // Could be enhanced with real status
                    lastSeen: new Date(leader.createdDate),
                    department: leader.department || 'Community Affairs',
                    district: leader.district,
                    sector: leader.sector,
                    email: leader.email
                }));
        } else if (this.currentUser.role === 'leader') {
            // Leaders can message citizens and other leaders
            contacts = registeredUsers
                .filter(user => user.id !== this.currentUser.id) // Don't include self
                .map(user => ({
                    id: user.id,
                    name: `${user.firstName} ${user.lastName}`,
                    role: user.role === 'leader' ? (user.position || 'Community Leader') : 'Citizen',
                    avatar: user.avatar || 'assets/images/default-avatar.svg',
                    status: 'online',
                    lastSeen: new Date(user.createdDate),
                    department: user.department || (user.role === 'citizen' ? 'Community Member' : 'Community Affairs'),
                    district: user.district,
                    sector: user.sector,
                    email: user.email
                }));
        }
        
        // Load dynamically added contacts and merge them
        const savedContacts = JSON.parse(localStorage.getItem('ubwiyunge_contacts') || '[]');
        
        // Merge contacts, avoiding duplicates
        savedContacts.forEach(savedContact => {
            const exists = contacts.find(contact => contact.id === savedContact.id);
            if (!exists) {
                contacts.push(savedContact);
            }
        });
        
        return contacts;
    }

    // Save contacts to localStorage (for dynamically added contacts)
    saveContacts() {
        localStorage.setItem('ubwiyunge_contacts', JSON.stringify(this.contacts));
    }

    loadMessages() {
        // Load messages from localStorage
        const savedMessages = localStorage.getItem('ubwiyunge_messages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    }

    setupEventListeners() {
        // Send message
        const sendBtn = document.getElementById('sendMessageBtn');
        const messageInput = document.getElementById('messageInput');
        
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Conversation selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.conversation-item')) {
                const conversationId = e.target.closest('.conversation-item').dataset.conversationId;
                this.selectConversation(conversationId);
            }
        });
    }

    loadConversationsList() {
        const conversationsContainer = document.getElementById('conversationsList');
        if (!conversationsContainer) return;

        const conversations = this.getConversationsWithLastMessage();
        
        if (conversations.length === 0) {
            // Show available contacts to start conversations
            const availableContacts = this.contacts;
            
            if (availableContacts.length === 0) {
                conversationsContainer.innerHTML = `
                    <div class="empty-conversations">
                        <i class="fas fa-users"></i>
                        <h3>No contacts available</h3>
                        <p>No ${this.currentUser.role === 'citizen' ? 'leaders' : 'users'} are available to message.</p>
                    </div>
                `;
            } else {
                conversationsContainer.innerHTML = `
                    <div class="empty-conversations">
                        <i class="fas fa-comments"></i>
                        <h3>No conversations yet</h3>
                        <p>Click on a contact below to start a conversation:</p>
                    </div>
                    <div class="available-contacts-list">
                        ${availableContacts.map(contact => `
                            <div class="contact-item-small" onclick="window.messagingSystem.startConversationWithContact('${contact.id}')">
                                <div class="contact-avatar-small">
                                    <img src="${contact.avatar}" alt="${contact.name}">
                                    <span class="status-indicator ${contact.status}"></span>
                                </div>
                                <div class="contact-info-small">
                                    <h4>${contact.name}</h4>
                                    <p>${contact.role}</p>
                                </div>
                                <i class="fas fa-comment-plus"></i>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
            
            // Show start conversation interface in messages area
            this.showStartNewConversation();
            return;
        }

        conversationsContainer.innerHTML = conversations.map(conv => this.createConversationItem(conv)).join('');
        
        // Auto-select first conversation
        if (conversations.length > 0) {
            this.selectConversation(conversations[0].id);
        }
    }

    getConversationsWithLastMessage() {
        const conversationMap = new Map();
        
        // Group messages by conversation
        this.messages.forEach(message => {
            if (!conversationMap.has(message.conversationId)) {
                conversationMap.set(message.conversationId, []);
            }
            conversationMap.get(message.conversationId).push(message);
        });

        // Create conversation objects with last message
        const conversations = [];
        conversationMap.forEach((messages, conversationId) => {
            const sortedMessages = messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            const lastMessage = sortedMessages[0];
            const unreadCount = messages.filter(msg => !msg.read && msg.receiverId === this.currentUser.id).length;
            
            const otherParticipantId = lastMessage.senderId === this.currentUser.id 
                ? lastMessage.receiverId 
                : lastMessage.senderId;
            
            const contact = this.contacts.find(c => c.id === otherParticipantId);
            
            conversations.push({
                id: conversationId,
                contact: contact,
                lastMessage: lastMessage,
                unreadCount: unreadCount,
                timestamp: lastMessage.timestamp
            });
        });

        return conversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    createConversationItem(conversation) {
        const timeAgo = this.getTimeAgo(conversation.timestamp);
        const unreadBadge = conversation.unreadCount > 0 
            ? `<span class="unread-badge">${conversation.unreadCount}</span>` 
            : '';

        return `
            <div class="conversation-item" data-conversation-id="${conversation.id}">
                <div class="conversation-avatar">
                    <img src="${conversation.contact?.avatar || 'assets/images/default-avatar.svg'}" 
                         alt="${conversation.contact?.name || 'Unknown'}">
                    <span class="status-indicator ${conversation.contact?.status || 'offline'}"></span>
                </div>
                <div class="conversation-info">
                    <div class="conversation-header">
                        <h4 class="conversation-name">${conversation.contact?.name || 'Unknown Contact'}</h4>
                        <span class="conversation-time">${timeAgo}</span>
                        ${unreadBadge}
                    </div>
                    <div class="conversation-preview">
                        <span class="last-message">${this.truncateMessage(conversation.lastMessage.content, 50)}</span>
                        ${conversation.lastMessage.context ? `<span class="message-context">• ${conversation.lastMessage.context}</span>` : ''}
                    </div>
                    <div class="conversation-meta">
                        <span class="contact-role">${conversation.contact?.role || ''}</span>
                    </div>
                </div>
            </div>
        `;
    }

    selectConversation(conversationId) {
        // Update active conversation
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const selectedItem = document.querySelector(`[data-conversation-id="${conversationId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }

        // Load conversation messages
        this.loadConversationMessages(conversationId);
        
        // Mark messages as read
        this.markMessagesAsRead(conversationId);
        
        // Update conversation info
        this.updateConversationHeader(conversationId);
        
        // Show message input container
        const messageInputContainer = document.getElementById('messageInputContainer');
        if (messageInputContainer) {
            messageInputContainer.style.display = 'block';
        }
        
        // Focus on message input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.focus();
        }
    }

    loadConversationMessages(conversationId) {
        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer) return;

        const conversationMessages = this.messages
            .filter(msg => msg.conversationId === conversationId)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        if (conversationMessages.length === 0) {
            messagesContainer.innerHTML = `
                <div class="empty-messages">
                    <i class="fas fa-comment-dots"></i>
                    <p>Start a conversation</p>
                </div>
            `;
            return;
        }

        messagesContainer.innerHTML = conversationMessages.map(msg => this.createMessageBubble(msg)).join('');
        this.scrollToBottom();
    }

    createMessageBubble(message) {
        const isOwnMessage = message.senderId === this.currentUser.id;
        const contact = this.contacts.find(c => c.id === message.senderId);
        const sender = isOwnMessage ? this.currentUser : contact;
        
        return `
            <div class="message-item">
                <div class="message-header">
                    <span class="sender-name">${isOwnMessage ? 'You' : (sender?.name || 'Unknown')}</span>
                    <span class="message-time">${this.formatTime(message.timestamp)}</span>
                </div>
                <div class="message-text">${message.content}</div>
            </div>
        `;
    }

    updateConversationHeader(conversationId) {
        const conversation = this.getConversationsWithLastMessage().find(c => c.id === conversationId);
        if (!conversation) return;

        const headerContainer = document.getElementById('conversationHeader');
        if (!headerContainer) return;

        headerContainer.innerHTML = `
            <div class="conversation-header-content">
                <div class="header-avatar">
                    <img src="${conversation.contact?.avatar || 'assets/images/default-avatar.svg'}" 
                         alt="${conversation.contact?.name || 'Unknown'}">
                    <span class="status-indicator ${conversation.contact?.status || 'offline'}"></span>
                </div>
                <div class="header-info">
                    <h3>${conversation.contact?.name || 'Unknown Contact'}</h3>
                    <p class="contact-role">${conversation.contact?.role || ''}</p>
                    <p class="contact-department">${conversation.contact?.department || ''}</p>
                    <span class="last-seen">${this.getLastSeenText(conversation.contact)}</span>
                </div>
            </div>
            <div class="conversation-actions">
                <button class="btn-icon" title="Call">
                    <i class="fas fa-phone"></i>
                </button>
                <button class="btn-icon" title="Video Call">
                    <i class="fas fa-video"></i>
                </button>
                <button class="btn-icon" title="More Options">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </div>
        `;
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        if (!messageInput) return;

        const content = messageInput.value.trim();
        if (!content) return;

        let conversationId, receiverId;
        const activeConversation = document.querySelector('.conversation-item.active');
        
        if (activeConversation) {
            // Existing conversation
            conversationId = activeConversation.dataset.conversationId;
            receiverId = this.getReceiverIdFromConversation(conversationId);
        } else {
            // New conversation - check if we have receiver info from message input
            conversationId = messageInput.dataset.conversationId;
            receiverId = messageInput.dataset.receiverId;
            
            if (!conversationId || !receiverId) {
                this.showStartNewConversation();
                return;
            }
        }

        const newMessage = {
            id: `msg_${Date.now()}`,
            conversationId: conversationId,
            senderId: this.currentUser.id,
            receiverId: receiverId,
            content: content,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'text'
        };

        // Add message to messages array
        this.messages.push(newMessage);
        
        // Save messages to localStorage
        this.saveMessages();

        // Clear input and dataset
        messageInput.value = '';
        messageInput.removeAttribute('data-conversation-id');
        messageInput.removeAttribute('data-receiver-id');

        // Reload conversation
        this.loadConversationMessages(conversationId);
        this.loadConversationsList();
        
        // Update conversation header
        const receiverContact = this.contacts.find(c => c.id === receiverId);
        if (receiverContact) {
            this.updateConversationHeaderForContact(receiverContact);
        }
        
        // Show success feedback
        this.showMessageSentFeedback();
    }
    
    saveMessages() {
        localStorage.setItem('ubwiyunge_messages', JSON.stringify(this.messages));
    }
    
    showMessageSentFeedback() {
        // Simple feedback - could be enhanced
        const sendBtn = document.getElementById('sendMessageBtn');
        if (sendBtn) {
            const originalText = sendBtn.innerHTML;
            sendBtn.innerHTML = '<i class="fas fa-check"></i>';
            sendBtn.disabled = true;
            
            setTimeout(() => {
                sendBtn.innerHTML = originalText;
                sendBtn.disabled = false;
            }, 1000);
        }
    }

    getReceiverIdFromConversation(conversationId) {
        const conversationMessages = this.messages.filter(msg => msg.conversationId === conversationId);
        if (conversationMessages.length === 0) return null;

        const firstMessage = conversationMessages[0];
        return firstMessage.senderId === this.currentUser.id 
            ? firstMessage.receiverId 
            : firstMessage.senderId;
    }

    startConversationWithContact(contactId) {
        // Check if conversation already exists
        const existingConversation = this.messages.find(msg => 
            (msg.senderId === contactId && msg.receiverId === this.currentUser.id) ||
            (msg.senderId === this.currentUser.id && msg.receiverId === contactId)
        );

        if (existingConversation) {
            this.selectConversation(existingConversation.conversationId);
        } else {
            // Create new conversation
            const newConversationId = `conv_${this.currentUser.id}_${contactId}_${Date.now()}`;
            
            // Show empty conversation
            this.loadConversationMessages(newConversationId);
            
            // Update conversation header for new conversation
            const contact = this.contacts.find(c => c.id === contactId);
            if (contact) {
                this.updateConversationHeaderForContact(contact);
            }
            
            // Focus on message input
            const messageInput = document.getElementById('messageInput');
            if (messageInput) {
                messageInput.focus();
                messageInput.dataset.conversationId = newConversationId;
                messageInput.dataset.receiverId = contactId;
            }
            
            // Show message input container
            const messageInputContainer = document.getElementById('messageInputContainer');
            if (messageInputContainer) {
                messageInputContainer.style.display = 'block';
            }
            
            // Enable send button
            const sendBtn = document.getElementById('sendMessageBtn');
            if (sendBtn) {
                sendBtn.disabled = false;
            }
        }
        
        // Reload conversations list to update
        this.loadConversationsList();
    }

    updateConversationHeaderForContact(contact) {
        const headerContainer = document.getElementById('conversationHeader');
        if (!headerContainer) return;

        headerContainer.innerHTML = `
            <div class="conversation-header-content">
                <div class="header-avatar">
                    <img src="${contact.avatar}" alt="${contact.name}">
                    <span class="status-indicator ${contact.status}"></span>
                </div>
                <div class="header-info">
                    <h3>${contact.name}</h3>
                    <p class="contact-role">${contact.role}</p>
                    <p class="contact-department">${contact.department || ''}</p>
                    <span class="last-seen">${this.getLastSeenText(contact)}</span>
                </div>
            </div>
            <div class="conversation-actions">
                <button class="btn-icon" title="Call">
                    <i class="fas fa-phone"></i>
                </button>
                <button class="btn-icon" title="Video Call">
                    <i class="fas fa-video"></i>
                </button>
                <button class="btn-icon" title="More Options">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </div>
        `;
    }

    showStartNewConversation() {
        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer) return;

        const availableContacts = this.contacts;
        
        if (availableContacts.length === 0) {
            messagesContainer.innerHTML = `
                <div class="empty-messages">
                    <i class="fas fa-users"></i>
                    <h3>No contacts available</h3>
                    <p>There are no ${this.currentUser.role === 'citizen' ? 'leaders' : 'users'} available to message.</p>
                </div>
            `;
            return;
        }

        messagesContainer.innerHTML = `
            <div class="start-conversation">
                <div class="start-conversation-header">
                    <h3>Start a new conversation</h3>
                    <p>Select someone to message:</p>
                </div>
                <div class="available-contacts">
                    ${availableContacts.map(contact => `
                        <div class="contact-item" data-contact-id="${contact.id}">
                            <div class="contact-avatar">
                                <img src="${contact.avatar}" alt="${contact.name}">
                                <span class="status-indicator ${contact.status}"></span>
                            </div>
                            <div class="contact-info">
                                <h4 class="contact-name">${contact.name}</h4>
                                <p class="contact-role">${contact.role}</p>
                                <p class="contact-department">${contact.department || ''}</p>
                            </div>
                            <button class="btn-start-chat" onclick="window.messagingSystem.startConversationWithContact('${contact.id}')">
                                <i class="fas fa-comment"></i>
                                Start Chat
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Utility Methods
    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMs = now - time;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return time.toLocaleDateString();
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getLastSeenText(contact) {
        if (!contact) return '';
        
        if (contact.status === 'online') return 'Online';
        if (contact.status === 'away') return 'Away';
        if (contact.status === 'busy') return 'Busy';
        
        return `Last seen ${this.getTimeAgo(contact.lastSeen)}`;
    }

    truncateMessage(message, maxLength) {
        return message.length > maxLength 
            ? message.substring(0, maxLength) + '...' 
            : message;
    }

    markMessagesAsRead(conversationId) {
        this.messages.forEach(message => {
            if (message.conversationId === conversationId && 
                message.receiverId === this.currentUser.id) {
                message.read = true;
            }
        });
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('messagesContainer');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }





    // Public API Methods
    sendQuickMessage(contactId, message, context = null) {
        const contact = this.contacts.find(c => c.id === contactId);
        if (!contact) return false;

        this.startConversationWithContact(contactId);
        
        // Pre-fill message input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.value = message;
            messageInput.focus();
        }

        return true;
    }

    getUnreadCount() {
        return this.messages.filter(msg => 
            !msg.read && msg.receiverId === this.currentUser.id
        ).length;
    }
}

// Initialize messaging system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.messagingSystem = new MessagingSystem();
});

// Export for global access
window.MessagingSystem = MessagingSystem;

// MESSAGING HYBRID SYSTEM NOW ACTIVE - SIMPLE-CHAT.JS WILL BE COMMENTED OUT