// The Instagram phone in the social media gallery: real navigation, swipeable carousels,
// likes, and a self-playing tour that stops for good the moment the visitor touches anything.
import gsap from 'gsap';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const tours = new WeakMap<HTMLElement, () => void>();

export function initIg(root: HTMLElement) {
  const phone = root.querySelector<HTMLElement>('[data-ig-phone]')!;
  const scene = root.querySelector<HTMLElement>('[data-ig-scene]')!;
  const tap = root.querySelector<HTMLElement>('[data-ig-tap]')!;
  const views = {
    profile: root.querySelector<HTMLElement>('[data-ig-view="profile"]')!,
    feed: root.querySelector<HTMLElement>('[data-ig-view="feed"]')!,
  };

  const show = (name: 'profile' | 'feed') => {
    views.profile.classList.toggle('is-active', name === 'profile');
    views.feed.classList.toggle('is-active', name === 'feed');
  };

  const postAt = (i: number) => root.querySelector<HTMLElement>(`[data-ig-post="${i}"]`)!;
  const offsetOf = (post: HTMLElement) => post.offsetTop - 38; // under the sticky bar

  const goTo = (i: number) => {
    show('feed');
    views.feed.scrollTop = offsetOf(postAt(i));
  };

  /* Carousels: counter and dots follow the scroll position */
  root.querySelectorAll<HTMLElement>('[data-ig-track]').forEach((track) => {
    const media = track.closest<HTMLElement>('[data-ig-media]')!;
    const post = track.closest<HTMLElement>('[data-ig-post]')!;
    const count = media.querySelector<HTMLElement>('[data-ig-count]');
    if (!count) return;
    const total = track.children.length;
    const dots = post.querySelectorAll('[data-ig-dots] i');
    track.addEventListener(
      'scroll',
      () => {
        const n = Math.round(track.scrollLeft / track.clientWidth);
        count.textContent = `${n + 1}/${total}`;
        dots.forEach((d, k) => d.classList.toggle('is-on', k === n));
      },
      { passive: true },
    );
  });

  const like = (post: HTMLElement, burst: boolean) => {
    const btn = post.querySelector<HTMLElement>('[data-ig-like]')!;
    btn.setAttribute('aria-pressed', 'true');
    if (!burst) return;
    const heart = post.querySelector<SVGElement>('.burst')!;
    heart.classList.remove('is-on');
    void heart.getBoundingClientRect(); // restart the animation
    heart.classList.add('is-on');
  };

  /* ---------- Self-playing tour ---------- */
  let token = 0;
  let touched = false;
  const stopTour = () => {
    touched = true;
    token++;
    gsap.killTweensOf([views.profile, views.feed]);
    root.querySelectorAll('[data-ig-track]').forEach((t) => gsap.killTweensOf(t));
    gsap.set(tap, { opacity: 0 });
  };

  const dialog = root.closest('dialog')!;

  const tour = async () => {
    const me = ++token;
    const alive = () => me === token && dialog.open;
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    const scrollTo = (el: HTMLElement, vars: gsap.TweenVars) =>
      new Promise<void>((r) => gsap.to(el, { ...vars, ease: 'power2.inOut', onComplete: r, onInterrupt: r }));

    const tapOn = async (target: Element) => {
      const a = target.getBoundingClientRect();
      const b = phone.querySelector('.ph__screen')!.getBoundingClientRect();
      // The phone may be tilted a little; this is only a visual hint
      gsap.set(tap, { x: a.left - b.left + a.width / 2, y: a.top - b.top + a.height / 2, scale: 1.5, opacity: 0 });
      await new Promise<void>((r) =>
        gsap
          .timeline({ onComplete: r })
          .to(tap, { opacity: 1, scale: 1, duration: 0.3 })
          .to(tap, { scale: 0.75, duration: 0.12 })
          .to(tap, { opacity: 0, scale: 1.4, duration: 0.3 }),
      );
    };

    while (alive()) {
      show('profile');
      views.profile.scrollTop = 0;
      await wait(1400);
      if (!alive()) return;
      await scrollTo(views.profile, { scrollTop: 240, duration: 1.6 });
      await wait(500);
      if (!alive()) return;
      const first = root.querySelector('[data-ig-tile="0"]');
      if (first) await tapOn(first);
      if (!alive()) return;
      goTo(0);
      await wait(900);

      const posts = root.querySelectorAll<HTMLElement>('[data-ig-post]');
      for (let i = 0; i < posts.length; i++) {
        if (!alive()) return;
        const post = posts[i];
        if (i > 0) await scrollTo(views.feed, { scrollTop: offsetOf(post), duration: 1.3 });
        const track = post.querySelector<HTMLElement>('[data-ig-track]')!;
        if (track.children.length > 1) {
          track.style.scrollSnapType = 'none';
          for (let n = 1; n < track.children.length; n++) {
            await wait(850);
            if (!alive()) return;
            await scrollTo(track, { scrollLeft: n * track.clientWidth, duration: 0.55 });
          }
          track.style.scrollSnapType = '';
        }
        await wait(700);
        if (!alive()) return;
        if (i % 2 === 1) {
          await tapOn(post.querySelector('[data-ig-media]')!);
          like(post, true);
          await wait(800);
        }
      }
      if (!alive()) return;
      await wait(800);
      root.querySelectorAll<HTMLElement>('[data-ig-track]').forEach((t) => (t.scrollLeft = 0));
    }
  };

  const startTour = () => {
    if (touched || reduced() || !dialog.open) return;
    tour();
  };
  tours.set(root, startTour);

  phone.addEventListener('pointerdown', stopTour);
  phone.addEventListener('wheel', stopTour, { passive: true });
  phone.addEventListener('keydown', stopTour);
  scene.querySelectorAll('.float').forEach((f) => f.addEventListener('pointerdown', stopTour));

  /* ---------- Controls ---------- */
  root.addEventListener('click', (e) => {
    const el = e.target as Element;

    const go = el.closest<HTMLElement>('[data-ig-go]');
    if (go) {
      stopTour();
      goTo(Number(go.dataset.igGo));
      if (go.classList.contains('float')) phone.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    const showBtn = el.closest<HTMLElement>('[data-ig-show]');
    if (showBtn) {
      stopTour();
      show(showBtn.dataset.igShow as 'profile' | 'feed');
      return;
    }

    const step = el.closest<HTMLElement>('[data-ig-step]');
    if (step) {
      const track = step.closest('[data-ig-media]')!.querySelector<HTMLElement>('[data-ig-track]')!;
      track.scrollBy({ left: Number(step.dataset.igStep) * track.clientWidth, behavior: 'smooth' });
      return;
    }

    const toggle = el.closest<HTMLElement>('[data-ig-like],[data-ig-save]');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(toggle.getAttribute('aria-pressed') !== 'true'));
    }
  });

  root.addEventListener('dblclick', (e) => {
    const media = (e.target as Element).closest('[data-ig-media]');
    if (media && !(e.target as Element).closest('button')) {
      like(media.closest<HTMLElement>('[data-ig-post]')!, true);
    }
  });

  /* ---------- Depth ---------- */
  if (reduced()) return;

  const floats = scene.querySelectorAll<HTMLElement>('[data-float]');
  gsap.from(phone, { y: 90, rotateX: 18, rotateY: -14, autoAlpha: 0, duration: 1.3, ease: 'expo.out' });
  gsap.from(floats, { y: 80, scale: 0.6, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.07, delay: 0.2 });
  floats.forEach((f, i) => {
    gsap.to(f, {
      y: i % 2 ? 14 : -14,
      duration: 2.6 + (i % 3) * 0.6,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 1.2,
    });
  });

  if (matchMedia('(hover: hover) and (min-width: 1000px)').matches) {
    const depth = scene.querySelectorAll<HTMLElement>('[data-depth]');
    const tiltX = gsap.quickTo(phone, 'rotateX', { duration: 0.8, ease: 'power3.out' });
    const tiltY = gsap.quickTo(phone, 'rotateY', { duration: 0.8, ease: 'power3.out' });
    const movers = [...depth].map((el) => ({
      d: Number(el.dataset.depth),
      x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' }),
    }));
    scene.addEventListener('pointermove', (e) => {
      const r = scene.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      tiltY(nx * 16);
      tiltX(ny * -10);
      movers.forEach((m) => m.x(nx * -m.d));
    });
    scene.addEventListener('pointerleave', () => {
      tiltX(0);
      tiltY(0);
      movers.forEach((m) => m.x(0));
    });
  }
}

/** Called each time a gallery opens, so the tour runs while its dialog is on screen. */
export function resumeIg(dialog: HTMLElement) {
  const root = dialog.querySelector<HTMLElement>('[data-ig]');
  if (!root) return;
  setTimeout(() => tours.get(root)?.(), 900);
}
