import { gsap } from 'gsap';

// Ring "eyes" whose pupil (the YZN logo dot) follows the pointer, with the odd blink.
// Hovering an eye floats a soap bubble inside it that pops when the pointer leaves
// (after chandebootcamp.com's "peek" circles).
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
      const dx = cx - (r.left + r.width / 2);
      const dy = cy - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      // Room the pupil can travel inside the iris
      const k = Math.min(r.width * 0.2, dist * 0.25) / dist;
      it.x(dx * k);
      it.y(dy * k);
    });
  };

  if (reduced) return;

  addEventListener('pointermove', (e) => look(e.clientX, e.clientY), { passive: true });
  addEventListener('pointerdown', (e) => look(e.clientX, e.clientY), { passive: true });

  const touch = !matchMedia('(hover: hover)').matches;
  if (touch) {
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

  eyes.forEach((eye) => initBubble(eye, touch));
}

function initBubble(eye: HTMLElement, touch: boolean) {
  const bubble = eye.querySelector<HTMLElement>('[data-bubble]');
  if (!bubble) return;

  const bx = gsap.quickTo(bubble, 'x', { duration: 0.6, ease: 'power3' });
  const by = gsap.quickTo(bubble, 'y', { duration: 0.6, ease: 'power3' });
  let open = false;
  let timer = 0;
  let px = 0;
  let py = 0;

  // Only one size animation may run at a time, or they fight over the same values and twitch
  const stopSize = () => gsap.killTweensOf(bubble, 'scaleX,scaleY,opacity');

  const offset = (cx: number, cy: number) => {
    const r = eye.getBoundingClientRect();
    let dx = cx - (r.left + r.width / 2);
    let dy = cy - (r.top + r.height / 2);
    const max = r.width * 0.22;
    const d = Math.hypot(dx, dy);
    if (d > max) {
      dx = (dx / d) * max;
      dy = (dy / d) * max;
    }
    return [dx, dy];
  };

  const follow = (cx: number, cy: number) => {
    const [dx, dy] = offset(cx, cy);
    bx(dx);
    by(dy);
  };

  const wobble = () => {
    gsap.to(bubble, { scaleX: 1.04, scaleY: 0.97, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  };

  const show = (cx: number, cy: number) => {
    const wasHidden = gsap.getProperty(bubble, 'scaleX') === 0;
    open = true;
    stopSize();
    if (wasHidden) {
      // Born under the pointer, not at the spot where it last popped
      const [dx, dy] = offset(cx, cy);
      bx(dx, dx);
      by(dy, dy);
    } else {
      follow(cx, cy);
    }
    gsap.to(bubble, { opacity: 1, duration: 0.12 });
    gsap.to(bubble, { scaleX: 1, scaleY: 1, duration: 0.8, ease: 'elastic.out(1, 0.6)', onComplete: wobble });
  };

  const pop = () => {
    if (!open) return;
    open = false;
    stopSize();
    const r = bubble.getBoundingClientRect();
    droplets(r.left + r.width / 2, r.top + r.height / 2, r.width / 2);
    gsap.to(bubble, {
      scaleX: 1.25,
      scaleY: 1.25,
      opacity: 0,
      duration: 0.18,
      ease: 'power2.out',
      onComplete: () => {
        gsap.set(bubble, { scaleX: 0, scaleY: 0 });
      },
    });
  };

  if (touch) {
    eye.addEventListener('pointerdown', (e) => {
      if (open) follow(e.clientX, e.clientY);
      else show(e.clientX, e.clientY);
      clearTimeout(timer);
      timer = window.setTimeout(pop, 1600);
    });
    return;
  }

  eye.addEventListener('pointerenter', (e) => {
    px = e.clientX;
    py = e.clientY;
    show(px, py);
  });
  eye.addEventListener('pointermove', (e) => {
    px = e.clientX;
    py = e.clientY;
    if (open) follow(px, py);
  });
  eye.addEventListener('pointerleave', pop);

  // Scrolling moves the eye out from under a still pointer without any pointer event
  addEventListener(
    'scroll',
    () => {
      if (!open) return;
      const r = eye.getBoundingClientRect();
      const inside = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2)) < r.width / 2;
      if (inside) follow(px, py);
      else pop();
    },
    { passive: true },
  );
}

// Tiny droplets flung out when a bubble pops
function droplets(x: number, y: number, radius: number) {
  for (let i = 0; i < 10; i++) {
    const d = document.createElement('span');
    d.className = 'droplet';
    d.setAttribute('aria-hidden', 'true');
    document.body.append(d);
    const a = (i / 10) * Math.PI * 2 + Math.random() * 0.4;
    const sx = x + Math.cos(a) * radius * 0.9;
    const sy = y + Math.sin(a) * radius * 0.9;
    gsap.set(d, { x: sx, y: sy, scale: 0.6 + Math.random() * 0.8 });
    gsap.to(d, {
      x: sx + Math.cos(a) * (30 + Math.random() * 40),
      y: sy + Math.sin(a) * (30 + Math.random() * 40) + 20,
      opacity: 0,
      duration: 0.55 + Math.random() * 0.3,
      ease: 'power2.out',
      onComplete: () => d.remove(),
    });
  }
}
