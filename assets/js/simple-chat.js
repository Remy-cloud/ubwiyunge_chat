// Simple Chat System for School Project
// COMMENTED OUT TO AVOID CONFLICTS WITH MESSAGING-HYBRID.JS
/*
class SimpleChat {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            const user = JSON.parse(userData);
            return {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                role: user.role
            };
        }
        return {
            id: 'guest',
            name: 'Guest User',
            role: 'citizen'
        };
    }

    init() {
        // Clean up old chat data format
        this.cleanupOldChatData();
        
        // Check if we're chatting with a specific leader (coming from leaders page)
        const chatWith = localStorage.getItem('chatWith');
        if (chatWith) {
            const leader = JSON.parse(chatWith);
            this.startChatWithLeader(leader);
            localStorage.removeItem('chatWith');
        } else {
            // Show user's inbox
            this.showUserInbox();
        }

        this.setupSendMessage();
    }

    // Clean up old duplicate chat data
    cleanupOldChatData() {
        const keys = Object.keys(localStorage);
        const oldChatKeys = keys.filter(key => key.startsWith('chat_'));
        
        // Remove old chat format data (only run once)
        if (!localStorage.getItem('chatDataCleaned')) {
            oldChatKeys.forEach(key => {
                localStorage.removeItem(key);
            });
            localStorage.setItem('chatDataCleaned', 'true');
        }
    }

    startChatWithLeader(leader) {
        // Show leader name in header
        const header = document.getElementById('conversationHeader');
        header.innerHTML = `
            <div class="chat-header-content">
                <h3>Chat with ${leader.name}</h3>
                <p>Leader</p>
            </div>
        `;

        // Show messages area
        this.showMessagesArea(leader);
        
        // Load existing messages
        this.loadMessages(leader.id);
    }

    showUserInbox() {
        if (this.currentUser.role === 'leader') {
            this.showLeaderInbox();
        } else {
            this.showCitizenInbox();
        }
    }

    showCitizenInbox() {
        // Get all chats where this citizen is involved
        const allChats = this.getAllChatsForUser();
        
        if (allChats.length === 0) {
            // Show empty state
            const conversationsList = document.getElementById('conversationsList');
            conversationsList.innerHTML = `
                <div class="empty-inbox">
                    <i class="fas fa-comments"></i>
                    <h3>No conversations yet</h3>
                    <p>Go to Leaders page to start chatting with community leaders</p>
                </div>
            `;
            this.showWelcomeMessage('Your Conversations', 'Select a leader to view conversation');
            return;
        }

        // Show list of leaders this citizen has chatted with
        this.displayContactsList(allChats);
        this.showWelcomeMessage('Your Conversations', 'Select a leader to view conversation');
    }

    showLeaderInbox() {
        const allChats = this.getAllChatsForUser();
        
        if (allChats.length === 0) {
            // Show empty state
            const conversationsList = document.getElementById('conversationsList');
            conversationsList.innerHTML = `
                <div class="empty-inbox">
                    <i class="fas fa-inbox"></i>
                    <h3>No messages yet</h3>
                    <p>Citizens will appear here when they message you</p>
                </div>
            `;
            this.showWelcomeMessage('Your Messages', 'Select a citizen to view conversation');
            return;
        }

        // Show list of citizens who have messaged this leader
        this.displayContactsList(allChats);
        this.showWelcomeMessage('Your Messages', 'Select a citizen to view conversation');
    }

    showWelcomeMessage(title, subtitle) {
        const header = document.getElementById('conversationHeader');
        header.innerHTML = `
            <div class="chat-header-content">
                <h3>${title}</h3>
                <p>${subtitle}</p>
            </div>
        `;
        
        // Hide messages area and input
        const messagesContainer = document.getElementById('messagesContainer');
        const messageInputContainer = document.getElementById('messageInputContainer');
        messagesContainer.innerHTML = '';
        messageInputContainer.style.display = 'none';
    }

    getAllChatsForUser() {
        const chats = [];
        const keys = Object.keys(localStorage);
        
        // Debug: Log current user and found conversation keys
        console.log('Current user:', this.currentUser);
        console.log('All localStorage keys:', keys.filter(key => key.startsWith('conversation_')));
        
        keys.forEach(key => {
            if (key.startsWith('conversation_')) {
                // Parse the conversation key properly
                const parts = key.replace('conversation_', '').split('_');
                if (parts.length >= 2) {
                    const userId1 = parts[0];
                    const userId2 = parts[1];
                    
                    // Debug: Log conversation parsing
                    console.log(`Checking conversation ${key}: user1=${userId1}, user2=${userId2}`);
                    
                    // Check if current user is part of this conversation
                    if (userId1 === this.currentUser.id || userId2 === this.currentUser.id) {
                        console.log(`✓ Current user is part of conversation ${key}`);
                        const messages = JSON.parse(localStorage.getItem(key));
                        if (messages.length > 0) {
                            // Get the other user's info
                            const otherUserId = userId1 === this.currentUser.id ? userId2 : userId1;
                            
                            // Get the other user's name from the first message
                            const firstMessage = messages[0];
                            const otherUserName = firstMessage.senderId === this.currentUser.id ? 
                                firstMessage.receiverName : firstMessage.senderName;
                            
                            // Get last message
                            const lastMessage = messages[messages.length - 1];
                            
                            chats.push({
                                userId: otherUserId,
                                userName: otherUserName,
                                lastMessage: lastMessage.text,
                                lastMessageTime: lastMessage.timestamp,
                                role: firstMessage.senderId === this.currentUser.id ? 
                                    (firstMessage.receiverRole || 'leader') :
                                    (firstMessage.senderRole || 'citizen')
                            });
                            
                            console.log(`Added chat with ${otherUserName} (${otherUserId})`);
                        }
                    } else {
                        console.log(`✗ Current user (${this.currentUser.id}) not part of conversation ${key}`);
                    }
                }
            }
        });
        
        console.log('Final chats found:', chats);
        
        // Sort by last message time (newest first)
        return chats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
    }

    displayContactsList(chats) {
        const conversationsList = document.getElementById('conversationsList');
        
        conversationsList.innerHTML = chats.map(chat => `
            <div class="conversation-item" onclick="window.simpleChat.openChatWith('${chat.userId}', '${chat.userName}')">
                <div class="conversation-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="conversation-info">
                    <h4>${chat.userName}</h4>
                    <p class="last-message">${chat.lastMessage}</p>
                    <small class="last-time">${new Date(chat.lastMessageTime).toLocaleString()}</small>
                </div>
            </div>
        `).join('');
    }

    openChatWith(userId, userName) {
        // Determine the role of the person we're chatting with
        let chatPartnerRole;
        if (this.currentUser.role === 'leader') {
            chatPartnerRole = 'Citizen';
        } else {
            chatPartnerRole = 'Leader';
        }
        
        // Show chat header
        const header = document.getElementById('conversationHeader');
        header.innerHTML = `
            <div class="chat-header-content">
                <h3>Chat with ${userName}</h3>
                <p>${chatPartnerRole}</p>
            </div>
        `;

        // Show messages area
        this.showMessagesArea({ 
            id: userId, 
            name: userName, 
            role: chatPartnerRole.toLowerCase() 
        });
        
        // Load messages
        this.loadMessages(userId);
    }

    showMessagesArea(chatPartner) {
        const messagesContainer = document.getElementById('messagesContainer');
        const messageInputContainer = document.getElementById('messageInputContainer');
        
        messagesContainer.innerHTML = '<div id="messagesList"></div>';
        messageInputContainer.style.display = 'block';
        
        // Store current chat partner
        this.currentChatPartner = chatPartner;
    }

    loadMessages(otherUserId) {
        const conversationId = this.createConversationId(this.currentUser.id, otherUserId);
        const messages = JSON.parse(localStorage.getItem(conversationId) || '[]');
        
        const messagesList = document.getElementById('messagesList');
        messagesList.innerHTML = '';
        
        messages.forEach(message => {
            this.displayMessage(message);
        });
        
        // Scroll to bottom
        messagesList.scrollTop = messagesList.scrollHeight;
    }

    displayMessage(message) {
        const messagesList = document.getElementById('messagesList');
        const messageDiv = document.createElement('div');
        
        const isMyMessage = message.senderId === this.currentUser.id;
        messageDiv.className = `message ${isMyMessage ? 'my-message' : 'other-message'}`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message.text}</p>
                <small>${new Date(message.timestamp).toLocaleTimeString()}</small>
            </div>
        `;
        
        messagesList.appendChild(messageDiv);
    }

    setupSendMessage() {
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
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const text = messageInput.value.trim();
        
        if (!text || !this.currentChatPartner) return;
        
        const message = {
            id: Date.now(),
            senderId: this.currentUser.id,
            senderName: this.currentUser.name,
            senderRole: this.currentUser.role,
            receiverId: this.currentChatPartner.id,
            receiverName: this.currentChatPartner.name,
            receiverRole: this.currentChatPartner.role || 'leader',
            text: text,
            timestamp: new Date().toISOString()
        };
        
        // Save message
        this.saveMessage(message);
        
        // Display message
        this.displayMessage(message);
        
        // Clear input
        messageInput.value = '';
        
        // Scroll to bottom
        const messagesList = document.getElementById('messagesList');
        messagesList.scrollTop = messagesList.scrollHeight;

        // Refresh the conversations list
        setTimeout(() => {
            const allChats = this.getAllChatsForUser();
            if (allChats.length > 0) {
                this.displayContactsList(allChats);
            }
        }, 100);
    }

    saveMessage(message) {
        // Create a unique conversation ID that's the same for both users
        const conversationId = this.createConversationId(this.currentUser.id, this.currentChatPartner.id);
        const messages = JSON.parse(localStorage.getItem(conversationId) || '[]');
        messages.push(message);
        localStorage.setItem(conversationId, JSON.stringify(messages));
    }

    createConversationId(userId1, userId2) {
        // Always put the smaller ID first to ensure same conversation ID for both users
        const ids = [userId1, userId2].sort();
        return `conversation_${ids[0]}_${ids[1]}`;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.simpleChat = new SimpleChat();
});
*/

// SIMPLE CHAT SYSTEM COMMENTED OUT - USING MESSAGING-HYBRID.JS INSTEAD