// Simple and Direct JavaScript

// DOM Elements
const cursor = document.getElementById('cursor');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const navLinks = document.querySelectorAll('.nav-links a');

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initCursor();
    initSidebar();
    initNavigation();
    initScrollSpy();
    initCarousel();
    initAccordion();
});

// Cursor functionality
function initCursor() {
    if (!cursor) return;
    
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
        return;
    }
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = (e.clientX - 10) + 'px';
        cursor.style.top = (e.clientY - 10) + 'px';
    });
    
    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Show cursor when mouse enters window
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
}

// Sidebar functionality
function initSidebar() {
    if (!sidebar || !sidebarToggle) return;
    
    sidebarToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        sidebar.classList.toggle('active');
        
        const isOpen = sidebar.classList.contains('active');
        sidebarToggle.setAttribute('aria-expanded', isOpen);
        sidebar.setAttribute('aria-hidden', !isOpen);
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('active');
            sidebarToggle.setAttribute('aria-expanded', 'false');
            sidebar.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Close sidebar on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            sidebar.classList.remove('active');
            sidebarToggle.setAttribute('aria-expanded', 'false');
            sidebar.setAttribute('aria-hidden', 'true');
        }
    });
}

// Navigation functionality
function initNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-section');
            if (targetId) {
                // Disable scroll spy temporarily
                scrollSpyEnabled = false;
                
                // Update active link immediately
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                scrollToSection(targetId);
                
                // Re-enable scroll spy after scroll completes
                setTimeout(() => {
                    scrollSpyEnabled = true;
                }, 1000);
                
                // Close sidebar after navigation
                sidebar.classList.remove('active');
                sidebarToggle.setAttribute('aria-expanded', 'false');
                sidebar.setAttribute('aria-hidden', 'true');
            }
        });
    });
}

// Smooth scroll function
function scrollToSection(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    
    const headerOffset = 80;
    const offsetTop = targetId === 'hero' ? 0 : target.offsetTop - headerOffset;
    
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
}

// Scroll spy functionality
let scrollSpyEnabled = true;

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        if (!scrollSpyEnabled) return;
        
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section link
                const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Run once on load
}

// Carousel functionality
let currentSlideIndex = 1;

function initCarousel() {
    const slides = document.querySelectorAll('.review-card');
    if (slides.length === 0) return;
    
    showSlide(currentSlideIndex);
    
    // Auto-play carousel
    setInterval(() => {
        currentSlideIndex = currentSlideIndex >= slides.length ? 1 : currentSlideIndex + 1;
        showSlide(currentSlideIndex);
    }, 5000);
}

function showSlide(slideIndex) {
    const slides = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    // Normalize slide index
    if (slideIndex > slides.length) currentSlideIndex = 1;
    if (slideIndex < 1) currentSlideIndex = slides.length;
    
    // Remove active classes
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active classes
    if (slides[currentSlideIndex - 1]) {
        slides[currentSlideIndex - 1].classList.add('active');
    }
    if (dots[currentSlideIndex - 1]) {
        dots[currentSlideIndex - 1].classList.add('active');
    }
}

// Manual slide control
function currentSlide(slideIndex) {
    currentSlideIndex = slideIndex;
    showSlide(currentSlideIndex);
}

// Make currentSlide global
window.currentSlide = currentSlide;

// Accordion functionality
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            toggleAccordion(header);
        });
    });
}

function toggleAccordion(header) {
    const content = header.nextElementSibling;
    if (!content) return;
    
    const isActive = header.classList.contains('active');
    
    // Close all other accordions
    document.querySelectorAll('.accordion-header').forEach(h => {
        if (h !== header) {
            h.classList.remove('active');
            const c = h.nextElementSibling;
            if (c) c.classList.remove('active');
        }
    });
    
    // Toggle current accordion
    if (!isActive) {
        header.classList.add('active');
        content.classList.add('active');
    } else {
        header.classList.remove('active');
        content.classList.remove('active');
    }
}

// Make toggleAccordion global
window.toggleAccordion = toggleAccordion;

// Resize handler
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
        sidebarToggle.setAttribute('aria-expanded', 'false');
        sidebar.setAttribute('aria-hidden', 'true');
    }
});