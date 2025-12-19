document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(section => {
        observer.observe(section);
    });

    // Navbar scroll effect
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        }
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scroll Down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scroll Up
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;

        // Scroll to Top Button Logic
        const scrollTopBtn = document.getElementById("scrollTopBtn");
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollTopBtn.style.display = "block";
        } else {
            scrollTopBtn.style.display = "none";
        }
    });

    // Scroll to Top Click
    document.getElementById("scrollTopBtn").addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll(".nav-links a").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
    }));

    // Copy Email Functionality
    const copyEmailBtn = document.getElementById("copyEmailBtn");
    copyEmailBtn.addEventListener("click", () => {
        const email = "shrivastavakhushi419@gmail.com";
        navigator.clipboard.writeText(email).then(() => {
            // Visual feedback
            const originalIcon = copyEmailBtn.innerHTML;
            copyEmailBtn.innerHTML = '<span style="font-size: 0.8rem; color: var(--accent-color);">Copied!</span>';
            setTimeout(() => {
                copyEmailBtn.innerHTML = originalIcon;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });
});
