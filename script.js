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

    // Active nav link
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── Smooth scroll for nav links ──
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      // Do not perform scroll if link is a modal popup trigger or contact demo button
      if (link.matches('.btn-primary, .cta-btn, .nav-cta a') || href === '#contact') {
        return;
      }

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
    mobileMenu?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  mobileClose?.addEventListener('click', () => {
    mobileMenu?.classList.remove('open');
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

    question?.addEventListener('click', () => {
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

  // Select all primary CTA triggers on the page
  const ctaButtons = document.querySelectorAll(
    '.btn-primary:not(.submit-btn), .cta-btn, .nav-cta a, a[href="#contact"], .open-demo-btn'
  );

  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Prevent default scroll or jump behavior
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

      // Close mobile menu if open
      mobileMenu?.classList.remove('open');
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
    let loadedCount = 0;
    let currentFrameIndex = 0;
    
    // Path generator
    const getFramePath = index => 
      `ezgif-58268a66386d7d20-jpg/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;
      
    // Preload images
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          // Initial draw when all images loaded
          requestAnimationFrame(() => renderFrame(0));
        }
      };
      images.push(img);
    }
    
    // Draw image like background-size: cover
    function drawImageCover(ctx, img) {
      const canvas = ctx.canvas;
      const imgWidth = img.naturalWidth || img.width;
      const imgHeight = img.naturalHeight || img.height;
      
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
      if (images[index] && loadedCount > 0) {
        drawImageCover(ctx, images[index]);
      }
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
      
      if (frameIndex !== currentFrameIndex) {
        currentFrameIndex = frameIndex;
        renderFrame(currentFrameIndex);
      }
    }
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateSequence();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

});
