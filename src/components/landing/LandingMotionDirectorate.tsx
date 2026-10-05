import React, { useEffect } from 'react';

/**
 * LandingMotionDirectorate
 * High-performance, unlocked viewport scroll motion & fluid draw-in / draw-out directorate.
 * Ensures zero locked tiles, full accessibility, zero unwanted progress bars,
 * and fluid 3D hover physics across all alternate cards and feature mockups.
 */
export const LandingMotionDirectorate: React.FC = () => {
  useEffect(() => {
    // 1. IntersectionObserver for fluid, non-blocking scroll draw-in
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.classList.add('motion-in-view');
          el.classList.remove('motion-out-view');
        } else {
          // If scrolled past or above, allow subtle fluid draw-out without hiding content completely
          if (entry.boundingClientRect.top < 0) {
            el.classList.add('motion-out-view');
          } else {
            el.classList.remove('motion-in-view');
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px -6% 0px',
      threshold: [0.05, 0.2, 0.5],
    });

    const observeAll = () => {
      const motionElements = document.querySelectorAll('[data-motion-zigzag], [data-motion-reveal], [data-motion-card]');
      motionElements.forEach((el) => observer.observe(el));
    };

    observeAll();

    // Re-observe when lazy-loaded components mount
    const mutationObserver = new MutationObserver(() => {
      observeAll();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // 2. Interactive 3D Spring Tilt for all hoverable cards and tiles
    const tiltContainers = document.querySelectorAll<HTMLElement>('[data-motion-tilt]');
    const tiltCleanups: Array<() => void> = [];

    tiltContainers.forEach((container) => {
      let isHovered = false;
      let mouseX = 0;
      let mouseY = 0;
      let curTiltX = 0;
      let curTiltY = 0;
      let tiltRaf: number | null = null;

      const renderTilt = () => {
        curTiltX += (mouseX - curTiltX) * 0.15;
        curTiltY += (mouseY - curTiltY) * 0.15;

        if (isHovered) {
          const rotX = -curTiltY * 6;
          const rotY = curTiltX * 6;
          container.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
          tiltRaf = requestAnimationFrame(renderTilt);
        } else {
          curTiltX += (0 - curTiltX) * 0.12;
          curTiltY += (0 - curTiltY) * 0.12;
          const rotX = -curTiltY * 6;
          const rotY = curTiltX * 6;
          container.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1, 1, 1)`;
          if (Math.abs(curTiltX) > 0.01 || Math.abs(curTiltY) > 0.01) {
            tiltRaf = requestAnimationFrame(renderTilt);
          }
        }
      };

      const onEnter = () => {
        isHovered = true;
        if (tiltRaf) cancelAnimationFrame(tiltRaf);
        tiltRaf = requestAnimationFrame(renderTilt);
      };

      const onMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };

      const onLeave = () => {
        isHovered = false;
        mouseX = 0;
        mouseY = 0;
      };

      container.addEventListener('mouseenter', onEnter, { passive: true });
      container.addEventListener('mousemove', onMove, { passive: true });
      container.addEventListener('mouseleave', onLeave, { passive: true });

      tiltCleanups.push(() => {
        container.removeEventListener('mouseenter', onEnter);
        container.removeEventListener('mousemove', onMove);
        container.removeEventListener('mouseleave', onLeave);
        if (tiltRaf) cancelAnimationFrame(tiltRaf);
      });
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      tiltCleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
};
