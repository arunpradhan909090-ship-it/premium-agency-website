// ===== ELEZEX – Premium Interactions =====

// ── Force scroll to top on page reload ──
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});
window.addEventListener('load', () => {
  setTimeout(() => window.scrollTo(0, 0), 10);
});

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll behavior ──
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);

  // Active nav link highlighting based on current clean URL
  const currentPath = window.location.pathname;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Normalize paths to remove trailing slashes for exact matching
    const normCurrent = currentPath.replace(/\/$/, '') || '/';
    const normHref = href.replace(/\/$/, '') || '/';
    
    if (normHref === normCurrent || (normCurrent === '/index' && normHref === '/')) {
      link.classList.add('active');
    }
  });

  // ── Smooth scroll only for in-page anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href === '') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      // Close mobile menu if open
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Mobile menu ──
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-close');

  mobileToggle?.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  mobileClose?.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });

  // ── Scroll reveal animations ──
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Counter animation ──
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.getAttribute('data-count');
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const isNumber = !isNaN(parseFloat(target));

        if (isNumber) {
          const end = parseFloat(target);
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
            const current = Math.floor(eased * end);
            el.textContent = prefix + current + suffix;

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              el.textContent = prefix + target + suffix;
            }
          };
          requestAnimationFrame(animate);
        } else {
          el.textContent = prefix + target + suffix;
        }

        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ── FAQ Accordion ──
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const inner = item.querySelector('.faq-answer-inner');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Open clicked if was closed
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = inner.scrollHeight + 'px';
      }
    });
  });

  // ── Contact Modal Logic ──
  const modal = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const contactForm = document.getElementById('demo-contact-form');
  const successScreen = document.getElementById('modal-success-screen');
  const closeSuccessBtn = document.getElementById('close-success-btn');

  // Select all primary CTA triggers on the page to open contact form modal instantly with NO scrolling
  const ctaButtons = document.querySelectorAll(
    '.btn-primary:not(.submit-btn), .cta-btn, .btn-trigger-modal, [data-open-modal]'
  );

  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Prevent default jump behavior, mailto triggers, or page scrolling
      e.preventDefault();
      e.stopPropagation();
      
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scrolling in place
        
        // Reset form states
        if (contactForm) contactForm.style.display = 'flex';
        if (successScreen) successScreen.style.display = 'none';
        if (contactForm) contactForm.reset();
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scrolling
  };

  closeBtn?.addEventListener('click', closeModal);
  closeSuccessBtn?.addEventListener('click', closeModal);

  // Close when clicking the blurred overlay
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Handle demo request submission
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate submission flow
    contactForm.style.display = 'none';
    successScreen.style.display = 'flex';
  });

  // ── Ensure Hero Background Video plays programmatically ──
  const bgVideo = document.querySelector('.hero-bg-video');
  if (bgVideo) {
    bgVideo.play().catch(() => {
      // Play on first user interaction if autoplay is blocked
      const playVideo = () => {
        bgVideo.play();
        document.removeEventListener('click', playVideo);
        document.removeEventListener('touchstart', playVideo);
      };
      document.addEventListener('click', playVideo);
      document.addEventListener('touchstart', playVideo);
    });
  }



});
