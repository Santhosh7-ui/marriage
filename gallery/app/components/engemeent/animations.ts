import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

export function initAnimations() {
  /* ─── 3. CURSOR GLOW ──────────────────────────────────────────── */
  (function initCursor() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;
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
    if (!container) return;
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
    // Removed per user request
  })();

  /* ─── 6. SCROLL-TRIGGERED TEXT REVEALS ───────────────────────── */
  (function initScrollReveals() {
    document.querySelectorAll('.reveal-text[data-split]').forEach((el) => {
      const element = el as HTMLElement;
      const splitType = (element.dataset.split || 'words') as any;
      const split = new SplitType(element, { types: splitType });
      const targets = splitType === 'chars' ? split.chars : split.words;

      if (targets) {
        gsap.set(targets, { opacity: 0, y: 50, filter: 'blur(8px)' });
        ScrollTrigger.create({
          trigger: element,
          start: 'top 82%',
          once: true,
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
      }
    });

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
    // Removed per user request
  })();

  /* ─── 10. COUNTDOWN TIMER ──────────────────────────────────────── */
  (function initCountdown() {
    // Removed per user request
  })();

  /* ─── 11. INVITE SECTION REVEAL ───────────────────────────────── */
  (function initInvite() {
    // Removed per user request
  })();

  /* ─── 12. SECTION-WIDE BACKGROUND PARALLAX ────────────────────── */
  (function initParallax() {
    gsap.utils.toArray('.glow-orb').forEach((orb: any, i) => {
      gsap.to(orb, {
        y: i % 2 === 0 ? -80 : 80,
        scrollTrigger: {
          trigger: '.particle-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        },
      });
    });
  })();

  /* ─── 13. COUNTDOWN SECTION ANIMATE-IN ─────────────────────────── */
  (function initCountdownReveal() {
    // Removed per user request
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

  /* ─── 18. PARTICLE TEXT EFFECT ─────────────────────────────────── */
  (function initParticleText() {
    const canvas = document.getElementById('particleCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let mouse = { x: -9999, y: -9999, radius: 100 };
    let width: number, height: number;

    const colors = ['#50b79e', '#77d4c0', '#d4af37', '#e6c875', '#b39ddb', '#ffffff'];

    class Particle {
      baseX: number;
      baseY: number;
      x: number;
      y: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
      friction: number;
      spring: number;

      constructor(x: number, y: number, isPortrait = false) {
        this.baseX = x;
        this.baseY = y;
        this.x = x + (Math.random() - 0.5) * 80;
        this.y = y + (Math.random() - 0.5) * 80;
        this.size = Math.random() * (isPortrait ? 2.5 : 1.5) + (isPortrait ? 1.2 : 0.6);
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.86 + Math.random() * 0.04;
        this.spring = 0.06 + Math.random() * 0.04;
      }

      triggerEntry() {
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
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // Draw slightly smaller particles for a finer look
        ctx.arc(this.x, this.y, this.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function createText() {
      particles = [];
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      const isPortrait = height > width;
      mouse.radius = isPortrait ? 160 : 100;

      const fontSize = isPortrait
        ? Math.min((width - 150) / 5.5, 160)
        : Math.min(width * 0.09, 110);

      const offCanvas = document.createElement('canvas');
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;
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
      // Use denser particles on mobile (step 1 or 2)
      const step = isPortrait ? 1 : 2;

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

    function triggerEntryAll() {
      particles.forEach(p => p.triggerEntry());
    }

    let animationFrameId: number;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    }

    const trackMouse = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touches = (e as TouchEvent).touches || (e as TouchEvent).changedTouches;
      const clientX = touches && touches.length ? touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = touches && touches.length ? touches[0].clientY : (e as MouseEvent).clientY;
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
    };

    canvas.addEventListener('mousemove', trackMouse as any);
    canvas.addEventListener('touchmove', trackMouse as any, { passive: true });
    canvas.addEventListener('touchstart', trackMouse as any, { passive: true });

    const resetMouse = () => { mouse.x = -9999; mouse.y = -9999; };
    canvas.addEventListener('mouseleave', resetMouse);
    canvas.addEventListener('touchend', resetMouse);

    let resizeTimer: any;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(createText, 200);
    });

    document.fonts.ready.then(() => {
      createText();
      animate();
      setTimeout(triggerEntryAll, 500);
    });

    // Clean up animation on unmount (optional but good practice)
    return () => cancelAnimationFrame(animationFrameId);
  })();

}
