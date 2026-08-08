document.addEventListener('DOMContentLoaded', () => {

  // =====================
  // TYPING EFFECT
  // =====================
  const typingEl = document.querySelector('.typing-text');
  const words = [
    'Software Developer',
    'Backend Engineer',
    'Computer Vision Dev',
    'AI Tools Enthusiast',
    'Problem Solver'
  ];
  let wi = 0, ci = 0, deleting = false, speed = 100;

  function type() {
    const word = words[wi];
    if (deleting) {
      typingEl.textContent = word.substring(0, ci - 1);
      ci--;
      speed = 45;
    } else {
      typingEl.textContent = word.substring(0, ci + 1);
      ci++;
      speed = 100;
    }
    if (!deleting && ci === word.length) { deleting = true; speed = 2200; }
    else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; speed = 450; }
    setTimeout(type, speed);
  }
  if (typingEl) setTimeout(type, 600);

  // =====================
  // SCROLL REVEAL
  // =====================
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));

  // =====================
  // HEADER SCROLL
  // =====================
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    if (scrollTopBtn) {
      scrollTopBtn.style.display = window.scrollY > 500 ? 'flex' : 'none';
    }
  }, { passive: true });

  // =====================
  // SCROLL TO TOP
  // =====================
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =====================
  // MOBILE MENU
  // =====================
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // =====================
  // THEME TOGGLE
  // =====================
  const themeBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) document.body.setAttribute('data-theme', savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isLight = document.body.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // =====================
  // SMOOTH ANCHOR SCROLL
  // =====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // =====================
  // PROJECT CARD 3D TILT
  // =====================
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6;
      const rotY = ((x - cx) / cx) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // =====================
  // ACTIVE NAV HIGHLIGHT
  // =====================
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--accent-1)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

});
