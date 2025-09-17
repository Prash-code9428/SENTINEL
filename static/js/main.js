// SENTINEL Platform - Enhanced Interactive JavaScript
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeInteractiveEffects();
    initializeCosmicEffects();
});

function initializeApp() {
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize loading states
    showLoadingStates();
    
    // Initialize parallax effects
    initParallaxEffects();
    
    // Initialize cosmic dust
    initCosmicDust();
    
    console.log('SENTINEL Platform initialized with enhanced interactivity');
}

function initializeInteractiveEffects() {
    // Add subtle floating animation to weather cards
    const weatherCards = document.querySelectorAll('.weather-card');
    weatherCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.5}s`;
        
        // Add gentle click effect only
        card.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
        
        // Simple hover effect for particles
        card.addEventListener('mouseenter', function() {
            createSubtleParticles(this);
        });
    });
    
    // Simplified button interactions
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
    
    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        addSimpleTypingEffect(heroTitle, 'SENTINEL');
    }
    
    // Initialize gentle scroll animations
    addScrollAnimations();
}

function initializeCosmicEffects() {
    // Minimal cosmic effects - just subtle hover glow
    const cards = document.querySelectorAll('.card, .status-card, .impact-card');
    cards.forEach(card => {
        card.classList.add('hover-glow');
    });
}

function initCosmicDust() {
    // Reduce cosmic dust frequency
    setInterval(() => {
        if (Math.random() < 0.1) { // Reduced from 0.3 to 0.1
            createCosmicDust();
        }
    }, 5000); // Increased interval from 2000 to 5000
}

function createCosmicDust() {
    const dust = document.createElement('div');
    dust.classList.add('cosmic-dust');
    
    // Random horizontal position
    dust.style.left = Math.random() * window.innerWidth + 'px';
    
    // Random size and opacity
    const size = Math.random() * 3 + 1;
    dust.style.width = size + 'px';
    dust.style.height = size + 'px';
    dust.style.opacity = Math.random() * 0.7 + 0.3;
    
    // Random animation duration
    dust.style.animationDuration = (Math.random() * 6 + 4) + 's';
    
    document.body.appendChild(dust);
    
    // Remove after animation
    setTimeout(() => {
        if (dust.parentNode) {
            dust.remove();
        }
    }, 10000);
}

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
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
}

// Loading States
function showLoadingStates() {
    const loadingElements = document.querySelectorAll('.loading, .status-value');
    loadingElements.forEach(element => {
        if (element.textContent === 'Loading...' || element.textContent === '') {
            element.style.opacity = '0.6';
            element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        }
    });
}

// API Helper Functions
class SentinelAPI {
    constructor() {
        this.baseURL = '';
        this.isLoading = false;
    }
    
    async fetchData(endpoint, params = {}) {
        if (this.isLoading) return null;
        
        this.isLoading = true;
        const urlParams = new URLSearchParams(params);
        const url = `/api/${endpoint}?${urlParams}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.isLoading = false;
            return data;
        } catch (error) {
            console.error('API Error:', error);
            this.isLoading = false;
            return null;
        }
    }
    
    async getEvents(days = 30) {
        return await this.fetchData('events', { days });
    }
    
    async getSolarFlares(days = 30) {
        return await this.fetchData('solar-flares', { days });
    }
    
    async getCMEEvents(days = 30) {
        return await this.fetchData('cme', { days });
    }
    
    async getGeomagneticStorms(days = 30) {
        return await this.fetchData('geomagnetic', { days });
    }
    
    async getSystemStatus() {
        return await this.fetchData('status');
    }
}

// Global API instance
window.sentinelAPI = new SentinelAPI();

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Invalid Date';
    }
}

function getEventClassification(event) {
    if (event.classType) {
        return event.classType;
    }
    if (event.type === 'FLR' && event.peakTime) {
        return event.peakTime.charAt(0) + '-Class';
    }
    return 'Unknown';
}

function createEventCard(event) {
    const eventType = getEventType(event);
    const classification = getEventClassification(event);
    const date = formatDate(event.beginTime || event.eventTime);
    
    return `
        <div class="event-card ${eventType.toLowerCase()}">
            <div class="event-icon">
                <i class="${getEventIcon(eventType)}"></i>
            </div>
            <div class="event-details">
                <h4>${eventType}</h4>
                <p class="event-classification">${classification}</p>
                <p class="event-date">${date}</p>
            </div>
        </div>
    `;
}

function getEventType(event) {
    if (event.type) {
        switch (event.type) {
            case 'FLR': return 'Solar Flare';
            case 'CME': return 'CME';
            case 'GST': return 'Geomagnetic Storm';
            default: return 'Space Weather Event';
        }
    }
    return 'Unknown Event';
}

function getEventIcon(eventType) {
    switch (eventType) {
        case 'Solar Flare': return 'fas fa-sun';
        case 'CME': return 'fas fa-wind';
        case 'Geomagnetic Storm': return 'fas fa-chart-line';
        default: return 'fas fa-exclamation-triangle';
    }
}

// Export/Download Functions
function exportToCSV(data, filename) {
    if (!data || data.length === 0) {
        alert('No data available to export');
        return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => 
            JSON.stringify(row[header] || '')
        ).join(','))
    ].join('\n');
    
    downloadFile(csvContent, filename + '.csv', 'text/csv');
}

function exportToJSON(data, filename) {
    if (!data) {
        alert('No data available to export');
        return;
    }
    
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, filename + '.json', 'application/json');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Error Handling
function showError(message, element = null) {
    console.error('SENTINEL Error:', message);
    
    if (element) {
        element.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
            </div>
        `;
    }
}

function showSuccess(message, element = null) {
    console.log('SENTINEL Success:', message);
    
    if (element) {
        element.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
    }
}

// Animation and UI Enhancement
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation for children
                const children = entry.target.querySelectorAll('.card, .weather-card, .feature-highlight');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.card, .status-card, .feature-card, .weather-card, .feature-highlight, .impact-card').forEach(el => {
        observer.observe(el);
    });
}

function createFloatingParticles(element) {
    const particles = 8;
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < particles; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.classList.add('floating-particle');
            
            // Enhanced particle with random properties
            const size = Math.random() * 4 + 3;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Random position around element perimeter
            const angle = Math.random() * Math.PI * 2;
            const distance = 30 + Math.random() * 40;
            const x = rect.left + rect.width / 2 + Math.cos(angle) * distance;
            const y = rect.top + rect.height / 2 + Math.sin(angle) * distance;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            // Random color variation
            const opacity = Math.random() * 0.5 + 0.5;
            particle.style.background = `radial-gradient(circle, rgba(138, 43, 226, ${opacity}), transparent)`;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 3000);
        }, i * 150);
    }
}

// Simplified Interactive Effects
function createRippleEffect(event, element) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function addSimpleTypingEffect(element, text) {
    element.innerHTML = '';
    let index = 0;
    
    function typeChar() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeChar, 150);
        } else {
            element.classList.add('typing-complete');
        }
    }
    
    setTimeout(typeChar, 1000);
}

function createSubtleParticles(element) {
    const particles = 3; // Reduced from 8 to 3
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < particles; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.classList.add('floating-particle');
            
            // Smaller, subtler particles
            const size = Math.random() * 2 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Position around element perimeter
            const angle = Math.random() * Math.PI * 2;
            const distance = 20 + Math.random() * 30;
            const x = rect.left + rect.width / 2 + Math.cos(angle) * distance;
            const y = rect.top + rect.height / 2 + Math.sin(angle) * distance;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            // Subtle color
            const opacity = Math.random() * 0.3 + 0.2;
            particle.style.background = `radial-gradient(circle, rgba(138, 43, 226, ${opacity}), transparent)`;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 2000);
        }, i * 200);
    }
}

function initParallaxEffects() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.1; // Reduced parallax effect
        
        const starfield = document.querySelector('.starfield');
        if (starfield) {
            starfield.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}