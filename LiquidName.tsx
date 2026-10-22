import { useEffect, useRef } from 'react';

export default function LiquidName() {
  const turbulence = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    const node = turbulence.current;
    if (!node) return;
    let frame = 0;
    let last = 0;
    let active = true;
    const animate = (now: number) => {
      if (!active) return;
      if (now - last > 45) {
        const t = now / 1000;
        node.setAttribute('baseFrequency', `${0.006 + Math.sin(t * 0.75) * 0.002} ${0.012 + Math.cos(t * 0.55) * 0.004}`);
        last = now;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => { active = false; cancelAnimationFrame(frame); };
  }, []);

  return (
    <div className="liquid-name" aria-label="Harsh Vardhan Anand">
      <svg viewBox="0 0 1200 330" role="img" aria-labelledby="liquid-name-title" preserveAspectRatio="xMinYMid meet">
        <title id="liquid-name-title">Harsh Vardhan Anand</title>
        <defs>
          <linearGradient id="liquid-ink" x1="0" y1="0" x2="0.08" y2="1">
            <stop offset="0%" stopColor="#747985" />
            <stop offset="52%" stopColor="#D7E2EA" />
            <stop offset="100%" stopColor="#8DA7B8" />
          </linearGradient>
          <filter id="liquid-distortion" x="-8%" y="-15%" width="116%" height="130%" colorInterpolationFilters="sRGB">
            <feTurbulence ref={turbulence} type="fractalNoise" baseFrequency="0.008 0.015" numOctaves="2" seed="8" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="13" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="liquid-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g filter="url(#liquid-distortion)" fill="url(#liquid-ink)" className="liquid-name-type">
          <text x="0" y="132" textLength="1120" lengthAdjust="spacingAndGlyphs">HARSH VARDHAN</text>
          <text x="0" y="292" textLength="760" lengthAdjust="spacingAndGlyphs">ANAND</text>
        </g>
        <g filter="url(#liquid-glow)" fill="none" stroke="#D7E2EA" strokeOpacity=".12" strokeWidth="1" className="liquid-name-outline">
          <text x="0" y="132" textLength="1120" lengthAdjust="spacingAndGlyphs">HARSH VARDHAN</text>
          <text x="0" y="292" textLength="760" lengthAdjust="spacingAndGlyphs">ANAND</text>
        </g>
      </svg>
    </div>
  );
}
