import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import styles from './AnimatedLetters.module.scss';

/** Clip copies of the fully typeset title, preserving its original kerning and width. */
export default function AnimatedLetters({ text }: { text: string }) {
  const source = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [clips, setClips] = useState<Array<{ left: number; right: number }>>([]);
  useLayoutEffect(() => {
    const element = source.current;
    if (!element || reduced) return;
    let active = true;
    const measure = () => {
      if (!active || !element.firstChild) return;
      const bounds = element.getBoundingClientRect();
      if (!bounds.width) return;
      const range = document.createRange();
      const next: Array<{ left: number; right: number }> = [];
      for (let i = 0; i < text.length; i++) {
        range.setStart(element.firstChild, i);
        range.setEnd(element.firstChild, i + 1);
        const box = range.getBoundingClientRect();
        next.push({ left: (box.left - bounds.left) / bounds.width * 100, right: (bounds.right - box.right) / bounds.width * 100 });
      }
      setClips(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    void document.fonts.ready.then(measure);
    return () => { active = false; observer.disconnect(); };
  }, [text, reduced]);
  return <span className={styles.root} aria-hidden="true">
    <span ref={source} className={clips.length && !reduced ? styles.source : undefined}>{text}</span>
    {!reduced && clips.map((clip, index) => <motion.span key={`${text}-${index}`} className={styles.letter} style={{ clipPath: `inset(-40% ${clip.right}% -40% ${clip.left}%)` }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .85, delay: .18 + index * .045, ease: [.22, 1, .36, 1] }}>{text}</motion.span>)}
  </span>;
}
