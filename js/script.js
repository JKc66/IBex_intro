// JavaScript functions
// Use modern JavaScript features and best practices
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        console.log('Copying to clipboard was successful!');
    } catch (err) {
        console.error('Could not copy text: ', err);
    }
};

const updateProgressBar = () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("progress-bar").style.width = `${scrolled}%`;
};

// Use event delegation for better performance
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('copy-button')) {
        const buttonWrapper = event.target.closest('.button-wrapper');
        const preElements = document.querySelectorAll('.code-container pre');
        let targetPre = null;
        
        // Find the pre element closest to the button
        const buttonRect = buttonWrapper.getBoundingClientRect();
        preElements.forEach(pre => {
            const rect = pre.getBoundingClientRect();
            if (Math.abs(rect.top - buttonRect.top) < 50) {
                targetPre = pre;
            }
        });
        
        if (targetPre) {
            const code = targetPre.querySelector('code').textContent;
            copyToClipboard(code);
            event.target.textContent = 'Copied!';
            setTimeout(() => {
                event.target.textContent = 'Copy';
            }, 2000);
        }
    }
});

// Debounce function for scroll event
const debounce = (func, wait) => {
    let timeout;
    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
};

const debouncedUpdateProgressBar = debounce(updateProgressBar, 10);
window.addEventListener('scroll', debouncedUpdateProgressBar);

// Dark mode toggle functionality
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;
const icon = darkModeToggle.querySelector('i');

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    icon.classList.toggle('fa-moon', !isDarkMode);
    icon.classList.toggle('fa-sun', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
});

// Check for user's preference
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const storedDarkMode = localStorage.getItem('darkMode');

if (storedDarkMode !== null) {
    body.classList.toggle('dark-mode', JSON.parse(storedDarkMode));
} else if (prefersDarkScheme.matches) {
    body.classList.add('dark-mode');
}

// Update icon based on current mode
icon.classList.toggle('fa-sun', body.classList.contains('dark-mode'));
icon.classList.toggle('fa-moon', !body.classList.contains('dark-mode'));

// Listen for changes in color scheme preference
prefersDarkScheme.addEventListener('change', (e) => {
    if (storedDarkMode === null) {
        body.classList.toggle('dark-mode', e.matches);
        icon.classList.toggle('fa-sun', e.matches);
        icon.classList.toggle('fa-moon', !e.matches);
    }
});

// Add copy buttons to code blocks
document.querySelectorAll('.code-container pre').forEach((pre, index) => {
    try {
        console.log(`Creating button for code block ${index}`);
        
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'button-wrapper';
        
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copy';
        
        // Initial positioning
        const updateButtonPosition = () => {
            const rect = pre.getBoundingClientRect();
            const containerRect = pre.closest('.code-container').getBoundingClientRect();
            
            // Position relative to the code container
            buttonWrapper.style.position = 'absolute';
            buttonWrapper.style.top = '10px';  // Fixed distance from top
            buttonWrapper.style.right = '10px'; // Fixed distance from right
            
            // Show/hide based on visibility
            if (containerRect.top < -containerRect.height || containerRect.bottom > window.innerHeight + containerRect.height) {
                buttonWrapper.style.display = 'none';
            } else {
                buttonWrapper.style.display = 'block';
            }
        };
        
        // Add button to the code container instead of body
        const container = pre.closest('.code-container');
        container.style.position = 'relative'; // Ensure container can position absolute children
        buttonWrapper.appendChild(button);
        container.appendChild(buttonWrapper);
        
        // Update position on various events
        ['scroll', 'resize', 'load'].forEach(event => {
            window.addEventListener(event, updateButtonPosition);
            container.addEventListener(event, updateButtonPosition);
        });
        
        // Initial position update
        updateButtonPosition();
        
        console.log(`Successfully created button for code block ${index}`);
    } catch (error) {
        console.error(`Error creating copy button for code block ${index}:`, error);
    }
});

// Add keyboard navigation for accessibility
let isTabbing = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !isTabbing) {
        isTabbing = true;
        document.body.classList.add('user-is-tabbing');
    }
});

document.addEventListener('mousedown', () => {
    if (isTabbing) {
        isTabbing = false;
        document.body.classList.remove('user-is-tabbing');
    }
});