/* ============================================================
   Real Developments Ltd — main.js
   ============================================================ */

/* ── Webhook target (update if Make webhook URL changes) ─────── */
const WEBHOOK_URL = 'https://hook.eu1.make.com/placeholder_webhook';

/* ── Utility: throttle ────────────────────────────────────────── */
function throttle(fn, delay) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= delay) { last = now; fn.apply(this, args); }
  };
}

/* ── 1. Sticky Navigation ─────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  function updateNav() {
    if (window.innerWidth <= 768) {
      nav.classList.remove('transparent');
      nav.classList.add('scrolled');
      return;
    }
    if (window.scrollY > 60) {
      nav.classList.remove('transparent');
      nav.classList.add('scrolled');
    } else {
      nav.classList.add('transparent');
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', throttle(updateNav, 50), { passive: true });
  window.addEventListener('resize', throttle(updateNav, 100), { passive: true });
  updateNav();

  /* Active link highlight */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
})();

/* ── 2. Mobile Burger Menu ────────────────────────────────────── */
(function initBurger() {
  const burger  = document.getElementById('navBurger');
  const mobile  = document.getElementById('navMobile');
  const overlay = document.getElementById('navOverlay');
  if (!burger || !mobile || !overlay) return;

  function open() {
    burger.classList.add('open');
    mobile.classList.add('open');
    overlay.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    burger.classList.remove('open');
    mobile.classList.remove('open');
    overlay.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    burger.classList.contains('open') ? close() : open();
  });

  overlay.addEventListener('click', close);

  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();

/* ── 3. Hero Crossfade Slideshow ──────────────────────────────── */
(function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length < 2) return;

  let current = 0;
  const interval = 5000;

  function next() {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }

  setInterval(next, interval);
})();

/* ── 4. IntersectionObserver — Fade-up animations ─────────────── */
(function initFadeUps() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ── 5. Count-up Animations ───────────────────────────────────── */
(function initCountUp() {
  const counters = document.querySelectorAll('[data-count-up]');
  if (!counters.length) return;

  function animateCount(el, target, suffix) {
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.getAttribute('data-count-up'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        animateCount(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ── 6. Review Tabs ───────────────────────────────────────────── */
(function initTabs() {
  const tabs = document.querySelectorAll('.reviews-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      document.querySelectorAll('.reviews-panel').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const panel = document.getElementById('panel-' + target);
      if (panel) {
        panel.classList.add('active');
        /* Re-trigger fade-up for newly visible cards */
        panel.querySelectorAll('.fade-up:not(.visible)').forEach(el => {
          el.classList.add('visible');
        });
      }
    });
  });
})();

/* ── 7. FAQ Accordion ─────────────────────────────────────────── */
(function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(open => {
        open.classList.remove('open');
      });

      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ── 8. Enquiry Form ──────────────────────────────────────────── */
(function initForm() {
  const form = document.getElementById('enquiryForm');
  if (!form) return;

  const successMsg = document.getElementById('formSuccess');

  /* File upload display */
  const fileInput = document.getElementById('projectImages');
  const fileNames = document.getElementById('fileUploadNames');
  if (fileInput && fileNames) {
    fileInput.addEventListener('change', () => {
      const files = Array.from(fileInput.files);
      fileNames.textContent = files.length
        ? files.map(f => f.name).join(', ')
        : '';
    });
  }

  function showError(field, msg) {
    field.classList.add('error');
    const err = field.parentElement.querySelector('.form-error');
    if (err) { err.textContent = msg; err.classList.add('visible'); }
  }

  function clearError(field) {
    field.classList.remove('error');
    const err = field.parentElement.querySelector('.form-error');
    if (err) err.classList.remove('visible');
  }

  function validateField(field) {
    const val = field.value.trim();
    if (field.required && !val) {
      showError(field, 'This field is required.');
      return false;
    }
    if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      showError(field, 'Please enter a valid email address.');
      return false;
    }
    if (field.name === 'phone' && val && !/^[\d\s\+\-\(\)]{7,20}$/.test(val)) {
      showError(field, 'Please enter a valid phone number.');
      return false;
    }
    clearError(field);
    return true;
  }

  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => clearError(field));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
      if (!validateField(field)) valid = false;
    });

    if (!valid) return;

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    const formData = new FormData(form);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData
      });

      if (res.ok || res.status === 200) {
        form.style.display = 'none';
        if (successMsg) successMsg.classList.add('visible');
      } else {
        throw new Error('Non-OK response: ' + res.status);
      }
    } catch (err) {
      submitBtn.textContent = 'Error — please try again';
      submitBtn.disabled = false;
      console.error('Form submission error:', err);
    }

    /* Restore button after delay on error */
    setTimeout(() => {
      if (submitBtn.disabled) return;
      submitBtn.textContent = originalText;
    }, 4000);
  });
})();

/* ── 9. Content CMS Loader ────────────────────────────────────── */
async function loadContent(jsonPath, dataMap) {
  try {
    const res = await fetch(jsonPath);
    if (!res.ok) return;
    const data = await res.json();

    dataMap.forEach(({ selector, key }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const value = key.split('.').reduce((o, k) => o && o[k], data);
      if (value !== undefined) el.textContent = value;
    });
  } catch (_) {
    /* Content JSON not yet available — static HTML fallback remains */
  }
}

/* Load page-specific content on DOMContentLoaded */
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '') {
    loadContent('/content/homepage.json', [
      { selector: '[data-cms="homepage.heroHeadline"]',  key: 'heroHeadline' },
      { selector: '[data-cms="homepage.heroSubheading"]', key: 'heroSubheading' },
      { selector: '[data-cms="homepage.aboutText"]',     key: 'aboutText' },
      { selector: '[data-cms="homepage.trustBar.item1"]', key: 'trustBar.item1' },
      { selector: '[data-cms="homepage.trustBar.item2"]', key: 'trustBar.item2' },
      { selector: '[data-cms="homepage.trustBar.item3"]', key: 'trustBar.item3' },
      { selector: '[data-cms="homepage.trustBar.item4"]', key: 'trustBar.item4' },
    ]);

    loadContent('/content/global.json', [
      { selector: '[data-cms="global.phone"]', key: 'phone' },
    ]);
  }

  if (page === 'about.html') {
    loadContent('/content/about.json', []);
  }

  if (page === 'gallery.html') {
    loadContent('/content/gallery.json', []);
  }

  if (page === 'contact.html') {
    loadContent('/content/contact.json', []);
  }
});

/* Services dynamic render */
async function renderServices() {
  const grid = document.getElementById('servicesFullGrid');
  if (!grid) return;

  try {
    const res = await fetch('/content/services.json');
    if (!res.ok) return;
    const services = await res.json();

    grid.innerHTML = services.map(s => `
      <article class="service-full-card">
        <div class="service-full-card__img">
          ${s.image
            ? `<img src="${s.image}" alt="${s.title}" loading="lazy">`
            : `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`
          }
        </div>
        <div class="service-full-card__body">
          <h3>${s.title}</h3>
          <p>${s.description}</p>
          ${s.link ? `<a href="${s.link}" class="service-full-card__link">View Service <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>` : ''}
        </div>
      </article>
    `).join('');
  } catch (_) {}
}

/* Gallery dynamic render */
async function renderGallery() {
  const grid = document.getElementById('galleryFullGrid');
  if (!grid) return;

  try {
    const res = await fetch('/content/gallery.json');
    if (!res.ok) return;
    const images = await res.json();

    grid.innerHTML = images.map(img => `
      <div class="gallery-full-item">
        <img src="${img.src}" alt="${img.alt}" loading="lazy">
      </div>
    `).join('');
  } catch (_) {}
}
