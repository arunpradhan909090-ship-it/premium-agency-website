// ===== ELEZEX – Premium Interactions =====

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

  // Active nav link highlighting based on current HTML file page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
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

  // ── Scroll-Triggered Parallax Image Sequence Animation ──
  const sequenceContainer = document.getElementById('scroll-sequence-sec');
  const canvas = document.getElementById('sequence-canvas');
  
  if (sequenceContainer && canvas) {
    const ctx = canvas.getContext('2d');
    const frameCount = 40;
    const images = [];
    const loadedFlags = new Array(frameCount).fill(false);
    let currentFrameIndex = 0;
    
    // Path generator
    const getPrimaryPath = index => 
      `ezgif-58268a66386d7d20-jpg/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;
    const getFallbackPath = index => 
      `assets/ezgif-58268a66386d7d20-jpg/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

    // Draw image like background-size: cover
    function drawImageCover(ctx, img) {
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const canvas = ctx.canvas;
      const imgWidth = img.naturalWidth || img.width;
      const imgHeight = img.naturalHeight || img.height;
      if (!imgWidth || !imgHeight) return;
      
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = imgWidth / imgHeight;
      
      let sWidth = imgWidth;
      let sHeight = imgHeight;
      let sx = 0;
      let sy = 0;
      
      if (canvasRatio > imgRatio) {
        sHeight = imgWidth / canvasRatio;
        sy = (imgHeight - sHeight) / 2;
      } else {
        sWidth = imgHeight * canvasRatio;
        sx = (imgWidth - sWidth) / 2;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
    }
    
    function renderFrame(index) {
      if (loadedFlags[index]) {
        drawImageCover(ctx, images[index]);
        return;
      }
      // Find nearest loaded frame if current target isn't ready yet
      for (let offset = 1; offset < frameCount; offset++) {
        if (index - offset >= 0 && loadedFlags[index - offset]) {
          drawImageCover(ctx, images[index - offset]);
          return;
        }
        if (index + offset < frameCount && loadedFlags[index + offset]) {
          drawImageCover(ctx, images[index + offset]);
          return;
        }
      }
    }
    
    // Preload images with fallbacks
    for (let i = 1; i <= frameCount; i++) {
      const idx = i - 1;
      const img = new Image();
      
      img.onload = () => {
        loadedFlags[idx] = true;
        if (idx === currentFrameIndex || idx === 0) {
          requestAnimationFrame(() => renderFrame(currentFrameIndex));
        }
      };
      
      img.onerror = () => {
        // Fallback to assets directory path if root directory load fails
        if (img.src.indexOf('assets/') === -1) {
          img.src = getFallbackPath(i);
        }
      };
      
      img.src = getPrimaryPath(i);
      images.push(img);
    }
    
    // Canvas sizing
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(currentFrameIndex);
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // initial size
    
    // Scroll progress handler
    let ticking = false;
    function updateSequence() {
      const rect = sequenceContainer.getBoundingClientRect();
      const scrollRange = rect.height - window.innerHeight;
      
      let scrollFraction = 0;
      if (rect.top <= 0) {
        scrollFraction = -rect.top / scrollRange;
      }
      
      // Bound it between 0 and 1
      scrollFraction = Math.min(1, Math.max(0, scrollFraction));
      
      // Map progress to frame index
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
      );
      
      currentFrameIndex = frameIndex;
      renderFrame(currentFrameIndex);
    }
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateSequence();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial render
    setTimeout(updateSequence, 100);
    setTimeout(updateSequence, 500);
  }

});
