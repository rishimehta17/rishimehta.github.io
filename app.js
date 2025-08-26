// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initSmoothScrolling();
    initContactForm();
    initScrollAnimations();
    initProjectButtons();
    initAnimeAnimations();
    initSkillBars();
    initFloatingShapes();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Toggle mobile menu
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close menu when clicking on a link (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (navMenu && navToggle) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Close menu when clicking outside (mobile)
    document.addEventListener('click', function(e) {
        if (navMenu && navToggle && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (header) {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        }
    });
}

// Smooth scrolling for navigation links - FIXED
function initSmoothScrolling() {
    // Get all links that start with #
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 70;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                // Use both methods to ensure compatibility
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fallback for browsers that don't support smooth behavior
                if (!('scrollBehavior' in document.documentElement.style)) {
                    smoothScrollTo(targetPosition, 800);
                }
            }
        });
    });
}

// Fallback smooth scroll function
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Contact form validation and submission - FIXED
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const formFields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message')
    };

    // Check if all form fields exist
    const allFieldsExist = Object.values(formFields).every(field => field !== null);
    if (!allFieldsExist) {
        console.error('Contact form fields missing');
        return;
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Clear previous errors
        clearFormErrors();
        
        // Validate each field
        if (!validateName(formFields.name.value)) {
            showError('name-error', 'Please enter your name (at least 2 characters)');
            isValid = false;
        }
        
        if (!validateEmail(formFields.email.value)) {
            showError('email-error', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!validateSubject(formFields.subject.value)) {
            showError('subject-error', 'Please enter a subject (at least 3 characters)');
            isValid = false;
        }
        
        if (!validateMessage(formFields.message.value)) {
            showError('message-error', 'Please enter a message (at least 10 characters)');
            isValid = false;
        }
        
        if (isValid) {
            submitForm(formFields);
        } else {
            console.log('Form validation failed');
        }
    });

    // Real-time validation on blur
    Object.keys(formFields).forEach(fieldName => {
        const field = formFields[fieldName];
        if (field) {
            field.addEventListener('blur', function() {
                validateField(fieldName, this.value);
            });
        }
    });
}

// Form validation functions - ENHANCED
function validateName(name) {
    return name && name.trim().length >= 2;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email && emailRegex.test(email.trim());
}

function validateSubject(subject) {
    return subject && subject.trim().length >= 3;
}

function validateMessage(message) {
    return message && message.trim().length >= 10;
}

function validateField(fieldName, value) {
    const errorId = fieldName + '-error';
    
    switch(fieldName) {
        case 'name':
            if (!validateName(value)) {
                showError(errorId, 'Name must be at least 2 characters long');
            } else {
                hideError(errorId);
            }
            break;
        case 'email':
            if (!validateEmail(value)) {
                showError(errorId, 'Please enter a valid email address');
            } else {
                hideError(errorId);
            }
            break;
        case 'subject':
            if (!validateSubject(value)) {
                showError(errorId, 'Subject must be at least 3 characters long');
            } else {
                hideError(errorId);
            }
            break;
        case 'message':
            if (!validateMessage(value)) {
                showError(errorId, 'Message must be at least 10 characters long');
            } else {
                hideError(errorId);
            }
            break;
    }
}

function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        errorElement.style.display = 'block';
    }
}

function hideError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.remove('show');
        errorElement.style.display = 'none';
    }
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(error => {
        error.classList.remove('show');
        error.style.display = 'none';
    });
}

function submitForm(formFields) {
    // Create form data object
    const formData = {
        name: formFields.name.value,
        email: formFields.email.value,
        subject: formFields.subject.value,
        message: formFields.message.value
    };

    // Show success message
    showFormSubmissionFeedback('Thank you! Your message has been sent successfully. I\'ll get back to you soon!');
    
    // Reset form
    document.getElementById('contact-form').reset();
    
    // Log form data for development
    console.log('Form submitted with data:', formData);
}

function showFormSubmissionFeedback(message) {
    // Remove any existing feedback
    const existingFeedback = document.querySelector('.form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'form-feedback';
    feedback.style.cssText = `
        background: var(--color-success);
        color: white;
        padding: 16px;
        border-radius: 8px;
        margin-top: 16px;
        text-align: center;
        font-weight: 500;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    `;
    feedback.textContent = message;
    
    // Insert feedback after form
    const form = document.getElementById('contact-form');
    if (form && form.parentNode) {
        form.parentNode.insertBefore(feedback, form.nextSibling);
        
        // Trigger animation
        setTimeout(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove feedback after 5 seconds
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.style.opacity = '0';
                feedback.style.transform = 'translateY(-10px)';
                setTimeout(() => feedback.remove(), 300);
            }
        }, 5000);
    }
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!window.IntersectionObserver) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger specific animations for different elements
                if (entry.target.classList.contains('timeline__item')) {
                    animateTimelineItem(entry.target);
                }
                if (entry.target.classList.contains('skill__card')) {
                    animateSkillCard(entry.target);
                }
            }
        });
    }, observerOptions);

    // Add fade-in class to elements to be animated
    const animatedElements = document.querySelectorAll(`
        .about__content,
        .skills__grid,
        .projects__grid,
        .values__grid,
        .achievements__grid,
        .contact__content,
        .hero__content
    `);

    animatedElements.forEach(el => {
        if (el) {
            el.classList.add('fade-in');
            observer.observe(el);
        }
    });

    // Animate cards individually with delay
    const cards = document.querySelectorAll(`
        .highlight__card,
        .skill__card,
        .project__card,
        .value__card,
        .achievement__card
    `);

    cards.forEach((card, index) => {
        if (card) {
            card.classList.add('fade-in');
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        }
    });

    // Timeline items
    const timelineItems = document.querySelectorAll('.timeline__item');
    timelineItems.forEach((item, index) => {
        item.classList.add('slide-in-left');
        item.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(item);
    });
}

// Anime.js 3D animations
function initAnimeAnimations() {
    // Check if anime is available
    if (typeof anime === 'undefined') {
        console.warn('Anime.js not loaded, skipping 3D animations');
        return;
    }

    // Hero title animation
    anime({
        targets: '.hero__title',
        opacity: [0, 1],
        translateY: [50, 0],
        rotateX: [90, 0],
        duration: 1200,
        easing: 'easeOutElastic(1, .6)',
        delay: 300
    });

    // Hero subtitle animation
    anime({
        targets: '.hero__subtitle',
        opacity: [0, 1],
        translateX: [-100, 0],
        rotateY: [90, 0],
        duration: 1000,
        easing: 'easeOutQuart',
        delay: 600
    });

    // Hero tagline animation
    anime({
        targets: '.hero__tagline',
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.8, 1],
        duration: 800,
        easing: 'easeOutCubic',
        delay: 900
    });

    // Hero CTA buttons animation
    anime({
        targets: '.hero__cta .btn',
        opacity: [0, 1],
        translateY: [50, 0],
        rotateZ: [10, 0],
        scale: [0.8, 1],
        duration: 600,
        easing: 'easeOutBounce',
        delay: anime.stagger(100, {start: 1200})
    });

    // Section titles 3D effect
    const sectionTitles = document.querySelectorAll('.section__title');
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [100, 0],
                    rotateX: [90, 0],
                    scale: [0.5, 1],
                    duration: 1000,
                    easing: 'easeOutElastic(1, .8)'
                });
                titleObserver.unobserve(entry.target);
            }
        });
    });

    sectionTitles.forEach(title => {
        title.style.opacity = '0';
        titleObserver.observe(title);
    });

    // 3D card hover effects
    initCard3DEffects();
    
    // Floating shapes animation
    animateFloatingShapes();
}

function initCard3DEffects() {
    if (typeof anime === 'undefined') return;

    const cards = document.querySelectorAll('.project__card, .skill__card, .achievement__card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                rotateX: [0, -10],
                rotateY: [0, 10],
                translateZ: [0, 50],
                scale: [1, 1.05],
                duration: 300,
                easing: 'easeOutQuart'
            });
        });

        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                rotateX: 0,
                rotateY: 0,
                translateZ: 0,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
    });
}

function animateFloatingShapes() {
    if (typeof anime === 'undefined') return;

    const shapes = document.querySelectorAll('.floating-shapes .shape');
    
    shapes.forEach((shape, index) => {
        anime({
            targets: shape,
            translateY: [0, -30, 0],
            translateX: [0, 15, 0],
            rotateZ: [0, 360],
            scale: [1, 1.1, 1],
            duration: 6000 + (index * 1000),
            easing: 'easeInOutSine',
            loop: true,
            delay: index * 1000
        });
    });
}

function animateTimelineItem(item) {
    if (typeof anime === 'undefined') return;

    anime({
        targets: item,
        opacity: [0, 1],
        translateX: [-50, 0],
        rotateY: [45, 0],
        duration: 800,
        easing: 'easeOutQuart'
    });
}

function animateSkillCard(card) {
    if (typeof anime === 'undefined') return;

    anime({
        targets: card,
        opacity: [0, 1],
        translateY: [50, 0],
        rotateX: [90, 0],
        scale: [0.8, 1],
        duration: 600,
        easing: 'easeOutElastic(1, .6)'
    });
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill__bar');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 200);
                
                skillObserver.unobserve(bar);
            }
        });
    });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Floating shapes initialization
function initFloatingShapes() {
    // This function is called to ensure floating shapes are properly initialized
    // The actual animation is handled by CSS and enhanced by Anime.js
    const shapes = document.querySelectorAll('.floating-shapes .shape');
    shapes.forEach(shape => {
        shape.style.willChange = 'transform';
    });
}

// Project button functionality with Rishi's project details - FIXED
function initProjectButtons() {
    const projectButtons = document.querySelectorAll('.project__btn');
    
    projectButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            console.log('Project button clicked:', index);
            
            const card = this.closest('.project__card');
            const projectTitle = card ? card.querySelector('.project__title').textContent : `Project ${index + 1}`;
            
            // Show project modal
            showProjectModal(index, projectTitle);
        });
    });
    
    console.log('Project buttons initialized:', projectButtons.length);
}

function showProjectModal(projectIndex, projectTitle) {
    console.log('Opening modal for project:', projectIndex, projectTitle);
    
    // Rishi's project details data
    const projectDetails = [
        {
            title: "Internet-based Drone Communication System",
            fullDescription: "Developed a robust communication system that enables drone-ground station connection over the internet using 5G technology. The system provides secure, reliable communication for remote drone operations and has been field-tested in challenging environments including Madhya Pradesh mines in collaboration with the Ministry of Coal. This project demonstrates innovative solutions for long-range drone connectivity and control.",
            features: [
                "5G-based remote drone control and monitoring",
                "Secure VPN communication protocols",
                "Real-time data transmission and telemetry",
                "Field-tested in industrial mining environments",
                "Scalable architecture for multiple drone management",
                "Integration with ground control station systems"
            ],
            technologies: ["Python", "VPN", "5G Communication", "IoT", "Networking", "Linux"],
            github: "https://github.com/rishimehta/drone-communication",
            demo: "https://drone-comm-demo.com"
        },
        {
            title: "ABU Robocon Competition Robots",
            fullDescription: "Designed and programmed advanced four-wheel omni-directional robots with unique gripper mechanisms for the ABU Robocon competition. These robots achieved the fastest 'che-yo' performance in India and contributed to India securing 6th rank worldwide at ABU Robocon 2023 in Cambodia. The project won the prestigious Visvesvaraya Award worth ₹1L INR for Best Robot Design and the SMC Corporation Award for Great Technical Skill.",
            features: [
                "Four-wheel omni-directional drive system",
                "Custom-designed unique gripper mechanisms",
                "Semi-autonomous navigation and control",
                "BLDC motor control with CAN communication",
                "IMU-based stabilization and feedback",
                "High-speed precision movement capabilities"
            ],
            technologies: ["Arduino", "STM32", "PID Control", "IMU Sensors", "BLDC Motors", "CAN Protocol"],
            github: "https://github.com/rishimehta/robocon-robots",
            demo: "https://youtu.be/robocon-demo"
        },
        {
            title: "E-yantra Drawing Robot",
            fullDescription: "Created an advanced drawing robot equipped with precision stepper and servo motors that uses inverse kinematics algorithms and OpenCV for real-time image processing and drawing. The robot can convert digital images into physical drawings with high accuracy and secured a top 5 position countrywide in the prestigious E-yantra competition organized by IIT Bombay.",
            features: [
                "Inverse kinematics for precise movement control",
                "Real-time image processing with OpenCV",
                "TCP protocol communication with base station",
                "Stepper and servo motor coordination",
                "Automatic path planning and optimization",
                "High-precision drawing capabilities"
            ],
            technologies: ["OpenCV", "Inverse Kinematics", "TCP Protocol", "Servo Control", "Image Processing", "Python"],
            github: "https://github.com/rishimehta/eyantra-drawing-robot",
            demo: "https://youtu.be/drawing-robot-demo"
        },
        {
            title: "Autonomous Forklift Robot",
            fullDescription: "Developed for Loop Robotics company in Ahmedabad, this industrial autonomous forklift robot features IMU-based straight-line driving algorithms, advanced depth cameras, and LiDAR sensors for precise pallet detection and handling. The system incorporates sophisticated sensor fusion techniques for reliable obstacle avoidance and navigation in warehouse environments.",
            features: [
                "IMU-based navigation and straight-line driving",
                "LiDAR integration for precise pallet detection",
                "Depth camera array for 3D environment mapping",
                "Advanced sensor fusion for obstacle avoidance",
                "Autonomous material handling and sorting",
                "Industrial-grade reliability and safety systems"
            ],
            technologies: ["IMU Sensors", "LiDAR", "Computer Vision", "Sensor Fusion", "Path Planning", "ROS"],
            github: "https://github.com/rishimehta/autonomous-forklift",
            demo: "https://forklift-demo.com"
        }
    ];

    const project = projectDetails[projectIndex] || projectDetails[0];
    
    // Remove any existing modal
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'modal hidden';
    modal.innerHTML = `
        <div class="modal__overlay"></div>
        <div class="modal__content">
            <div class="modal__header">
                <h2 class="modal__title">${project.title}</h2>
                <button class="modal__close" aria-label="Close modal">&times;</button>
            </div>
            <div class="modal__body">
                <p class="modal__description">${project.fullDescription}</p>
                
                <div class="modal__features">
                    <h3>Key Features</h3>
                    <ul>
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="modal__tech">
                    <h3>Technologies Used</h3>
                    <div class="modal__tech-list">
                        ${project.technologies.map(tech => `<span class="tech__tag">${tech}</span>`).join('')}
                    </div>
                </div>
                
                <div class="modal__links">
                    <a href="${project.github}" target="_blank" class="btn btn--outline">
                        <span class="btn__icon">💻</span>
                        View Project Details
                    </a>
                    <a href="${project.demo}" target="_blank" class="btn btn--primary">
                        <span class="btn__icon">🚀</span>
                        Live Demo
                    </a>
                </div>
            </div>
        </div>
    `;

    // Add modal styles if not already present
    if (!document.querySelector('#modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .modal.show {
                opacity: 1;
                visibility: visible;
            }
            
            .modal.hidden {
                opacity: 0;
                visibility: hidden;
            }
            
            .modal__overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(4px);
            }
            
            .modal__content {
                position: relative;
                background: var(--color-surface);
                border-radius: 16px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
                border: 1px solid var(--color-card-border);
            }
            
            .modal.show .modal__content {
                transform: scale(1);
            }
            
            .modal__header {
                padding: 24px;
                border-bottom: 1px solid var(--color-border);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal__title {
                margin: 0;
                color: var(--color-text);
                font-size: var(--font-size-xl);
            }
            
            .modal__close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: var(--color-text-secondary);
                padding: 8px;
                border-radius: 4px;
                transition: background-color 0.2s ease;
            }
            
            .modal__close:hover {
                background: var(--color-secondary);
            }
            
            .modal__body {
                padding: 24px;
            }
            
            .modal__description {
                color: var(--color-text-secondary);
                line-height: 1.6;
                margin-bottom: 24px;
            }
            
            .modal__features h3,
            .modal__tech h3 {
                color: var(--color-text);
                margin-bottom: 12px;
                font-size: var(--font-size-lg);
            }
            
            .modal__features ul {
                color: var(--color-text-secondary);
                line-height: 1.6;
                margin-bottom: 24px;
                padding-left: 20px;
            }
            
            .modal__tech-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 24px;
            }
            
            .modal__links {
                display: flex;
                gap: 16px;
                flex-wrap: wrap;
            }
            
            .btn__icon {
                margin-right: 8px;
            }
            
            @media (max-width: 768px) {
                .modal__content {
                    width: 95%;
                    max-height: 90vh;
                }
                
                .modal__links {
                    flex-direction: column;
                }
                
                .modal__links .btn {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(modalStyles);
    }

    // Add modal to DOM
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.remove('hidden');
        modal.classList.add('show');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Close modal functionality
    const closeModal = () => {
        modal.classList.remove('show');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 300);
    };

    // Event listeners for closing modal
    const closeButton = modal.querySelector('.modal__close');
    const overlay = modal.querySelector('.modal__overlay');
    
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }
    
    // Close on Escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);

    // Animate modal content with Anime.js if available
    if (typeof anime !== 'undefined') {
        setTimeout(() => {
            anime({
                targets: '.modal__content',
                scale: [0.5, 1],
                rotateY: [90, 0],
                opacity: [0, 1],
                duration: 500,
                easing: 'easeOutElastic(1, .6)'
            });
        }, 50);
    }
    
    console.log('Modal created and displayed');
}

// Export functions for potential external use
window.portfolioApp = {
    initNavigation,
    initSmoothScrolling,
    initContactForm,
    initScrollAnimations,
    initProjectButtons,
    initAnimeAnimations,
    initSkillBars,
    initFloatingShapes
};