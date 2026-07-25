/**
 * ═══════════════════════════════════════════════════════════════
 *  ENGAGEMENT INVITATION — MAIN.JS
 *  Cinematic Text Experience · GSAP + SplitType + Lenis
 * ═══════════════════════════════════════════════════════════════
 */

/* ─── 1. REGISTER GSAP PLUGINS ────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ─── 2. LENIS SMOOTH SCROLL ──────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,
});

// Sync Lenis with GSAP ticker
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ─── 3. CURSOR GLOW ──────────────────────────────────────────── */
(function initCursor() {
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  gsap.ticker.add(() => {
    gsap.set(glow, { x: mx, y: my });
  });
})();

/* ─── 4. FLOATING PARTICLES ──────────────────────────────────── */
(function initParticles() {
  const container = document.getElementById('particles');
  const count = 28;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random() * 2.5 + 0.8;
    const left = Math.random() * 100;
    const dur = Math.random() * 14 + 9;
    const delay = Math.random() * 20;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      --dur: ${dur}s;
      --delay: ${delay}s;
      opacity: 0;
    `;

    container.appendChild(p);
  }
})();

/* ─── 5. HERO — CINEMATIC TEXT SEQUENCE ───────────────────────── */
(function initHero() {
  /**
   * The hero plays through 5 sequential animated "steps."
   * Each step uses SplitType on key elements and GSAP timelines
   * for letter-by-letter, word-reveal, blur-to-sharp, zoom, and
   * mask animations.
   */
  const steps = document.querySelectorAll('.hero-step');
  const scrollCue = document.getElementById('scrollCue');

  // Total duration for each step on screen (ms → used as GSAP delay)
  const stepDurations = [2200, 2000, 2400, 2200, 0]; // last step stays

  let masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top 60%',
      once: true
    }
  });

  /* ── STEP 1: "Two Souls" — char by char, blur fade in ─────── */
  masterTl.call(() => {
    const el = document.querySelector('#step1 .hero-text');

    // Split into individual characters
    const split = new SplitType(el, { types: 'chars' });
    activateStep(0);

    gsap.from(split.chars, {
      opacity: 0,
      filter: 'blur(12px)',
      y: 30,
      duration: 1.1,
      stagger: 0.08,        // slight delay between each char
      ease: 'power3.out',
    });
  });

  /* ── STEP 2: "One Journey" — word slide up + stagger ──────── */
  masterTl.call(() => {
    deactivateStep(0);

    const el = document.querySelector('#step2 .hero-text');
    const split = new SplitType(el, { types: 'words' });
    activateStep(1);

    gsap.from(split.words, {
      opacity: 0,
      y: 60,
      filter: 'blur(8px)',
      duration: 1.2,
      stagger: 0.20,
      ease: 'expo.out',
    });
  }, [], `+=${stepDurations[0] / 1000}`);

  /* ── STEP 3: "Ankitha ❤️ Dinesh" — zoom to center + glow ─── */
  masterTl.call(() => {
    deactivateStep(1);
    activateStep(2);

    const el = document.getElementById('coupleNames');

    gsap.fromTo(el, {
      opacity: 0,
      scale: 0.55,
      filter: 'blur(20px)',
    }, {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1.6,
      ease: 'expo.out',
    });
  }, [], `+=${stepDurations[1] / 1000}`);

  /* ── STEP 4: "Are Getting Engaged" — mask / clip reveal ──── */
  masterTl.call(() => {
    deactivateStep(2); // Hides step3 aria

    const el = document.querySelector('#step4 .hero-text');
    const split = new SplitType(el, { types: 'words,chars' });
    activateStep(3);

    // Each char wipes up from below (clip mask via y + overflow)
    gsap.from(split.chars, {
      opacity: 0,
      yPercent: 110,
      filter: 'blur(4px)',
      duration: 0.9,
      stagger: {
        each: 0.04,
        from: 'start',
      },
      ease: 'power4.out',
    });
  }, [], `+=${stepDurations[2] / 1000}`);

  /* ── STEP 5: Date — subtle fade in, line expands ─────────── */
  masterTl.call(() => {
    deactivateStep(3);

    const el = document.querySelector('#step5 .date-text');
    const split = new SplitType(el, { types: 'chars' });
    activateStep(4);

    const dateDivider = document.querySelector('.date-divider');
    const locationText = document.querySelector('.location-text');

    gsap.from(split.chars, {
      opacity: 0,
      y: 20,
      filter: 'blur(6px)',
      duration: 1.0,
      stagger: 0.05,
      ease: 'power3.out',
    });

    // Expand the gold line beneath the date
    gsap.to(dateDivider, {
      width: '180px',
      duration: 1.4,
      delay: 0.8,
      ease: 'power3.inOut',
    });

    gsap.from(locationText, {
      opacity: 0,
      y: 14,
      filter: 'blur(4px)',
      duration: 1.0,
      delay: 1.2,
      ease: 'power3.out',
    });

    // Reveal scroll cue
    gsap.to(scrollCue, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 2.0,
      ease: 'power2.out',
    });
  }, [], `+=${stepDurations[3] / 1000}`);

  /* ── Hero SVG line draws ──────────────────────────────────── */
  // Triggered alongside step 1
  masterTl.to('.svg-line', {
    strokeDashoffset: 0,
    opacity: 0.12,
    duration: 2.5,
    stagger: 0.3,
    ease: 'power2.inOut',
  }, 0.3);

  masterTl.to('.svg-circle', {
    strokeDashoffset: 0,
    opacity: 0.07,
    duration: 3.0,
    stagger: 0.5,
    ease: 'power2.inOut',
  }, 0.6);

  // Helpers
  function activateStep(index) {
    steps[index].style.opacity = '1';
    steps[index].style.visibility = 'visible';
    steps[index].classList.add('is-active');
  }

  function deactivateStep(index) {
    gsap.to(steps[index], {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in',
      onComplete: () => {
        steps[index].style.visibility = 'hidden';
        steps[index].classList.remove('is-active');
      }
    });
  }
})();

/* ─── 6. SCROLL-TRIGGERED TEXT REVEALS ───────────────────────── */
(function initScrollReveals() {
  /**
   * All elements with [data-split] get SplitType applied,
   * then GSAP ScrollTrigger animates chars/words as they enter viewport.
   */

  document.querySelectorAll('.reveal-text[data-split]').forEach((el) => {
    const splitType = el.dataset.split; // 'chars' or 'words'
    const split = new SplitType(el, { types: splitType });
    const targets = splitType === 'chars' ? split.chars : split.words;

    // Set initial opacity on split children (parent keeps layout)
    gsap.set(targets, { opacity: 0, y: 50, filter: 'blur(8px)' });

    ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      once: true, // only trigger once
      onEnter: () => {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.1,
          stagger: splitType === 'chars' ? 0.04 : 0.12,
          ease: 'power3.out',
        });
      },
    });
  });

  /* ── Animated width lines ───────────────────────────────── */
  document.querySelectorAll('.reveal-line, .section-line').forEach((line) => {
    ScrollTrigger.create({
      trigger: line,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(line, {
          width: '100%',
          duration: 1.4,
          ease: 'power3.inOut',
        });
      },
    });
  });

  /* ── Story line ─────────────────────────────────────────── */
  document.querySelectorAll('.story-line').forEach((line) => {
    ScrollTrigger.create({
      trigger: line,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(line, { width: '260px', duration: 1.6, ease: 'power3.inOut' });
      },
    });
  });
})();

/* ─── 7. SVG DIVIDER PATH DRAW ────────────────────────────────── */
(function initDividers() {
  document.querySelectorAll('.divider-path').forEach((path) => {
    ScrollTrigger.create({
      trigger: path,
      start: 'top 95%',
      once: true,
      onEnter: () => {
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: 'power2.inOut',
        });
      },
    });
  });
})();

/* ─── 8. HEART SVG PATH DRAW ──────────────────────────────────── */
(function initHeartDraw() {
  const heart = document.getElementById('heartPath');
  if (!heart) return;

  ScrollTrigger.create({
    trigger: heart,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to(heart, {
        strokeDashoffset: 0,
        duration: 2.0,
        ease: 'power3.inOut',
      });
    },
  });
})();

/* ─── 9. TIMELINE SECTION ──────────────────────────────────────── */
(function initTimeline() {
  // Spine grows down
  const spine = document.querySelector('.timeline-spine');

  ScrollTrigger.create({
    trigger: '.timeline',
    start: 'top 70%',
    end: 'bottom 30%',
    scrub: 1.2,
    onUpdate: (self) => {
      gsap.set(spine, {
        scaleY: self.progress,
        transformOrigin: 'top center',
        opacity: self.progress > 0 ? 1 : 0,
      });
    },
  });

  // Timeline items fade + slide in
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    const isLeft = item.classList.contains('timeline-item--left');
    const dot = item.querySelector('.timeline-dot');

    gsap.from(item, {
      opacity: 0,
      x: isLeft ? -60 : 60,
      filter: 'blur(6px)',
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 82%',
        once: true,
      },
    });

    // Dot pops in
    gsap.to(dot, {
      scale: 1,
      duration: 0.5,
      ease: 'back.out(2)',
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        once: true,
      },
    });
  });
})();

/* ─── 10. COUNTDOWN TIMER ──────────────────────────────────────── */
(function initCountdown() {
  // Target: 22 March 2026 00:00:00 IST
  const target = new Date('2026-03-22T00:00:00+05:30').getTime();

  const elDays = document.getElementById('cdDays');
  const elHours = document.getElementById('cdHours');
  const elMinutes = document.getElementById('cdMinutes');
  const elSeconds = document.getElementById('cdSeconds');

  // Smooth number flip using GSAP
  let prev = { d: -1, h: -1, m: -1, s: -1 };

  function flipNumber(el, newVal, padLen) {
    const str = String(newVal).padStart(padLen, '0');
    if (el.textContent === str) return;

    gsap.to(el, {
      opacity: 0,
      y: -12,
      duration: 0.18,
      ease: 'power2.in',
      onComplete: () => {
        el.textContent = str;
        gsap.fromTo(el,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' }
        );
      },
    });
  }

  function tick() {
    const now = Date.now();
    const diff = Math.max(0, target - now);

    if (diff === 0) {
      elDays.textContent = '000';
      elHours.textContent = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    if (d !== prev.d) { flipNumber(elDays, d, 3); prev.d = d; }
    if (h !== prev.h) { flipNumber(elHours, h, 2); prev.h = h; }
    if (m !== prev.m) { flipNumber(elMinutes, m, 2); prev.m = m; }
    if (s !== prev.s) { flipNumber(elSeconds, s, 2); prev.s = s; }
  }

  tick();
  setInterval(tick, 1000);
})();

/* ─── 11. INVITE SECTION REVEAL ───────────────────────────────── */
(function initInvite() {
  const inviteTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.invite-section',
      start: 'top 70%',
      once: true,
    },
  });

  inviteTl
    .from('.invite-sub', {
      opacity: 0, y: 20, duration: 0.8, ease: 'power3.out',
    })
    .from('.invite-title', {
      opacity: 0, y: 40, filter: 'blur(10px)', duration: 1.1, ease: 'power3.out',
    }, '-=0.3')
    .from('.invite-body', {
      opacity: 0, y: 20, duration: 0.9, ease: 'power3.out',
    }, '-=0.5')
    .from('.invite-btn', {
      opacity: 0, scale: 0.88, duration: 0.8, ease: 'back.out(1.5)',
    }, '-=0.3');
})();

/* ─── 12. SECTION-WIDE BACKGROUND PARALLAX ────────────────────── */
(function initParallax() {
  gsap.utils.toArray('.glow-orb').forEach((orb, i) => {
    gsap.to(orb, {
      y: i % 2 === 0 ? -80 : 80,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 2,
      },
    });
  });
})();

/* ─── 13. COUNTDOWN SECTION ANIMATE-IN ─────────────────────────── */
(function initCountdownReveal() {
  gsap.from('.countdown-number', {
    opacity: 0,
    y: 40,
    filter: 'blur(12px)',
    stagger: 0.15,
    duration: 1.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.countdown-section',
      start: 'top 72%',
      once: true,
    },
  });

  gsap.from('.countdown-label', {
    opacity: 0,
    y: 15,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power2.out',
    delay: 0.4,
    scrollTrigger: {
      trigger: '.countdown-section',
      start: 'top 72%',
      once: true,
    },
  });

  gsap.from('.countdown-subtitle', {
    opacity: 0,
    y: 10,
    duration: 0.8,
    ease: 'power2.out',
    delay: 0.8,
    scrollTrigger: {
      trigger: '.countdown-section',
      start: 'top 72%',
      once: true,
    },
  });
})();

/* ─── 14. FOOTER REVEAL ─────────────────────────────────────────── */
(function initFooter() {
  gsap.from('.site-footer > *', {
    opacity: 0,
    y: 20,
    stagger: 0.15,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.site-footer',
      start: 'top 90%',
      once: true,
    },
  });
})();

/* ─── 15. SECTION DECORATIVE SVGS parallax/rotate ─────────────── */
(function initDecorativeSVGs() {
  gsap.to('.svg-circle--outer', {
    rotation: 360,
    transformOrigin: '50% 50%',
    duration: 120,
    ease: 'none',
    repeat: -1
  });

  gsap.to('.bg-mandala', {
    rotation: 90,
    yPercent: 30,
    transformOrigin: '50% 50%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#story1',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  gsap.to('.bg-hourglass', {
    rotation: 180,
    yPercent: -40,
    transformOrigin: '50% 50%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#timeline',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2
    }
  });

  gsap.to('.bg-compass', {
    rotation: -90,
    transformOrigin: '50% 50%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#countdown',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2
    }
  });

  gsap.to('.compass-inner', {
    rotation: 180,
    transformOrigin: '50% 50%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#countdown',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2
    }
  });

  gsap.to('.bg-rings', {
    scale: 1.15,
    yPercent: -15,
    transformOrigin: '50% 50%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#invite',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5
    }
  });
})();

/* ─── 16. RESPONSIVE: refresh ScrollTrigger on resize ─────────── */
(function initResize() {
  let timer;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  });
})();

/* ─── 17. GLOW ON SCROLL FOR MOBILE ───────────────────────────────── */
(function initScrollGlow() {
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  if (isTouch) {
    const glowElements = document.querySelectorAll('.hero-text, .story-quote, .timeline-text, .timeline-year, .countdown-number, .invite-title, .section-title, .word');
    glowElements.forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        end: 'bottom 40%',
        toggleClass: 'is-scrolling-glow'
      });
    });
  }
})();

/* ─── 18. PARTICLE TEXT EFFECT ─────────────────────────────────── */
(function initParticleText() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  let particles = [];
  let mouse = { x: -9999, y: -9999, radius: 100 };
  let width, height;

  // Mixed palette: teal from reference image + gold/lavender from site theme
  const colors = ['#50b79e', '#77d4c0', '#d4af37', '#e6c875', '#b39ddb', '#ffffff'];

  class Particle {
    constructor(x, y, isPortrait = false) {
      this.baseX = x;
      this.baseY = y;

      // Force them to start slightly scattered
      this.x = x + (Math.random() - 0.5) * 80;
      this.y = y + (Math.random() - 0.5) * 80;

      // Make particles larger in portrait to prevent blurriness from browser scaling
      this.size = Math.random() * (isPortrait ? 2.5 : 1.5) + (isPortrait ? 1.2 : 0.6);
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.vx = 0;
      this.vy = 0;
      this.friction = 0.86 + Math.random() * 0.04;
      this.spring = 0.06 + Math.random() * 0.04;
    }

    triggerEntry() {
      // Small randomized fly-in to base position
      gsap.to(this, {
        x: this.baseX,
        y: this.baseY,
        duration: 1.5 + Math.random(),
        ease: 'expo.out',
      });
    }

    update() {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let force = (mouse.radius - distance) / mouse.radius;
        let directionX = forceDirectionX * force * -7;
        let directionY = forceDirectionY * force * -7;

        this.vx += directionX;
        this.vy += directionY;
      }

      this.vx += (this.baseX - this.x) * this.spring;
      this.vy += (this.baseY - this.y) * this.spring;

      this.vx *= this.friction;
      this.vy *= this.friction;

      this.x += this.vx;
      this.y += this.vy;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function createText() {
    particles = [];
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Because the viewport is forced to 1024, width is always >= 1024.
    // We determine mobile layout via orientation (height > width)
    const isPortrait = height > width;

    // Scale up touch radius for portrait mode
    mouse.radius = isPortrait ? 160 : 100;

    // Use a massive font size for portrait so it looks perfect after the device scales it down
    const fontSize = isPortrait
      ? Math.min((width - 150) / 5.5, 160)
      : Math.min(width * 0.09, 110);

    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    offCanvas.width = width;
    offCanvas.height = height;

    offCtx.fillStyle = 'white';
    offCtx.font = `italic 700 ${fontSize}px 'Playfair Display', serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';

    if (isPortrait) {
      offCtx.fillText("Santhosh &", width / 2, height / 2 - fontSize * 0.7);
      offCtx.fillText("💍", width / 2, height / 2 + fontSize * 0.1);
      offCtx.fillText("Ambika", width / 2, height / 2 + fontSize * 0.9);
    } else {
      offCtx.fillText("Santhosh 💍 Ambika", width / 2, height / 2);
    }

    const textCoordinates = offCtx.getImageData(0, 0, width, height);
    const data = textCoordinates.data;

    // Use a much denser step for mobile to eliminate blurriness
    const step = isPortrait ? 2 : 3;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        const alpha = data[index + 3];
        if (alpha > 128) {
          particles.push(new Particle(x, y, isPortrait));
        }
      }
    }
  }

  window.startParticleEntryAnimation = function () {
    particles.forEach(p => p.triggerEntry());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  // Tracking
  const trackMouse = (e) => {
    const rect = canvas.getBoundingClientRect();
    const touches = e.touches || e.changedTouches;
    const clientX = touches && touches.length ? touches[0].clientX : e.clientX;
    const clientY = touches && touches.length ? touches[0].clientY : e.clientY;
    mouse.x = clientX - rect.left;
    mouse.y = clientY - rect.top;
  };

  canvas.addEventListener('mousemove', trackMouse);
  canvas.addEventListener('touchmove', trackMouse, { passive: true });
  canvas.addEventListener('touchstart', trackMouse, { passive: true });

  const resetMouse = () => { mouse.x = -9999; mouse.y = -9999; };
  canvas.addEventListener('mouseleave', resetMouse);
  canvas.addEventListener('touchend', resetMouse);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(createText, 200);
  });

  document.fonts.ready.then(() => {
    createText();
    animate();

    // Start animation immediately
    if (window.startParticleEntryAnimation) {
      setTimeout(window.startParticleEntryAnimation, 500); // 500ms delay to feel intentional
    }
  });
})();
