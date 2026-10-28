// Animated pixel-tile field (the Chande "mosaic"), drawn on 2D canvas in YZN colours.
// Bands of light drift through the grid and tiles brighten around the pointer.

const PALETTES: Record<string, string[]> = {
  coral: ['#161616', '#3a1a15', '#7c2e22', '#c4402d', '#f96450', '#fba595', '#f9f0e9'],
  blue: ['#161616', '#10303a', '#1b5566', '#22708a', '#3e9aaf', '#9fd0dc', '#f9f0e9'],
  cream: ['#f9f0e9', '#ece7e2', '#d9d2cc', '#f9c2b8', '#f96450', '#c4402d', '#1e1e1e'],
};

interface Field {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  colors: string[];
  tile: number;
  cols: number;
  rows: number;
  seed: number;
  visible: boolean;
  mx: number;
  my: number;
}

export function initPixelFields(reduced: boolean) {
  const fields: Field[] = [];
  const dpr = Math.min(devicePixelRatio || 1, 2);

  const resize = (f: Field) => {
    const r = f.canvas.getBoundingClientRect();
    f.canvas.width = Math.max(1, Math.round(r.width * dpr));
    f.canvas.height = Math.max(1, Math.round(r.height * dpr));
    f.cols = Math.ceil(r.width / f.tile);
    f.rows = Math.ceil(r.height / f.tile);
  };

  const draw = (f: Field, t: number) => {
    const { ctx, colors, tile, cols, rows, seed } = f;
    const s = tile * dpr;
    const gap = Math.max(1, s * 0.12);
    const n = colors.length - 1;
    ctx.clearRect(0, 0, f.canvas.width, f.canvas.height);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // Drifting horizontal bands + slow ripples (cheap pseudo-noise)
        let v =
          0.5 +
          0.32 * Math.sin(y * 0.45 - t * 1.1 + seed) +
          0.18 * Math.sin(x * 0.31 + y * 0.12 + t * 0.6 + seed * 2) +
          0.12 * Math.sin((x - y) * 0.9 + t * 2.3);
        // Pointer glow
        const dx = x - f.mx,
          dy = y - f.my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 64) v += (1 - d2 / 64) * 0.7;
        const i = Math.max(0, Math.min(n, Math.round(v * n)));
        const px = x * s,
          py = y * s;
        ctx.fillStyle = colors[i];
        ctx.fillRect(px + gap / 2, py + gap / 2, s - gap, s - gap);
        // Bevel highlight so tiles read as little keys
        if (i > 1) {
          ctx.fillStyle = 'rgba(255,255,255,0.18)';
          ctx.fillRect(px + gap / 2, py + gap / 2, s - gap, Math.max(1, s * 0.16));
        }
      }
    }
  };

  document.querySelectorAll<HTMLCanvasElement>('canvas[data-pixel]').forEach((canvas, k) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const f: Field = {
      canvas,
      ctx,
      colors: PALETTES[canvas.dataset.pixel!] ?? PALETTES.coral,
      tile: Number(canvas.dataset.tile) || 14,
      cols: 0,
      rows: 0,
      seed: k * 1.7,
      visible: false,
      mx: -99,
      my: -99,
    };
    resize(f);
    fields.push(f);
    canvas.parentElement?.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      f.mx = (e.clientX - r.left) / f.tile;
      f.my = (e.clientY - r.top) / f.tile;
    });
    canvas.parentElement?.addEventListener('pointerleave', () => {
      f.mx = f.my = -99;
    });
  });

  if (!fields.length) return;

  const io = new IntersectionObserver((entries) =>
    entries.forEach((en) => {
      const f = fields.find((x) => x.canvas === en.target);
      if (f) f.visible = en.isIntersecting;
    }),
  );
  fields.forEach((f) => io.observe(f.canvas));

  const ro = new ResizeObserver((entries) =>
    entries.forEach((en) => {
      const f = fields.find((x) => x.canvas === en.target);
      if (f) {
        resize(f);
        draw(f, performance.now() / 1000);
      }
    }),
  );
  fields.forEach((f) => ro.observe(f.canvas));

  if (reduced) {
    fields.forEach((f) => draw(f, 0));
    return;
  }

  let last = 0;
  const loop = (now: number) => {
    // ~30 fps is plenty for the mosaic and halves the work
    if (now - last > 33) {
      last = now;
      const t = now / 1000;
      fields.forEach((f) => f.visible && draw(f, t));
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
