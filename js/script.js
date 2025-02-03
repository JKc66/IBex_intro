// JavaScript functions
// Use modern JavaScript features and best practices
const copyToClipboard = async (text) => {
    // Try using the modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Clipboard API failed: ', err);
            // Fall through to fallback
        }
    }
    
    // Fallback using temporary textarea element
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Make the textarea hidden but maintain its content layout
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        
        // Select and copy the text
        textArea.select();
        document.execCommand('copy');
        
        // Clean up
        textArea.remove();
        return true;
    } catch (err) {
        console.error('Fallback clipboard method failed: ', err);
        return false;
    }
};

// Smooth scroll implementation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced progress bar with throttle
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

const updateProgressBar = () => {
    requestAnimationFrame(() => {
        const winScroll = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById("progress-bar");
        if (progressBar) {
            progressBar.style.width = `${scrolled}%`;
        }
    });
};

// Optimized scroll listener
window.addEventListener('scroll', throttle(updateProgressBar, 50));

// Enhanced copy button functionality
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('copy-button')) {
        const button = event.target;
        const container = button.closest('.code-container');
        if (!container) return;

        const code = container.querySelector('code')?.textContent;
        if (!code) return;

        button.disabled = true;
        const originalText = button.textContent;
        
        try {
            const success = await copyToClipboard(code);
            button.textContent = success ? '✓ Copied!' : 'Failed to copy';
            button.style.backgroundColor = success ? 'var(--kaust-green)' : 'var(--kaust-orange)';
        } catch (error) {
            button.textContent = 'Failed to copy';
            button.style.backgroundColor = 'var(--kaust-orange)';
        }

        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.disabled = false;
        }, 2000);
    }
});

// Improved dark mode toggle with animation
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;
const icon = darkModeToggle?.querySelector('i');

if (darkModeToggle && icon) {
    const toggleDarkMode = () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        
        // Animate icon rotation
        icon.style.transform = `rotate(${isDarkMode ? '360deg' : '0deg'})`;
        icon.classList.toggle('fa-moon', !isDarkMode);
        icon.classList.toggle('fa-sun', isDarkMode);
        
        localStorage.setItem('darkMode', isDarkMode);
        
        // Trigger transition effect
        document.documentElement.style.setProperty('--transition-trigger', isDarkMode ? '1' : '0');
    };

    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Initialize dark mode based on preference
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

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (storedDarkMode === null) {
            body.classList.toggle('dark-mode', e.matches);
            icon.classList.toggle('fa-sun', e.matches);
            icon.classList.toggle('fa-moon', !e.matches);
        }
    });
}

// Enhanced code block functionality
document.querySelectorAll('.code-container').forEach((container) => {
    const pre = container.querySelector('pre');
    if (pre) {
        // Add line numbers class
        pre.classList.add('line-numbers');
        
        // Ensure code element has proper language class
        const code = pre.querySelector('code');
        if (code) {
            // If no language class exists, add a default one
            if (!Array.from(code.classList).some(cls => cls.startsWith('language-'))) {
                code.classList.add('language-plaintext');
            }
        }
        
        // Add copy button
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'button-wrapper';
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        
        buttonWrapper.appendChild(copyButton);
        container.appendChild(buttonWrapper);
    }
});

// Force Prism to reprocess all code blocks
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Prism
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
    
    updateProgressBar();
    initTooltips();
});

// Add intersection observer for animations
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.step').forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
};

// Initialize animations
observeElements();

// Keyboard navigation enhancement
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement !== document.body) {
            activeElement.blur();
        }
    }
});

// Add resize observer for responsive adjustments
const resizeObserver = new ResizeObserver(throttle(() => {
    document.querySelectorAll('.code-container').forEach(container => {
        const height = container.querySelector('pre')?.scrollHeight || 0;
        container.style.setProperty('--content-height', `${height}px`);
    });
}, 100));

document.querySelectorAll('.code-container').forEach(container => {
    resizeObserver.observe(container);
});

// Initialize tooltips
const initTooltips = () => {
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);

            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        });

        element.addEventListener('mouseleave', () => {
            document.querySelector('.tooltip')?.remove();
        });
    });
};

// Mobile warning handler
const dismissMobileWarning = () => {
    const warning = document.querySelector('.mobile-warning');
    if (warning) {
        warning.style.display = 'none';
        localStorage.setItem('mobile-warning-dismissed', 'true');
        // Remove the extra padding from body
        document.body.style.paddingTop = '0';
    }
};

// Check if warning should be shown on mobile
const checkMobileWarning = () => {
    if (window.innerWidth <= 768 && !localStorage.getItem('mobile-warning-dismissed')) {
        const warning = document.querySelector('.mobile-warning');
        if (warning) {
            warning.style.display = 'flex';
            document.body.style.paddingTop = '50px';
        }
    }
};

// Run on page load and resize
window.addEventListener('load', checkMobileWarning);
window.addEventListener('resize', checkMobileWarning);