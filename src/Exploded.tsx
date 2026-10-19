import { useRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion, MotionValue } from 'framer-motion';
import Magnet from './Magnet';

/*
  Reusable "Exploded View" assembly (used by Skills, Experience and Projects).
  The stage is pinned (position: sticky) while a tall wrapper scrolls past.
  Scroll progress 0 -> 1 drives these phases:
    0.00-0.14  assembled  : parts sit on the mockup as small icon chips
    0.14-0.46  explode    : parts fly outwards in different directions
    0.56-0.84  re-assemble: parts fly back and lock into a NEW layout (mockup left, grid right)
    0.84-1.00  locked     : small "snap" bump + accent border
  Works for any number of parts (2-6 looks best).
*/

export type Part = { name: string; sub: string; Icon: LucideIcon; href?: string };

const T = [0, 0.14, 0.46, 0.56, 0.84, 0.92, 1];
const ease = (t: number) => t * t * (3 - 2 * t);
function seg(p: number, v: number[]) {
  if (p <= T[0]) return v[0];
  for (let k = 1; k < T.length; k++) {
    if (p <= T[k]) {
      const t = (p - T[k - 1]) / (T[k] - T[k - 1]);
      return v[k - 1] + (v[k] - v[k - 1]) * ease(t);
    }
  }
  return v[v.length - 1];
}
const ROT = [-12, 8, -6, 10, -8, 12];

type Layout = {
  tw: number; th: number;
  tiles: { a: [number, number]; e: [number, number]; f: [number, number] }[];
  mock: { e: number; fx: number; fy: number; fs: number };
};
const cache = new Map<string, Layout>();
function getLayout(n: number): Layout {
  const w = window.innerWidth, h = window.innerHeight;
  const key = `${n}-${w}-${h}`;
  const hit = cache.get(key);
  if (hit) return hit;
  if (cache.size > 12) cache.clear();

  const wide = w >= 900;
  const tw = wide ? 240 : 164, th = wide ? 84 : 72, gap = wide ? 16 : 10;
  const mw = Math.min(w * 0.8, 480), mh = mw * 0.75;
  const rows = Math.ceil(n / 2);
  const lone = (i: number) => n % 2 === 1 && i === n - 1; // last tile alone in its row -> centre it

  // final layout
  let fs: number, fx: number, fy: number;
  const f: [number, number][] = [];
  if (wide) {
    fs = 0.62;
    const mW = mw * fs, gridW = 2 * tw + gap, space = 56, total = mW + space + gridW;
    const left = -total / 2;
    fx = left + mW / 2; fy = 0;
    const gl = left + mW + space;
    for (let i = 0; i < n; i++)
      f.push([lone(i) ? gl + gridW / 2 : gl + tw / 2 + (i % 2) * (tw + gap), (Math.floor(i / 2) - (rows - 1) / 2) * (th + gap)]);
  } else {
    fs = 0.55;
    const mH = mh * fs, gridH = rows * th + (rows - 1) * gap, space = 20, total = mH + space + gridH;
    const top = -total / 2;
    fx = 0; fy = top + mH / 2;
    const gt = top + mH + space;
    for (let i = 0; i < n; i++)
      f.push([lone(i) ? 0 : (i % 2 ? 1 : -1) * (tw + gap) / 2, gt + th / 2 + Math.floor(i / 2) * (th + gap)]);
  }

  // exploded + assembled
  const rx = wide ? Math.min(w * 0.36, 560) : Math.max(40, (w - tw) / 2 - 6);
  const ry = Math.min(h * 0.3, 260);
  const cols = Math.min(3, n), arows = Math.ceil(n / 3);
  const tiles = f.map((fp, i) => {
    const r = ((-90 + ((i + 0.5) * 360) / n) * Math.PI) / 180;
    return {
      a: [((i % 3) - (cols - 1) / 2) * mw * 0.3, (Math.floor(i / 3) - (arows - 1) / 2) * mw * 0.75 * 0.3 + mh * 0.08] as [number, number],
      e: [Math.cos(r) * rx, Math.sin(r) * ry] as [number, number],
      f: fp,
    };
  });
  const L = { tw, th, tiles, mock: { e: 0.82, fx, fy, fs } };
  cache.set(key, L);
  return L;
}

const brand = 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)';

function Tile({ i, n, part, p }: { i: number; n: number; part: Part; p: MotionValue<number> }) {
  const { name, sub, Icon } = part;
  const rot = ROT[i % ROT.length];
  const L = () => getLayout(n);
  const x = useTransform(p, (v) => { const t = L().tiles[i]; return seg(v, [t.a[0], t.a[0], t.e[0], t.e[0], t.f[0], t.f[0], t.f[0]]); });
  const y = useTransform(p, (v) => { const t = L().tiles[i]; return seg(v, [t.a[1], t.a[1], t.e[1], t.e[1], t.f[1], t.f[1], t.f[1]]); });
  const scale = useTransform(p, (v) => seg(v, [0.5, 0.5, 1, 1, 1, 1.07, 1]));
  const rotate = useTransform(p, (v) => seg(v, [0, 0, rot, rot, 0, 0, 0]));
  const width = useTransform(p, (v) => { const l = L(); return seg(v, [l.th, l.th, l.tw, l.tw, l.tw, l.tw, l.tw]); });
  const label = useTransform(p, [0, 0.16, 0.3], [0, 0, 1]);
  const border = useTransform(p, [0.5, 0.84, 0.92], ['rgba(215,226,234,0.35)', 'rgba(215,226,234,0.35)', 'rgba(182,0,168,0.95)']);
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <Magnet padding={55} magnetStrength={6} maxOffset={8} tilt={1} scale={1.015} wrapperClassName="pointer-events-auto">
      <motion.a
        href={part.href || undefined}
        aria-label={part.href ? `Go to ${name}` : undefined}
        tabIndex={part.href ? 0 : -1}
        className={`pointer-events-auto flex items-center gap-2.5 min-[900px]:gap-3 overflow-hidden rounded-2xl border-2 bg-[#0C0C0C] px-3 h-[72px] min-[900px]:h-[84px] ${part.href ? 'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-400 hover:bg-[#17121a]' : 'cursor-default'}`}
        style={{ x, y, scale, rotate, width, borderColor: border, willChange: 'transform' }}>
        <span className="shrink-0 grid place-items-center rounded-xl w-11 h-11 min-[900px]:w-12 min-[900px]:h-12" style={{ background: brand }}>
          <Icon size={22} className="text-white" />
        </span>
        <motion.div className="min-w-0" style={{ opacity: label }}>
          <p className="text-[#D7E2EA] font-medium uppercase leading-tight text-[11px] min-[900px]:text-[15px] whitespace-nowrap">{name}</p>
          <p className="text-[#D7E2EA] font-light opacity-60 leading-tight text-[10px] min-[900px]:text-xs whitespace-nowrap">{sub}</p>
        </motion.div>
      </motion.a>
      </Magnet>
    </div>
  );
}

function Mockup({ n, p, label }: { n: number; p: MotionValue<number>; label: string }) {
  const M = () => getLayout(n).mock;
  const x = useTransform(p, (v) => seg(v, [0, 0, 0, 0, M().fx, M().fx, M().fx]));
  const y = useTransform(p, (v) => seg(v, [0, 0, 0, 0, M().fy, M().fy, M().fy]));
  const scale = useTransform(p, (v) => { const m = M(); return seg(v, [1, 1, m.e, m.e, m.fs, m.fs, m.fs]); });
  // two "layers" behind the frame that fan out while exploded
  const l1x = useTransform(p, (v) => seg(v, [0, 0, -46, -46, 0, 0, 0]));
  const l1y = useTransform(p, (v) => seg(v, [0, 0, -34, -34, 0, 0, 0]));
  const l1r = useTransform(p, (v) => seg(v, [0, 0, -6, -6, 0, 0, 0]));
  const l2x = useTransform(p, (v) => seg(v, [0, 0, 46, 46, 0, 0, 0]));
  const l2y = useTransform(p, (v) => seg(v, [0, 0, 34, 34, 0, 0, 0]));
  const l2r = useTransform(p, (v) => seg(v, [0, 0, 6, 6, 0, 0, 0]));
  const lo = useTransform(p, (v) => seg(v, [0, 0, 0.55, 0.55, 0, 0, 0]));
  const plate = 'absolute inset-0 rounded-[28px] border-2 border-dashed border-[#D7E2EA]/60 bg-[#D7E2EA]/5';
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div className="relative w-[min(80vw,480px)] aspect-[4/3]" style={{ x, y, scale, willChange: 'transform' }}>
        <motion.div className={plate} style={{ x: l1x, y: l1y, rotate: l1r, opacity: lo }} />
        <motion.div className={plate} style={{ x: l2x, y: l2y, rotate: l2r, opacity: lo }} />
        <div className="absolute inset-0 rounded-[28px] border-2 border-[#D7E2EA] bg-[#111216] overflow-hidden">
          <div className="flex items-center gap-1.5 h-9 px-4 border-b border-[#D7E2EA]/20">
            {[0, 1, 2].map((d) => <span key={d} className="w-2.5 h-2.5 rounded-full bg-[#D7E2EA]/40" />)}
            <span className="ml-3 text-[10px] uppercase tracking-widest text-[#D7E2EA]/50">{label}</span>
          </div>
          <div className="grid grid-cols-[28%_1fr] gap-3 p-3 h-[calc(100%-2.25rem)]">
            <div className="flex flex-col gap-2">{[80, 60, 70, 50, 65].map((w, k) => <div key={k} className="h-3 rounded-full bg-[#D7E2EA]/10" style={{ width: `${w}%` }} />)}</div>
            <div className="flex flex-col gap-3">
              <div className="flex-1 rounded-2xl opacity-40" style={{ background: brand }} />
              <div className="grid grid-cols-3 gap-3 h-[28%]">{[0, 1, 2].map((k) => <div key={k} className="rounded-xl bg-[#D7E2EA]/10" />)}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Exploded({
  id, title, parts, captions, mock, height = 380, className = '', style,
}: {
  id?: string; title: string; parts: Part[]; captions: [string, string, string]; mock: string;
  height?: number; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const c1 = useTransform(p, [0, 0.1, 0.16], [1, 1, 0]);
  const c2 = useTransform(p, [0.2, 0.3, 0.5, 0.58], [0, 1, 1, 0]);
  const c3 = useTransform(p, [0.78, 0.88], [0, 1]);
  const caps = [c1, c2, c3];
  const n = parts.length;

  const heading = (cls: string, size: string) => (
    <h2 className={`hero-heading font-black uppercase leading-none tracking-tight text-center ${cls}`} style={{ fontSize: size }}>{title}</h2>
  );

  if (reduce) {
    return (
      <div id={id} className={`px-5 sm:px-8 md:px-10 pt-20 sm:pt-28 pb-20 ${className}`} style={style}>
        {heading('mb-10 md:mb-16', 'clamp(3rem, 12vw, 160px)')}
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {parts.map(({ name, sub, Icon }) => (
            <div key={name} className="flex items-center gap-3 rounded-2xl border-2 border-[#B600A8]/90 px-4 py-4 text-[#D7E2EA]">
              <span className="grid place-items-center rounded-xl w-12 h-12" style={{ background: brand }}><Icon size={22} className="text-white" /></span>
              <div><p className="font-medium uppercase">{name}</p><p className="font-light opacity-60 text-sm">{sub}</p></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id={id} className={className} style={{ overflow: 'clip', ...style }}>
      <div ref={ref} className="relative" style={{ height: `${height}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {heading('absolute top-6 sm:top-8 inset-x-0 pointer-events-none', 'clamp(1.8rem, 4.5vw, 3.2rem)')}
          <Mockup n={n} p={p} label={mock} />
          {parts.map((part, i) => <Tile key={part.name} i={i} n={n} part={part} p={p} />)}
          <div className="absolute bottom-8 sm:bottom-10 inset-x-0 h-6 text-center">
            {captions.map((c, k) => (
              <motion.p key={c} className="absolute inset-x-0 px-4 text-[#D7E2EA] font-light uppercase tracking-widest text-[11px] sm:text-sm" style={{ opacity: caps[k] }}>{c}</motion.p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
