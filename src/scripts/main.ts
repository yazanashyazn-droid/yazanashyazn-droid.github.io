import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initPixelFields } from './pixel';
import { initEyes } from './eyes';

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
    // Force a reflow so the transition runs from the closed state (no rAF dependency)
    void menu.offsetWidth;
    menu.classList.add('is-open');
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
// Clicking the dimmed page around the panel closes the menu
menu?.addEventListener('click', (e) => {
  if (e.target === menu) setMenu(false);
});
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
  const coral = '.footer, .menu__link, .pill--accent, .row__link, .portrait__paper, .qa[open] .qa__icon, .side-tab, .bar__menu, .eye--a, .sticker--coral, [data-cursor-dark]';

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

/* ---------- Loader + bento intro ---------- */
const loader = $('[data-loader]');
const bento = $$('[data-bento]');

function intro() {
  if (reduced) return;
  // Cells wipe open one after another, like tiles flipping on
  gsap.from(bento, {
    clipPath: 'inset(100% 0 0 0)',
    duration: 1.1,
    ease: 'expo.out',
    stagger: { each: 0.06, from: 'random' },
  });
  gsap.from('.title__h > span', { yPercent: 100, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.3 });
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

/* ---------- Live Damascus clock in the header ---------- */
const clock = $('[data-clock]');
if (clock) {
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Damascus' });
  const tickClock = () => (clock.textContent = fmt.format(new Date()));
  tickClock();
  setInterval(tickClock, 20_000);
}

/* ---------- Pixel fields and eyes ---------- */
initPixelFields(reduced);
initEyes(reduced);

const hero = $('[data-hero]');

/* ---------- Statement: words light up while scrolling ---------- */
const statement = $('[data-statement]');
if (statement && !reduced) {
  gsap.to($$('.w', statement), {
    opacity: 1,
    stagger: 0.1,
    ease: 'none',
    scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: true },
  });
  // Pills keep their size; only their picture opens from the centre (no line re-wrap)
  gsap.from($$('[data-pill]', statement), {
    clipPath: 'inset(0 50% 0 50% round 999px)',
    ease: 'none',
    stagger: 0.2,
    scrollTrigger: { trigger: statement, start: 'top 75%', end: 'center 45%', scrub: true },
  });
  // Highlighter sweeps behind each key word; the word turns ink only as the bar covers it
  const hlTl = gsap.timeline({
    scrollTrigger: { trigger: statement, start: 'top 60%', end: 'bottom 55%', scrub: true },
  });
  $$('[data-hl]', statement).forEach((hl, i) => {
    const word = hl.nextElementSibling as HTMLElement;
    hlTl
      .from(hl, { scaleX: 0, ease: 'none', duration: 1 }, i * 0.6)
      .fromTo(word, { color: '#f9f0e9' }, { color: '#161616', ease: 'steps(1)', duration: 0.5 }, i * 0.6 + 0.5);
  });
}

/* ---------- Paper stack: pieces fly in and land like paper ---------- */
gsap.matchMedia().add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
  const stack = $('[data-stack]');
  if (!stack) return;
  const pieces = $$('[data-piece]', stack);
  const tl = gsap.timeline({
    scrollTrigger: { trigger: stack, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
  });
  pieces.forEach((pc, i) => {
    const sticker = $('[data-sticker]', pc);
    tl.from(
      pc,
      {
        y: () => innerHeight * 1.1,
        rotationX: 58,
        rotationZ: i % 2 ? 18 : -18,
        skewY: i % 2 ? -6 : 6,
        duration: 1,
        ease: 'power3.out',
      },
      i * 0.7,
    );
    if (sticker) tl.from(sticker, { scale: 0, rotation: -40, duration: 0.35, ease: 'back.out(3)' }, i * 0.7 + 0.75);
  });
});

/* ---------- Rings: grow from the bottom into the cream section ---------- */
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  const sec = $('[data-rings]');
  if (!sec) return;
  const rings = $$('[data-ring]', sec);
  // GSAP takes over `transform` and drops the CSS `translate`, so centre the rings here
  gsap.set(rings, { xPercent: -50, yPercent: -50, scale: 0 });
  const tl = gsap.timeline({
    scrollTrigger: { trigger: sec, start: 'top 20%', end: 'bottom bottom', scrub: 0.6 },
  });
  tl.to(rings, { scale: 1, ease: 'none', stagger: 0.28, duration: 1 }).from(
    $('[data-rings-title]', sec),
    { opacity: 0, y: 60, duration: 0.4 },
    '-=0.35',
  );
});

/* ---------- Bento: columns drift at different speeds while leaving ---------- */
if (hero && !reduced) {
  gsap.to($$('[data-area="c1"], [data-area="pxC"], [data-area="c4"]', hero), {
    yPercent: -18,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
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
}

/* ---------- Phones: paper pieces pop in as they arrive ---------- */
gsap.matchMedia().add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
  $$('[data-piece]').forEach((pc, i) => {
    gsap.from(pc, {
      y: 80,
      rotation: i % 2 ? 10 : -10,
      opacity: 0,
      duration: 0.9,
      ease: 'back.out(1.6)',
      scrollTrigger: { trigger: pc, start: 'top 90%', once: true },
    });
  });
});

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
