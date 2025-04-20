document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('login-btn');
  const errorMessage = document.getElementById('error-message');
  const themeToggle = document.getElementById('theme-toggle');

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

  loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username) {
      showError('Username tidak boleh kosong');
      return;
    }

    if (!password) {
      showError('Password tidak boleh kosong');
      return;
    }

    // Simulate login (in a real app, this would be a server request)
    if (password === "Ratubagus") {
      // Save username to localStorage
      localStorage.setItem('username', username);
      // Redirect to chat page
      window.location.href = 'chat.html';
    } else {
      showError('Password salah! Gunakan password "Ratubagus".');
    }
  });

  function showError(message) {
    errorMessage.textContent = message;
    setTimeout(() => {
      errorMessage.textContent = '';
    }, 3000);
  }

  // Allow login on Enter key
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      loginBtn.click();
    }
  });
});