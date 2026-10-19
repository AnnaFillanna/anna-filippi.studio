import { useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import styles from './AnimatedLetters.module.scss';

type Dot = { x: number; y: number; fromX: number; fromY: number; delay: number };

export default function ParticleText({ text }: { text: string }) {
  const source = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const play = useRef<() => void>(() => {});
  const reduced = useReducedMotion();
  const [assembling, setAssembling] = useState(!reduced);

  useLayoutEffect(() => {
    const label = source.current;
    const surface = canvas.current;
    if (!label || !surface || reduced) { setAssembling(false); return; }
    let alive = true;
    let frame = 0;
    let playing = false;
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    const context = surface.getContext('2d');
    if (!context) { setAssembling(false); return; }

    const measure = () => {
      const bounds = label.getBoundingClientRect();
      width = bounds.width; height = bounds.height;
      if (!width || !height || !label.firstChild) return false;
      const font = getComputedStyle(label);
      const mask = document.createElement('canvas');
      mask.width = Math.ceil(width * 2); mask.height = Math.ceil(height * 2);
      const ink = mask.getContext('2d', { willReadFrequently: true });
      if (!ink) return false;
      ink.scale(2, 2);
      ink.font = `${font.fontStyle} ${font.fontWeight} ${font.fontSize} ${font.fontFamily}`;
      ink.fillStyle = '#000';
      const metrics = ink.measureText(text);
      const ascent = metrics.fontBoundingBoxAscent || metrics.actualBoundingBoxAscent;
      const descent = metrics.fontBoundingBoxDescent || metrics.actualBoundingBoxDescent;
      const range = document.createRange();
      // Browser ranges retain the heading's exact kerning and letter spacing.
      for (let i = 0; i < text.length; i++) {
        range.setStart(label.firstChild, i); range.setEnd(label.firstChild, i + 1);
        const glyph = range.getBoundingClientRect();
        const baseline = glyph.top - bounds.top + (glyph.height - ascent - descent) / 2 + ascent;
        ink.fillText(text[i], glyph.left - bounds.left, baseline);
      }
      const pixels = ink.getImageData(0, 0, mask.width, mask.height).data;
      const step = Math.max(2, Math.round(parseFloat(font.fontSize) / 38));
      const points: Array<{ x: number; y: number }> = [];
      for (let y = 0; y < height; y += step) for (let x = 0; x < width; x += step) {
        if (pixels[(Math.floor(y * 2) * mask.width + Math.floor(x * 2)) * 4 + 3] > 110) points.push({ x, y });
      }
      const stride = Math.max(1, Math.ceil(points.length / 1400));
      dots = points.filter((_, i) => i % stride === 0).map((point, i) => {
        const random = (seed: number) => { const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
        return { ...point, fromX: random(i + 1) * width, fromY: random(i + 90) * height, delay: random(i + 400) * 500 + point.x / width * 350 };
      });
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      surface.width = Math.ceil(width * ratio); surface.height = Math.ceil(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.fillStyle = font.color;
      return dots.length > 0;
    };

    const start = () => {
      if (!alive || playing || !dots.length) return;
      playing = true; setAssembling(true);
      const began = performance.now();
      const draw = (now: number) => {
        if (!alive) return;
        const elapsed = now - began;
        context.clearRect(0, 0, width, height);
        const fade = Math.min(1, Math.max(0, (elapsed - 2450) / 400));
        for (const dot of dots) {
          const progress = Math.max(0, Math.min(1, (elapsed - dot.delay) / 1600));
          const ease = 1 - Math.pow(1 - progress, 3);
          const curve = Math.sin(progress * Math.PI) * (1 - progress);
          const x = dot.fromX + (dot.x - dot.fromX) * ease;
          const y = dot.fromY + (dot.y - dot.fromY) * ease + curve * 12;
          context.globalAlpha = Math.min(1, elapsed / 220) * (1 - fade);
          context.beginPath(); context.arc(x, y, 1.05, 0, Math.PI * 2); context.fill();
        }
        if (elapsed >= 2450) setAssembling(false);
        if (elapsed < 2850) frame = requestAnimationFrame(draw);
        else { playing = false; context.clearRect(0, 0, width, height); }
      };
      frame = requestAnimationFrame(draw);
    };
    play.current = start;
    void document.fonts.ready.then(() => {
      if (!alive) return;
      try { if (measure()) start(); else setAssembling(false); }
      catch { setAssembling(false); }
    });
    const observer = new ResizeObserver(() => {
      const bounds = label.getBoundingClientRect();
      if (Math.abs(bounds.width - width) < .5 && Math.abs(bounds.height - height) < .5) return;
      cancelAnimationFrame(frame); playing = false;
      context.clearRect(0, 0, width, height); setAssembling(false);
      try { measure(); } catch { dots = []; }
    });
    observer.observe(label);
    return () => { alive = false; cancelAnimationFrame(frame); observer.disconnect(); play.current = () => {}; };
  }, [text, reduced]);

  return <span className={styles.particleRoot} aria-hidden="true"
    onPointerEnter={event => { if (event.pointerType === 'mouse') play.current(); }}
    onPointerDown={event => { if (event.pointerType !== 'mouse') play.current(); }}>
    <span ref={source} className={`${styles.particleSource} ${assembling && !reduced ? styles.assembling : ''}`}>{text}</span>
    <canvas ref={canvas} className={styles.particleCanvas} />
  </span>;
}
