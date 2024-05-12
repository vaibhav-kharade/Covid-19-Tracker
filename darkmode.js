// Check if dark mode preference is saved
const isDarkMode = localStorage.getItem('darkMode') === 'true';

// Apply dark mode if saved preference is true
if (isDarkMode) {
    document.body.classList.add('dark-mode');
}

// Toggle dark mode when the button is clicked and save the preference
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

document.getElementById('toggle-dark-mode').addEventListener('click', toggleDarkMode);
