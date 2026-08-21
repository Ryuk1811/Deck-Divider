/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Singleton Holographic Pointer Controller
// High-performance, RAF-throttled 3D tilt & glare listeners for silky smooth card hover.

interface CardListeners {
  onEnter: (e: PointerEvent) => void;
  onMove: (e: PointerEvent) => void;
  onLeave: (e: PointerEvent) => void;
}

class HolographicEngine {
  private cards: Map<HTMLElement, CardListeners> = new Map();

  public register(element: HTMLElement) {
    if (!element || this.cards.has(element)) return;

    let initialRect: DOMRect | null = null;
    let pendingRaf: number | null = null;
    let latestEvent: PointerEvent | null = null;

    const applyTransform = () => {
      if (!latestEvent || !element) return;
      if (!initialRect) {
        initialRect = element.getBoundingClientRect();
      }

      const width = initialRect.width || 1;
      const height = initialRect.height || 1;

      // Relative mouse position
      const relX = Math.max(0, Math.min(1, (latestEvent.clientX - initialRect.left) / width));
      const relY = Math.max(0, Math.min(1, (latestEvent.clientY - initialRect.top) / height));

      const normX = (relX - 0.5) * 2; // -1 to 1
      const normY = (relY - 0.5) * 2; // -1 to 1

      // Gentle, luxury max rotation (8deg)
      const rotX = -normY * 8;
      const rotY = normX * 8;

      element.style.setProperty('--rx', `${rotX.toFixed(2)}deg`);
      element.style.setProperty('--ry', `${rotY.toFixed(2)}deg`);
      element.style.setProperty('--glare-x', `${(relX * 100).toFixed(1)}%`);
      element.style.setProperty('--glare-y', `${(relY * 100).toFixed(1)}%`);
      element.style.setProperty('--shimmer-x', `${(relX * 200 - 50).toFixed(1)}%`);

      pendingRaf = null;
    };

    const onEnter = (e: PointerEvent) => {
      initialRect = element.getBoundingClientRect();
      element.style.setProperty('--card-scale', '1.02');
      element.style.setProperty('--card-transition', 'transform 180ms ease-out');
    };

    const onMove = (e: PointerEvent) => {
      latestEvent = e;
      if (!pendingRaf) {
        pendingRaf = requestAnimationFrame(applyTransform);
      }
    };

    const onLeave = () => {
      if (pendingRaf) {
        cancelAnimationFrame(pendingRaf);
        pendingRaf = null;
      }
      latestEvent = null;
      initialRect = null;
      element.style.setProperty('--rx', '0deg');
      element.style.setProperty('--ry', '0deg');
      element.style.setProperty('--glare-x', '50%');
      element.style.setProperty('--glare-y', '50%');
      element.style.setProperty('--card-scale', '1');
      element.style.setProperty('--card-transition', 'transform 240ms ease-out');
    };

    element.addEventListener('pointerenter', onEnter, { passive: true });
    element.addEventListener('pointermove', onMove, { passive: true });
    element.addEventListener('pointerleave', onLeave, { passive: true });

    this.cards.set(element, { onEnter, onMove, onLeave });
  }

  public unregister(element: HTMLElement) {
    if (!element || !this.cards.has(element)) return;

    const listeners = this.cards.get(element);
    if (listeners) {
      element.removeEventListener('pointerenter', listeners.onEnter);
      element.removeEventListener('pointermove', listeners.onMove);
      element.removeEventListener('pointerleave', listeners.onLeave);
    }
    this.cards.delete(element);
  }
}

export const holographicEngine = new HolographicEngine();
