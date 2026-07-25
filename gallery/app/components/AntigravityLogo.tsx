'use client';

import React, { useEffect, useRef } from 'react';

export default function AntigravityLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false, vx: 0, vy: 0, lastX: 0, lastY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Logical dimensions for the logo canvas
    const logicalWidth = 320;
    const logicalHeight = 64;
    let dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    // Setup canvas resolution for High-DPI screens
    const setupCanvas = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = logicalWidth * dpr;
      canvas.height = logicalHeight * dpr;
      canvas.style.width = `${logicalWidth}px`;
      canvas.style.height = `${logicalHeight}px`;
      ctx.scale(dpr, dpr);
    };

    setupCanvas();

    // Particle definition
    interface Particle {
      x: number;
      y: number;
      originX: number;
      originY: number;
      vx: number;
      vy: number;
      radius: number;
      density: number;
      swayOffset: number;
      swaySpeed: number;
      color: string;
    }

    let particles: Particle[] = [];

    // Render text to offscreen canvas to extract pixels
    const initParticles = () => {
      const offscreen = document.createElement('canvas');
      offscreen.width = logicalWidth;
      offscreen.height = logicalHeight;
      const oCtx = offscreen.getContext('2d');
      if (!oCtx) return;

      // Draw brand text on offscreen canvas
      oCtx.fillStyle = '#ffffff';
      // Use premium serif typography (Georgia / Times New Roman)
      oCtx.font = 'bold 22px Georgia, "Times New Roman", serif';
      oCtx.textBaseline = 'middle';
      oCtx.textAlign = 'left';
      oCtx.letterSpacing = '5px'; // Modern tracking
      
      // Center vertically and leave a bit of margin on the left
      oCtx.fillText('SANTHOSH & AMBIKA', 10, logicalHeight / 2);

      const imgData = oCtx.getImageData(0, 0, logicalWidth, logicalHeight);
      const data = imgData.data;
      particles = [];

      // Scan pixels (step 2 for dense but high-performance display)
      const step = 2;
      for (let y = 0; y < logicalHeight; y += step) {
        for (let x = 0; x < logicalWidth; x += step) {
          const index = (y * logicalWidth + x) * 4;
          const alpha = data[index + 3];

          if (alpha > 128) {
            particles.push({
              x: x,
              y: y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              radius: Math.random() * 0.7 + 0.5, // Tiny crisp circular dots
              density: Math.random() * 20 + 10,
              swayOffset: Math.random() * Math.PI * 2,
              swaySpeed: Math.random() * 0.05 + 0.02,
              color: 'rgba(255, 255, 255, 0.95)'
            });
          }
        }
      }
    };

    initParticles();

    // Mouse movement event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouse = mouseRef.current;
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      mouse.vx = currentX - mouse.lastX;
      mouse.vy = currentY - mouse.lastY;
      mouse.x = currentX;
      mouse.y = currentY;
      mouse.lastX = currentX;
      mouse.lastY = currentY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      const mouse = mouseRef.current;
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // Animation settings
    const hoverRadius = 65; // Proximity threshold
    const springStrength = 0.06;
    const friction = 0.85;
    let time = 0;

    let animationId: number;

    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Calculate distance from particle to mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (mouse.active && dist < hoverRadius) {
          // Antigravity upward lift force
          // The closer the mouse is, the stronger the upward acceleration
          const force = (hoverRadius - dist) / hoverRadius;
          const lift = force * 1.8;

          // Upward force + slight horizontal dispersal
          p.vy -= lift + (Math.abs(mouse.vy) * 0.05);
          p.vx += (dx / dist) * -0.3 + (mouse.vx * 0.03);
          
          // Add a weightless side sway
          p.x += Math.sin(time + p.swayOffset) * 0.15;
        } else {
          // Return to origin state using natural dampening spring formula
          const homeDx = p.originX - p.x;
          const homeDy = p.originY - p.y;

          p.vx += homeDx * springStrength;
          p.vy += homeDy * springStrength;
        }

        // Apply friction/dampening
        p.vx *= friction;
        p.vy *= friction;

        // Update positions
        p.x += p.vx;
        p.y += p.vy;

        // Draw crisp circular dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle screen resize
    const handleResize = () => {
      setupCanvas();
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative select-none cursor-pointer flex items-center justify-start w-[320px] h-[64px]">
      {/* Visual Canvas containing the particle text effect */}
      <canvas ref={canvasRef} className="block pointer-events-none" />

      {/* SEO Friendly visually hidden text */}
      <span className="sr-only">SANTHOSH & AMBIKA</span>
    </div>
  );
}
