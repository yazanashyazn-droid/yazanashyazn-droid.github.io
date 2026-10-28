// A YZN-coloured butterfly that trails the pointer and, when the pointer rests,
// flies off to perch on the nearest [data-perch] element in view.

export function initButterfly(reduced: boolean) {
  const el = document.querySelector<HTMLElement>('[data-butterfly]');
  if (!el) return;
  if (reduced) {
    el.hidden = true;
    return;
  }

  let x = innerWidth * 0.8;
  let y = innerHeight * 0.3;
  let tx = x;
  let ty = y;
  let px = -1;
  let py = -1;
  let lastMove = 0;
  let angle = 0;
  const hasPointer = matchMedia('(hover: hover)').matches;

  addEventListener(
    'pointermove',
    (e) => {
      px = e.clientX;
      py = e.clientY;
      lastMove = performance.now();
    },
    { passive: true },
  );

  const perchTarget = () => {
    let best: DOMRect | null = null;
    let bestD = Infinity;
    document.querySelectorAll<HTMLElement>('[data-perch]').forEach((p) => {
      const r = p.getBoundingClientRect();
      if (r.bottom < 40 || r.top > innerHeight - 40 || r.width === 0) return;
      const d = Math.hypot(r.left + r.width / 2 - x, r.top - y);
      if (d < bestD) {
        bestD = d;
        best = r;
      }
    });
    return best as DOMRect | null;
  };

  let wanderT = 0;
  const tick = (now: number) => {
    const t = now / 1000;
    const idle = !hasPointer || now - lastMove > 1800 || px < 0;
    let perched = false;

    if (!idle) {
      // Trail behind and above the pointer, never on top of it
      tx = px + 70 + Math.sin(t * 1.7) * 30;
      ty = py - 60 + Math.cos(t * 2.3) * 25;
    } else {
      const r = perchTarget();
      if (r) {
        tx = r.left + r.width * 0.72;
        ty = r.top + 6;
        perched = Math.hypot(tx - x, ty - y) < 6;
      } else {
        wanderT += 0.004;
        tx = innerWidth * (0.5 + 0.4 * Math.sin(wanderT * 3));
        ty = innerHeight * (0.35 + 0.25 * Math.sin(wanderT * 5));
      }
    }

    const ease = perched ? 0.2 : 0.045;
    const vx = (tx - x) * ease;
    const vy = (ty - y) * ease;
    x += vx;
    y += vy + (perched ? 0 : Math.sin(t * 9) * 0.9);
    const speed = Math.hypot(vx, vy);
    angle += ((perched ? 0 : Math.max(-35, Math.min(35, vx * 2.2))) - angle) * 0.1;

    el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg)`;
    el.classList.toggle('is-perched', perched);
    el.style.setProperty('--flap', `${Math.max(0.09, 0.24 - speed * 0.02)}s`);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
