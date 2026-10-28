import { gsap } from 'gsap';

// Ring "eyes" whose pupil (the YZN logo dot) follows the pointer, with the odd blink.
export function initEyes(reduced: boolean) {
  const eyes = Array.from(document.querySelectorAll<HTMLElement>('[data-eye]'));
  if (!eyes.length) return;

  const items = eyes.map((eye) => {
    const pupil = eye.querySelector<HTMLElement>('[data-pupil]')!;
    return {
      eye,
      pupil,
      x: gsap.quickTo(pupil, 'x', { duration: 0.5, ease: 'power3' }),
      y: gsap.quickTo(pupil, 'y', { duration: 0.5, ease: 'power3' }),
    };
  });

  const look = (cx: number, cy: number) => {
    items.forEach((it) => {
      const r = it.eye.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const ex = r.left + r.width / 2;
      const ey = r.top + r.height / 2;
      const dx = cx - ex;
      const dy = cy - ey;
      const dist = Math.hypot(dx, dy) || 1;
      // Room the pupil can travel inside the iris
      const max = r.width * 0.2;
      const k = Math.min(max, dist * 0.25) / dist;
      it.x(dx * k);
      it.y(dy * k);
    });
  };

  if (reduced) return;

  addEventListener('pointermove', (e) => look(e.clientX, e.clientY), { passive: true });
  addEventListener('pointerdown', (e) => look(e.clientX, e.clientY), { passive: true });

  // Touch screens: eyes wander on their own
  if (!matchMedia('(hover: hover)').matches) {
    const wander = () => {
      look(Math.random() * innerWidth, Math.random() * innerHeight);
      setTimeout(wander, 1400 + Math.random() * 1600);
    };
    wander();
  }

  const blink = () => {
    const it = items[Math.floor(Math.random() * items.length)];
    gsap
      .timeline()
      .to(it.pupil, { scaleY: 0.08, duration: 0.09, ease: 'power2.in' })
      .to(it.pupil, { scaleY: 1, duration: 0.16, ease: 'power2.out' });
    setTimeout(blink, 2200 + Math.random() * 3500);
  };
  setTimeout(blink, 2500);
}
