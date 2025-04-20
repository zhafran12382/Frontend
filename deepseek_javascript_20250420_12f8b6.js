document.addEventListener('DOMContentLoaded', () => {
  const socket = io(); // Connect to Socket.IO server
  const chatMessages = document.getElementById('chat-messages');
  const messageInput = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-btn');
  const typingIndicator = document.getElementById('typing-indicator');
  const onlineCount = document.getElementById('online-count');
  const themeToggle = document.getElementById('theme-toggle');
  const notificationSound = document.getElementById('notification-sound');
  
  let username = localStorage.getItem('username');
  let isTyping = false;
  let lastTypingTime = 0;
  
  // Check for saved theme preference
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
  
  // Theme toggle
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  });
  
  // Login with saved username
  socket.emit('login', { username, password: "Ratubagus" }, (response) => {
    if (!response.success) {
      showToast(response.message);
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 3000);
    }
  });
  
  // Handle new messages
  socket.on('new message', (data) => {
    addMessage(data.username, data.text, data.color, false);
    playNotification();
    scrollToBottom();
  });
  
  // Handle user joined/left
  socket.on('user joined', (user) => {
    showToast(`${user.username} bergabung`);
    updateOnlineCount();
  });
  
  socket.on('user left', (user) => {
    showToast(`${user.username} keluar`);
    updateOnlineCount();
  });
  
  socket.on('update users', (users) => {
    updateOnlineCount(users.length);
  });
  
  // Handle typing indicators
  socket.on('typing', (usernames) => {
    if (usernames.length > 0) {
      typingIndicator.textContent = `${usernames.join(', ')} mengetik...`;
    } else {
      typingIndicator.textContent = '';
    }
  });
  
  // Send message
  function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
      socket.emit('new message', { text: message });
      addMessage(username, message, '', true);
      messageInput.value = '';
      scrollToBottom();
    }
  }
  
  sendBtn.addEventListener('click', sendMessage);
  
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Typing indicators
  messageInput.addEventListener('input', () => {
    if (!isTyping) {
      isTyping = true;
      socket.emit('typing');
    }
    
    lastTypingTime = Date.now();
    
    setTimeout(() => {
      if (Date.now() - lastTypingTime > 2000 && isTyping) {
        socket.emit('stop typing');
        isTyping = false;
      }
    }, 2000);
  });
  
  messageInput.addEventListener('blur', () => {
    if (isTyping) {
      socket.emit('stop typing');
      isTyping = false;
    }
  });
  
  // Add message to chat
  function addMessage(sender, text, color, isSent) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isSent ? 'sent' : 'received');
    
    const usernameSpan = document.createElement('div');
    usernameSpan.classList.add('message-username');
    usernameSpan.textContent = sender;
    if (color) usernameSpan.style.color = color;
    
    const textSpan = document.createElement('div');
    textSpan.classList.add('message-text');
    textSpan.textContent = text;
    
    const timeSpan = document.createElement('div');
    timeSpan.classList.add('message-time');
    timeSpan.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.appendChild(usernameSpan);
    messageDiv.appendChild(textSpan);
    messageDiv.appendChild(timeSpan);
    
    chatMessages.appendChild(messageDiv);
  }
  
  // Scroll to bottom of chat
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Update online count
  function updateOnlineCount(count) {
    if (count !== undefined) {
      onlineCount.textContent = `${count}/6 online`;
    }
  }
  
  // Show toast notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
  
  // Play notification sound
  function playNotification() {
    if (document.hidden) {
      notificationSound.currentTime = 0;
      notificationSound.play().catch(e => console.log('Autoplay prevented:', e));
    }
  }
  
  // Handle tab visibility changes for notifications
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.title = 'New Message - Group Chat';
    } else {
      document.title = 'Group Chat';
    }
  });
  
  // Initial scroll to bottom
  scrollToBottom();
});