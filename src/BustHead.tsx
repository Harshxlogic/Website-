import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

/*
  Marble bust, upscaled 4x (public/bust-hd.png).
  - On load the marble assembles itself from drifting particles.
  - The head turns toward the cursor; with no cursor it slowly sways on its own.
  - A soft light follows the cursor (or orbits when idle) and is masked to the marble.
  - Hovering breaks the marble into particles that swirl in 3D, then it re-forms.
  - Scrolling away lifts and tilts it a little (parallax).
*/
const SRC = '/bust-hd.png';
const STEP = 6;        // sampling step in source pixels (source is 4x the old one)
const SC = 1;          // canvas backing scale (source is already high-res)
const K = 4;           // old constants were tuned for a 4x smaller image
const RADIUS = 42 * K;
const FOCAL = 260 * K;

export default function BustHead({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -999, y: -999, over: false });
  const lastMove = useRef(-1e9);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 110, damping: 16, mass: 0.6 };
  const rotY = useSpring(useTransform(mx, [-1, 1], [-24, 24]), spring);
  const rotX = useSpring(useTransform(my, [-1, 1], [14, -14]), spring);
  const shiftX = useSpring(useTransform(mx, [-1, 1], [-14, 14]), spring);

  const { scrollY } = useScroll();
  const lift = useTransform(scrollY, [0, 700], [0, -80]);
  const tilt = useTransform(scrollY, [0, 700], [0, -10]);

  // Cursor tracking + idle sway + light position, one loop.
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const r = wrap.current?.getBoundingClientRect();
      if (!r) return;
      lastMove.current = performance.now();
      const dx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.5);
      const dy = (e.clientY - (r.top + r.height * 0.35)) / (window.innerHeight * 0.5);
      mx.set(Math.max(-1, Math.min(1, dx)));
      my.set(Math.max(-1, Math.min(1, dy)));
    };
    window.addEventListener('mousemove', move);
    let raf = 0;
    let lx = 50, ly = 30;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!reduce && now - lastMove.current > 1800) {
        mx.set(Math.sin(now * 0.00055) * 0.55);
        my.set(Math.cos(now * 0.0004) * 0.2);
      }
      const tx = 50 + mx.get() * 42, ty = 30 + my.get() * 34;
      lx += (tx - lx) * 0.12; ly += (ty - ly) * 0.12;
      const el = light.current;
      if (el) { el.style.setProperty('--lx', lx.toFixed(1) + '%'); el.style.setProperty('--ly', ly.toFixed(1) + '%'); }
    };
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, [mx, my, reduce]);

  // Particle engine.
  useEffect(() => {
    const canvas = cv.current!;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    let raf = 0;
    let dead = false;

    img.onload = () => {
      if (dead) return;
      const W = img.naturalWidth, H = img.naturalHeight;
      canvas.width = W * SC; canvas.height = H * SC;
      const off = document.createElement('canvas');
      off.width = W; off.height = H;
      const o = off.getContext('2d')!;
      o.drawImage(img, 0, 0);
      const data = o.getImageData(0, 0, W, H).data;

      const hx: number[] = [], hy: number[] = [], col: string[] = [];
      for (let y = 0; y < H; y += STEP)
        for (let x = 0; x < W; x += STEP) {
          const i = (y * W + x) * 4;
          if (data[i + 3] > 140) { hx.push(x); hy.push(y); col.push(`rgb(${data[i]},${data[i + 1]},${data[i + 2]})`); }
        }
      const n = hx.length;
      const ox = new Float32Array(n), oy = new Float32Array(n), oz = new Float32Array(n);
      const vx = new Float32Array(n), vy = new Float32Array(n), vz = new Float32Array(n);
      // Start scattered so the marble assembles itself on load.
      if (!reduce) for (let i = 0; i < n; i++) {
        ox[i] = (Math.random() - 0.5) * 1800;
        oy[i] = (Math.random() - 0.5) * 1800 + 500;
        oz[i] = (Math.random() - 0.5) * 900;
      }
      let t = 0, settled = false;

      const idle = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0, canvas.width, canvas.height); };
      if (reduce) idle();

      const frame = () => {
        raf = requestAnimationFrame(frame);
        const m = mouse.current;
        if (settled && !m.over) return;
        t += 1;
        let energy = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < n; i++) {
          if (m.over) {
            const dx = hx[i] - m.x, dy = hy[i] - m.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < RADIUS) {
              const f = 1 - d / RADIUS;
              const a = t * 0.08 + i;
              vx[i] += (-dy * 0.03 + Math.cos(a) * 0.9 * K) * f;
              vy[i] += (dx * 0.03 + Math.sin(a * 1.3) * 0.9 * K) * f;
              vz[i] += Math.sin(a * 0.7) * 5 * K * f;
            }
          }
          vx[i] += -ox[i] * 0.05; vy[i] += -oy[i] * 0.05; vz[i] += -oz[i] * 0.05;
          vx[i] *= 0.9; vy[i] *= 0.9; vz[i] *= 0.9;
          ox[i] += vx[i]; oy[i] += vy[i]; oz[i] += vz[i];
          energy += Math.abs(ox[i]) + Math.abs(oy[i]) + Math.abs(oz[i]);
          const p = FOCAL / (FOCAL - oz[i]);
          const s = (STEP * p + 0.8) * SC;
          ctx.fillStyle = col[i];
          ctx.fillRect((hx[i] + ox[i] * p) * SC, (hy[i] + oy[i] * p) * SC, s, s);
        }
        if (!m.over && energy / n < 0.08 * K) { settled = true; idle(); } else settled = false;
      };
      frame();
    };
    img.src = SRC;
    return () => { dead = true; cancelAnimationFrame(raf); };
  }, [reduce]);

  const track = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = cv.current!;
    const k = (c.width / SC) / c.clientWidth;
    mouse.current = { x: e.nativeEvent.offsetX * k, y: e.nativeEvent.offsetY * k, over: true };
  };

  return (
    <div ref={wrap} className={className} style={{ perspective: 900 }}>
      <motion.div style={{ y: lift, rotate: tilt }}>
        <motion.div
          animate={reduce ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'drop-shadow(0 0 36px rgba(182,0,168,0.30))' }}>
          <motion.div className="relative" style={{ rotateY: rotY, rotateX: rotX, x: shiftX, transformOrigin: '50% 100%', transformStyle: 'preserve-3d' }}>
            <canvas
              ref={cv}
              className="w-full h-auto block"
              aria-label="Marble bust of Alexander the Great that follows the cursor"
              onPointerMove={track}
              onPointerLeave={() => { mouse.current.over = false; }}
            />
            {/* light that follows the cursor, clipped to the marble's silhouette */}
            <div
              ref={light}
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                mixBlendMode: 'soft-light',
                background: 'radial-gradient(circle at var(--lx,50%) var(--ly,30%), rgba(255,244,255,0.95) 0%, rgba(214,120,255,0.55) 22%, rgba(182,0,168,0.0) 58%)',
                WebkitMaskImage: `url(${SRC})`, maskImage: `url(${SRC})`,
                WebkitMaskSize: '100% 100%', maskSize: '100% 100%',
                WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
