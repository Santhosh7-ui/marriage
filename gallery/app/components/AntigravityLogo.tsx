'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './AntigravityLogo.module.scss';

export default function AntigravityLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const text = "SANTHOSH & AMBIKA";

  // Physics state for each letter
  const [states, setStates] = useState(() => 
    text.split('').map(() => ({
      currentY: -120, // Start high off-screen
      targetY: -120,
      vy: 0,
      currentScaleY: 1,
      targetScaleY: 1,
      vScale: 0,
      currentSkewX: 0,
      targetSkewX: 0,
      vSkew: 0,
      currentGlow: 0,
      targetGlow: 0,
      vGlow: 0,
      opacity: 0,
      hasStarted: false
    }))
  );

  useEffect(() => {
    let animationFrameId: number;
    const mouse = { x: -1000, y: -1000, active: false };
    let frameCount = 0;

    // Update mouse position relative to container
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    const spring = 0.08;
    const dampening = 0.72;
    const maxDist = 90; // Proximity threshold
    const staggerFrames = 4; // Frames between each letter's descent

    const animate = () => {
      frameCount++;
      setStates((prevStates) => {
        const nextStates = [...prevStates];
        const container = containerRef.current;
        if (!container) return prevStates;

        const containerRect = container.getBoundingClientRect();

        for (let i = 0; i < text.length; i++) {
          const span = lettersRef.current[i];
          if (!span) continue;

          const state = { ...nextStates[i] };

          // Staggered trigger to start falling from top
          if (!state.hasStarted && frameCount > i * staggerFrames) {
            state.hasStarted = true;
            state.targetY = 0;
          }

          let targetY = state.hasStarted ? 0 : -120;
          let targetScaleY = 1;
          let targetSkewX = 0;
          let targetGlow = 0;

          if (state.hasStarted) {
            // Fade in the letter
            state.opacity = Math.min(1, state.opacity + 0.06);

            // Find center position of the letter span relative to container
            const spanRect = span.getBoundingClientRect();
            const letterX = (spanRect.left + spanRect.width / 2) - containerRect.left;
            const letterY = (spanRect.top + spanRect.height / 2) - containerRect.top;

            const dx = mouse.x - letterX;
            const dy = mouse.y - letterY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (mouse.active && dist < maxDist) {
              const factor = (maxDist - dist) / maxDist; // 0 to 1

              // Stretch vertically: pull up and scale Y
              targetScaleY = 1 + factor * 0.75;
              
              // Wobble skew based on horizontal offset relative to cursor
              targetSkewX = (dx / dist) * factor * -35;

              // Stretchy bounce offset
              targetY = (dy / dist) * factor * -18;

              // Glow intensity
              targetGlow = factor;
            }
          }

          // Spring physics: Y offset
          const forceY = (targetY - state.currentY) * spring;
          state.vy = (state.vy + forceY) * dampening;
          state.currentY += state.vy;

          // Spring physics: Scale Y
          const forceScale = (targetScaleY - state.currentScaleY) * spring;
          state.vScale = (state.vScale + forceScale) * dampening;
          state.currentScaleY += state.vScale;

          // Spring physics: Skew X
          const forceSkew = (targetSkewX - state.currentSkewX) * spring;
          state.vSkew = (state.vSkew + forceSkew) * dampening;
          state.currentSkewX += state.vSkew;

          // Spring physics: Glow
          const forceGlow = (targetGlow - state.currentGlow) * spring;
          state.vGlow = (state.vGlow + forceGlow) * dampening;
          state.currentGlow += state.vGlow;

          nextStates[i] = state;
        }

        return nextStates;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ perspective: '800px' }}
    >
      <h1 className={styles.srOnly}>SANTHOSH &amp; AMBIKA</h1>
      <div className={styles.letterRow}>
        {text.split('').map((char, index) => {
          const state = states[index] || { currentY: -120, currentScaleY: 1, currentSkewX: 0, currentGlow: 0, opacity: 0 };
          const isSpace = char === ' ';

          // Gold color interpolation based on proximity glow
          const r = Math.round(255 - (255 - 212) * state.currentGlow);
          const g = Math.round(255 - (255 - 175) * state.currentGlow);
          const b = Math.round(255 - (255 - 55) * state.currentGlow);

          return (
            <span
              key={index}
              ref={(el) => {
                lettersRef.current[index] = el;
              }}
              style={{
                display: 'inline-block',
                whiteSpace: 'pre',
                opacity: state.opacity,
                transform: `translateY(${state.currentY}px) scaleY(${state.currentScaleY}) skewX(${state.currentSkewX}deg)`,
                transformOrigin: 'bottom center',
                color: `rgb(${r}, ${g}, ${b})`,
                textShadow: state.currentGlow > 0.05 
                  ? `0 0 ${state.currentGlow * 15}px rgba(212, 175, 55, ${state.currentGlow * 0.9})` 
                  : 'none',
                paddingRight: isSpace ? '0.4em' : '2px',
                pointerEvents: 'none'
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}
