import { ReactNode, CSSProperties, useEffect, useRef } from 'react';

export type MagnetProps = {
  children: ReactNode;
  padding?: number;
  magnetStrength?: number;
  exclusive?: boolean;
  axis?: 'both' | 'x' | 'y';
  maxOffset?: number;
  tilt?: number;
  scale?: number;
  disabled?: boolean;
  wrapperClassName?: string;
  innerClassName?: string;
  style?: CSSProperties;
  onActiveChange?: (active: boolean) => void;
};

/** Lightweight, spring-based magnetic hover wrapper inspired by React Bits Magnet. */
export default function Magnet({
  children,
  padding = 80,
  magnetStrength = 5,
  axis = 'both',
  maxOffset = 12,
  tilt = 2,
  scale = 1.02,
  disabled = false,
  wrapperClassName = '',
  innerClassName = '',
  style,
  onActiveChange,
}: MagnetProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(false);
  const callbackRef = useRef(onActiveChange);
  callbackRef.current = onActiveChange;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduced || disabled) return;

    let raf = 0;
    let last = 0;
    const current = { x: 0, y: 0, rx: 0, ry: 0, scale: 1 };
    const velocity = { x: 0, y: 0, rx: 0, ry: 0, scale: 0 };
    const target = { x: 0, y: 0, rx: 0, ry: 0, scale: 1 };

    const setActive = (value: boolean) => {
      if (activeRef.current === value) return;
      activeRef.current = value;
      if (value) wrapper.setAttribute('data-magnet-active', '');
      else wrapper.removeAttribute('data-magnet-active');
      callbackRef.current?.(value);
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(last ? (now - last) / 1000 : 1 / 60, 1 / 30);
      last = now;
      let resting = true;
      (Object.keys(current) as (keyof typeof current)[]).forEach((key) => {
        const stiffness = 190;
        const damping = 23;
        const force = stiffness * (target[key] - current[key]) - damping * velocity[key];
        velocity[key] += force * dt;
        current[key] += velocity[key] * dt;
        if (Math.abs(target[key] - current[key]) > 0.01 || Math.abs(velocity[key]) > 0.01) resting = false;
      });
      inner.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0) perspective(700px) rotateX(${current.rx.toFixed(2)}deg) rotateY(${current.ry.toFixed(2)}deg) scale(${current.scale.toFixed(4)})`;
      if (resting) {
        (Object.keys(current) as (keyof typeof current)[]).forEach((key) => { current[key] = target[key]; velocity[key] = 0; });
        last = 0;
      } else raf = requestAnimationFrame(tick);
    };

    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const rect = wrapper.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const outside = Math.hypot(Math.max(0, Math.abs(dx) - rect.width / 2), Math.max(0, Math.abs(dy) - rect.height / 2));
      if (outside > padding) {
        target.x = target.y = target.rx = target.ry = 0;
        target.scale = 1;
        setActive(false);
        wake();
        return;
      }
      const t = padding > 0 ? Math.max(0, Math.min(1, 1 - outside / padding)) : 1;
      const pull = t * t * (3 - 2 * t);
      let x = axis === 'y' ? 0 : (dx / Math.max(0.1, magnetStrength)) * pull;
      let y = axis === 'x' ? 0 : (dy / Math.max(0.1, magnetStrength)) * pull;
      const distance = Math.hypot(x, y);
      if (maxOffset != null && distance > maxOffset) { x *= maxOffset / distance; y *= maxOffset / distance; }
      target.x = x;
      target.y = y;
      target.rx = -Math.max(-1, Math.min(1, dy / Math.max(rect.height / 2, 1))) * tilt * pull;
      target.ry = Math.max(-1, Math.min(1, dx / Math.max(rect.width / 2, 1))) * tilt * pull;
      target.scale = 1 + (scale - 1) * pull;
      setActive(true);
      wake();
    };
    const reset = () => {
      target.x = target.y = target.rx = target.ry = 0;
      target.scale = 1;
      setActive(false);
      wake();
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('blur', reset);
    wrapper.addEventListener('pointerleave', reset);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('blur', reset);
      wrapper.removeEventListener('pointerleave', reset);
      cancelAnimationFrame(raf);
    };
  }, [padding, magnetStrength, axis, maxOffset, tilt, scale, disabled]);

  return <span ref={wrapperRef} className={wrapperClassName} style={{ position: 'relative', display: 'inline-flex', verticalAlign: 'middle', ...style }}>
    <span ref={innerRef} className={innerClassName} style={{ display: 'inline-flex', transform: 'translate3d(0,0,0)', willChange: 'transform' }}>{children}</span>
  </span>;
}
