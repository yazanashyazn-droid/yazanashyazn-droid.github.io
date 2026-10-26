import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = document) => ctx.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = document) =>
  Array.from(ctx.querySelectorAll<T>(sel));

/* ---------- Smooth scroll ---------- */
let lenis: Lenis | null = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(target: Element | string) {
  if (lenis) lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.4 });
  else (typeof target === 'string' ? $(target) : (target as HTMLElement))?.scrollIntoView();
}

/* ---------- Header: hide on scroll down, menu overlay ---------- */
const header = $('[data-header]');
const menu = $('[data-menu]');
const menuBtn = $<HTMLButtonElement>('[data-menu-toggle]');
const main = $('#main');
let menuOpen = false;

function setMenu(open: boolean) {
  if (!menu || !menuBtn) return;
  menuOpen = open;
  menuBtn.setAttribute('aria-expanded', String(open));
  const label = $('[data-menu-label]', menuBtn);
  if (label) label.textContent = open ? menuBtn.dataset.labelClose! : menuBtn.dataset.labelOpen!;
  if (open) {
    menu.hidden = false;
    menu.setAttribute('data-lenis-prevent', '');
    requestAnimationFrame(() => menu.classList.add('is-open'));
    main?.setAttribute('inert', '');
    lenis?.stop();
    header?.classList.remove('is-hidden');
  } else {
    menu.classList.remove('is-open');
    main?.removeAttribute('inert');
    lenis?.start();
    setTimeout(() => {
      if (!menuOpen) menu.hidden = true;
    }, 700);
  }
}

menuBtn?.addEventListener('click', () => setMenu(!menuOpen));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOpen) {
    setMenu(false);
    menuBtn?.focus();
  }
});

let lastY = 0;
ScrollTrigger.create({
  start: 0,
  end: 'max',
  onUpdate: (self) => {
    const y = self.scroll();
    if (!menuOpen && header) header.classList.toggle('is-hidden', y > 200 && y > lastY);
    lastY = y;
  },
});

/* ---------- In-page anchors (smooth, menu-aware) ---------- */
document.addEventListener('click', (e) => {
  const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link || link.hasAttribute('data-gallery-open')) return;
  const id = link.getAttribute('href')!;
  if (id === '#' || id.startsWith('#work-')) return;
  const target = id === '#top' ? document.body : $(id);
  if (!target) return;
  e.preventDefault();
  if (menuOpen) setMenu(false);
  scrollToTarget(id === '#top' ? 0 as unknown as Element : target);
  if (target instanceof HTMLElement && id !== '#top') {
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
});

/* ---------- Cursor ---------- */
const cursor = $('[data-cursor]');
if (cursor && finePointer) {
  root.classList.add('has-cursor');
  const text = $('[data-cursor-text]', cursor)!;
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
  const interactive = 'a, button, summary, label, [data-cursor-label], input[type="range"]';
  // Surfaces painted in the accent colour, where the coral cursor would disappear
  const coral = '.footer, .menu, .pill--accent, .row__link, .portrait__paper, .qa[open] .qa__icon, [data-cursor-dark]';

  addEventListener('pointermove', (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
    cursor.classList.remove('is-hidden');
  });
  document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
  addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  addEventListener('pointerup', () => cursor.classList.remove('is-down'));

  document.addEventListener('pointerover', (e) => {
    const el = (e.target as Element).closest<HTMLElement>(interactive);
    const label = el?.dataset.cursorLabel;
    cursor.classList.toggle('is-hover', !!el && !label);
    cursor.classList.toggle('is-label', !!label);
    cursor.classList.toggle('is-dark', !!(e.target as Element).closest(coral));
    text.textContent = label ?? '';
  });
}

/* ---------- Loader + hero intro ---------- */
const loader = $('[data-loader]');
const heroWords = $$('[data-hero-word]');
const guides = $$('.guide');
const heroObjs = $$('[data-hero-obj]');
const heroFoot = $$('[data-hero-foot]');

function intro() {
  if (reduced) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from(guides, { scaleX: 0, scaleY: 0, duration: 1.2, stagger: 0.06 }, 0)
    .from(heroWords, { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.15)
    .from(
      heroObjs,
      {
        x: (i) => (i % 2 ? 1 : -1) * 260,
        y: (i) => (i < 2 ? -1 : 1) * 220,
        rotation: (i) => (i % 2 ? 25 : -25),
        opacity: 0,
        duration: 1.6,
        stagger: 0.08,
      },
      0.1,
    )
    .from(heroFoot, { opacity: 0, y: 20, duration: 0.8 }, 0.8);
}

function finishLoading() {
  root.classList.add('loaded');
  intro();
}

if (loader && !reduced && !sessionStorage.getItem('yzn-seen')) {
  const count = $('[data-loader-count]', loader)!;
  const counter = { v: 0 };
  lenis?.stop();
  gsap
    .timeline({
      onComplete: () => {
        sessionStorage.setItem('yzn-seen', '1');
        lenis?.start();
        finishLoading();
      },
    })
    .from($$('.logo-hook, .logo-dot', loader), {
      scale: 0,
      transformOrigin: '50% 50%',
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(2)',
    })
    .to(counter, { v: 100, duration: 1.2, ease: 'power2.inOut', onUpdate: () => (count.textContent = String(Math.round(counter.v))) }, 0)
    .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '+=0.15');
} else {
  finishLoading();
}

/* ---------- Hero: mouse parallax + scroll scatter ---------- */
const hero = $('[data-hero]');
if (hero && !reduced) {
  heroObjs.forEach((obj, i) => {
    const depth = Number(obj.dataset.depth) || 1;
    const dirX = i % 2 ? 1 : -1;
    const dirY = i < 2 ? -1 : 1;
    gsap.to(obj, {
      x: dirX * 320 * depth,
      y: dirY * 260 * depth,
      rotation: dirX * 30 * depth,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    });
  });

  gsap.to('[data-hero-title]', {
    scale: 0.7,
    opacity: 0,
    ease: 'power1.in',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
  });

  if (finePointer) {
    const inner = heroObjs.map((obj) => {
      const img = obj.querySelector('img')!;
      return {
        depth: Number(obj.dataset.depth) || 1,
        x: gsap.quickTo(img, 'x', { duration: 1, ease: 'power3' }),
        y: gsap.quickTo(img, 'y', { duration: 1, ease: 'power3' }),
      };
    });
    hero.addEventListener('pointermove', (e) => {
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      inner.forEach((o) => {
        o.x(nx * 50 * o.depth);
        o.y(ny * 50 * o.depth);
      });
    });
  }
}

/* ---------- Statement: words light up while scrolling ---------- */
const statement = $('[data-statement]');
if (statement && !reduced) {
  gsap.to($$('.w', statement), {
    opacity: 1,
    stagger: 0.1,
    ease: 'none',
    scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: true },
  });
}

/* ---------- Generic reveals + parallax ---------- */
if (!reduced) {
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }),
  });

  $$('[data-parallax]').forEach((el) => {
    const f = Number(el.dataset.parallax);
    gsap.fromTo(
      el,
      { yPercent: -f * 100 },
      { yPercent: f * 100, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });
}

/* ---------- Works: cursor-follow preview ---------- */
const box = $('[data-preview-box]');
const list = $('[data-works]');
if (box && list && finePointer) {
  const imgs = $$('[data-preview-img]', box);
  const xTo = gsap.quickTo(box, 'x', { duration: 0.6, ease: 'power3' });
  const yTo = gsap.quickTo(box, 'y', { duration: 0.6, ease: 'power3' });
  const rTo = gsap.quickTo(box, 'rotation', { duration: 0.8, ease: 'power3' });
  let lastX = 0;

  list.addEventListener('pointermove', (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
    rTo(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.6));
    lastX = e.clientX;
  });
  $$('[data-preview]', list).forEach((row) => {
    row.addEventListener('pointerenter', () => {
      const i = Number(row.dataset.preview);
      imgs.forEach((im, k) => im.classList.toggle('is-active', k === i));
    });
  });
  list.addEventListener('pointerenter', (e) => {
    gsap.set(box, { x: e.clientX, y: e.clientY });
    gsap.to(box, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'expo.out' });
  });
  list.addEventListener('pointerleave', () => gsap.to(box, { autoAlpha: 0, scale: 0.7, duration: 0.3 }));
  gsap.set(box, { scale: 0.7 });
}

/* ---------- Galleries (native <dialog>) ---------- */
let opener: HTMLElement | null = null;

function openGallery(id: string, trigger?: HTMLElement | null) {
  const dialog = $<HTMLDialogElement>(`#work-${CSS.escape(id)}`);
  if (!dialog) return;
  $$<HTMLDialogElement>('dialog[open]').forEach((d) => d.close());
  const tpl = dialog.querySelector<HTMLTemplateElement>('template[data-gallery-items]');
  if (tpl) {
    tpl.replaceWith(tpl.content.cloneNode(true));
    initCompare(dialog);
  }
  if (trigger && !trigger.closest('dialog')) opener = trigger;
  dialog.showModal();
  // A modal dialog renders in the top layer, above the cursor; carry the cursor inside it
  if (cursor) dialog.append(cursor);
  dialog.scrollTop = 0;
  lenis?.stop();
  history.replaceState(null, '', `#work-${id}`);
}

document.addEventListener('click', (e) => {
  const t = (e.target as Element).closest<HTMLElement>('[data-gallery-open]');
  if (!t) return;
  e.preventDefault();
  openGallery(t.dataset.galleryOpen!, t);
});

$$<HTMLDialogElement>('dialog[data-gallery]').forEach((d) => {
  d.addEventListener('close', () => {
    if ($('dialog[open]')) return; // switched to another gallery
    if (cursor) document.body.prepend(cursor);
    lenis?.start();
    history.replaceState(null, '', location.pathname + location.search);
    opener?.focus();
  });
  // Click on the backdrop area closes
  d.addEventListener('click', (e) => {
    if (e.target === d && d.scrollHeight <= d.clientHeight) d.close();
  });
});

const initial = location.hash.match(/^#work-([\w-]+)$/);
if (initial) openGallery(initial[1]);

/* Palette swatches: colour from data, click copies hex */
$$<HTMLButtonElement>('[data-copy]').forEach((btn) => {
  btn.style.setProperty('--c', btn.dataset.copy!);
  const label = btn.querySelector('.tech')!;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy!);
      label.textContent = btn.dataset.copied!;
      setTimeout(() => (label.textContent = btn.dataset.copy!), 1400);
    } catch {
      /* clipboard unavailable — nothing to do */
    }
  });
});

/* Before/after slider (mounted with its gallery) */
function initCompare(ctx: ParentNode) {
  $$('[data-compare]', ctx).forEach((wrap) => {
    const range = $<HTMLInputElement>('input', wrap)!;
    const set = () => wrap.style.setProperty('--pos', `${range.value}%`);
    range.addEventListener('input', set);
    set();
  });
}

/* ---------- Email assembled at runtime ---------- */
$$<HTMLAnchorElement>('[data-email-user]').forEach((a) => {
  const addr = `${a.dataset.emailUser}@${a.dataset.emailDomain}`;
  a.href = `mailto:${addr}`;
  a.textContent = addr;
});

/* ---------- Touch devices: the cursor's counterpart ---------- */
if (!finePointer && !reduced) {
  // Coral ripple wherever the finger lands
  addEventListener(
    'pointerdown',
    (e) => {
      if (e.pointerType === 'mouse') return;
      const dot = document.createElement('span');
      dot.className = 'ripple';
      dot.setAttribute('aria-hidden', 'true');
      document.body.append(dot);
      gsap.set(dot, { x: e.clientX, y: e.clientY });
      gsap.fromTo(
        dot,
        { scale: 0.2, opacity: 0.55 },
        { scale: 1, opacity: 0, duration: 0.6, ease: 'expo.out', onComplete: () => dot.remove() },
      );
    },
    { passive: true },
  );

  // Hero desk objects drift on their own, and follow the phone's tilt where allowed
  const imgs = heroObjs.map((o) => o.querySelector('img')!);
  imgs.forEach((img, i) => {
    gsap.to(img, {
      y: i % 2 ? 14 : -14,
      rotation: i % 2 ? -3 : 3,
      duration: 2.6 + i * 0.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  });
  const needsPermission =
    typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission === 'function';
  if (!needsPermission) {
    const tilt = heroObjs.map((o) => gsap.quickTo(o, 'xPercent', { duration: 1.2, ease: 'power3' }));
    addEventListener('deviceorientation', (e) => {
      if (e.gamma == null) return;
      const g = gsap.utils.clamp(-30, 30, e.gamma) / 30;
      tilt.forEach((to, i) => to(g * (8 + i * 3)));
    });
  }
}

/* ---------- Mobile works deck: covered cards sink back ---------- */
gsap.matchMedia().add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
  const rows = $$('.row');
  rows.slice(0, -1).forEach((row, i) => {
    gsap.to($('.row__link', row), {
      scale: 0.9,
      filter: 'brightness(0.55)',
      ease: 'none',
      scrollTrigger: { trigger: rows[i + 1], start: 'top 70%', end: 'top 15%', scrub: true },
    });
  });
});

/* ---------- Floating WhatsApp button (mobile) ---------- */
const fab = $('[data-fab]');
const footer = $('#contact');
if (fab && hero && footer) {
  const update = () => {
    const pastHero = hero.getBoundingClientRect().bottom < innerHeight * 0.5;
    const atFooter = footer.getBoundingClientRect().top < innerHeight;
    fab.classList.toggle('is-visible', pastHero && !atFooter);
  };
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update });
  update();
}

/* Images loading late can shift trigger positions */
addEventListener('load', () => ScrollTrigger.refresh());
