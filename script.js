/* =============================================
   PORTFOLIO — SCRIPT.JS
   Full Logic: Theme, Nav, Scroll Animations,
   Skill Bars, Form Validation
============================================= */

'use strict';

/* ─── DOM REFERENCES ─────────────────────── */
const html = document.documentElement;
const navbar = document.getElementById('navbar');
const themeToggle = document.getElementById('theme-toggle');
const themeToggleM = document.getElementById('theme-toggle-mobile');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const overlay = document.getElementById('overlay');
const mobileLinks = document.querySelectorAll('.mobile-link');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const formReset = document.getElementById('form-reset');
const submitBtn = document.getElementById('submit-btn');
const yearEl = document.getElementById('year');

/* ─── YEAR ───────────────────────────────── */
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =============================================
   THEME SWITCHER
============================================= */
const THEME_KEY = 'portfolio-theme';

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// Load saved preference, fallback to OS preference
(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
})();

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (themeToggleM) themeToggleM.addEventListener('click', toggleTheme);

/* =============================================
   NAVBAR — SCROLL SHADOW
============================================= */
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* =============================================
   ACTIVE NAV LINK HIGHLIGHTING
============================================= */
const sections = document.querySelectorAll('section[id]');

function highlightActiveNavLink() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', highlightActiveNavLink, { passive: true });

/* =============================================
   HAMBURGER / MOBILE MENU
============================================= */
function openMobileMenu() {
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  isOpen ? closeMobileMenu() : openMobileMenu();
});

overlay.addEventListener('click', closeMobileMenu);

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
  });
});

// Close mobile menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeMobileMenu();
  }
});

/* =============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = 72; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* =============================================
   INTERSECTION OBSERVER — REVEAL ANIMATIONS
============================================= */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger cards in grids
        const card = entry.target;
        const siblings = Array.from(card.parentElement.querySelectorAll('.reveal'));
        const cardIndex = siblings.indexOf(card);
        const delay = (cardIndex % 4) * 120; // stagger up to 4 per row
        setTimeout(() => {
          card.classList.add('visible');
        }, delay);
        revealObserver.unobserve(card);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* =============================================
   SKILL BAR ANIMATION
============================================= */
const skillBarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach(fill => {
          const targetWidth = fill.getAttribute('data-width');
          // Short delay so reveal transition plays first
          setTimeout(() => {
            fill.style.width = targetWidth + '%';
            fill.classList.add('animated');
          }, 400);
        });
        skillBarObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.skill-category').forEach(cat => {
  skillBarObserver.observe(cat);
});

/* =============================================
   FORM VALIDATION & SUBMISSION
============================================= */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function getField(id) { return document.getElementById(id); }
function getError(id) { return document.getElementById('err-' + id); }

function showError(fieldId, message) {
  const field = getField('form-' + fieldId);
  const error = getError(fieldId);
  if (field) field.classList.add('error');
  if (error) error.textContent = message;
}

function clearError(fieldId) {
  const field = getField('form-' + fieldId);
  const error = getError(fieldId);
  if (field) field.classList.remove('error');
  if (error) error.textContent = '';
}

function clearAllErrors() {
  ['name', 'email', 'subject', 'message'].forEach(clearError);
}

function validateForm() {
  clearAllErrors();
  let valid = true;

  const name = getField('form-name').value.trim();
  const email = getField('form-email').value.trim();
  const subject = getField('form-subject').value.trim();
  const message = getField('form-message').value.trim();

  if (!name) {
    showError('name', 'Please enter your full name.');
    valid = false;
  } else if (name.length < 2) {
    showError('name', 'Name must be at least 2 characters.');
    valid = false;
  }

  if (!email) {
    showError('email', 'Please enter your email address.');
    valid = false;
  } else if (!EMAIL_REGEX.test(email)) {
    showError('email', 'Please enter a valid email address.');
    valid = false;
  }

  if (!subject) {
    showError('subject', 'Please enter a subject.');
    valid = false;
  } else if (subject.length < 3) {
    showError('subject', 'Subject must be at least 3 characters.');
    valid = false;
  }

  if (!message) {
    showError('message', 'Please write a message.');
    valid = false;
  } else if (message.length < 10) {
    showError('message', 'Message must be at least 10 characters.');
    valid = false;
  }

  return valid;
}

// Live validation: clear error once user corrects a field
['name', 'email', 'subject', 'message'].forEach(fieldId => {
  const el = getField('form-' + fieldId);
  if (el) {
    el.addEventListener('input', () => clearError(fieldId));
    el.addEventListener('blur', () => {
      // Re-validate single field on blur for instant feedback
      const val = el.value.trim();
      if (fieldId === 'name' && val && val.length < 2) {
        showError('name', 'Name must be at least 2 characters.');
      }
      if (fieldId === 'email' && val && !EMAIL_REGEX.test(val)) {
        showError('email', 'Please enter a valid email address.');
      }
    });
  }
});

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // UI — loading state
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    submitBtn.disabled = true;
    btnText.hidden = true;
    btnLoader.hidden = false;

    // Send to Formspree
    let success = false;
    try {
      const response = await fetch('https://formspree.io/f/mgobgvvb', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm),
      });
      success = response.ok;
    } catch (err) {
      success = false;
    }

    // Reset button state
    submitBtn.disabled = false;
    btnText.hidden = false;
    btnLoader.hidden = true;

    const toast = document.getElementById('toast');

    if (success) {
      // Reset form & show success toast
      contactForm.reset();
      clearAllErrors();
      toast.textContent = '✅ Message sent! I\'ll reply within 24h.';
      toast.style.background = '';   // use default success colour from CSS
    } else {
      // Show error toast without resetting form so user keeps their text
      toast.textContent = '❌ Something went wrong. Please try again.';
      toast.style.background = '#e53e3e';
    }

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      toast.textContent = '✅ Message sent!';   // restore default text
      toast.style.background = '';
    }, 3500);
  });
}

if (formReset) {
  formReset.addEventListener('click', () => {
    contactForm.reset();
    clearAllErrors();
    contactForm.hidden = false;
    formSuccess.hidden = true;
  });
}

/* =============================================
   RESUME BUTTON — PLACEHOLDER HANDLER
============================================= */
/* Resume button — linked to Resume.pdf, no handler needed */

/* =============================================
   NAV ACTIVE STYLE (CSS companion)
============================================= */
// Inject active nav link styling dynamically if not in CSS
(function injectActiveNavStyle() {
  const style = document.createElement('style');
  style.textContent = `.nav-link.active { color: var(--accent) !important; background: var(--accent-glow); }`;
  document.head.appendChild(style);
})();

/* =============================================
   PERFORMANCE — PASSIVE SCROLL LISTENERS
   All scroll listeners above use { passive: true }
   No layout-blocking operations on scroll.
============================================= */

console.log('%c Alex Carter | Portfolio', 'color:#6c63ff;font-size:1.2rem;font-weight:800;');
console.log('%c Built with ❤️, HTML, CSS & Vanilla JS', 'color:#8890aa;font-size:0.85rem;');
