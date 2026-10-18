import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import styles from './AnimatedLetters.module.scss';

/** Clip copies of the fully typeset title, preserving its original kerning and width. */
export default function AnimatedLetters({ text, flock = false }: { text: string; flock?: boolean }) {
  const source = useRef<HTMLSpanElement>(null);
  const [replay, setReplay] = useState(0);
  const lastReplay = useRef(0);
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
  const restart = () => {
    if (reduced || Date.now() - lastReplay.current < 1600) return;
    lastReplay.current = Date.now();
    setReplay(value => value + 1);
  };
  return <span className={styles.root} aria-hidden="true"
    onPointerEnter={event => { if (event.pointerType === 'mouse') restart(); }}
    onPointerDown={event => { if (event.pointerType !== 'mouse') restart(); }}
  >
    <span ref={source} className={clips.length && !reduced ? styles.source : undefined}>{text}</span>
    {!reduced && flock && clips.map((clip, index) => text[index] === ' ' ? null : <motion.span
      key={`bird-${replay}-${index}`} className={styles.bird}
      style={{ left: `${(clip.left + 100 - clip.right) / 2}%` }}
      initial={{ opacity: 0, x: index % 2 ? 180 + index * 20 : -160 - index * 18, y: -100 - index * 9, rotate: index % 2 ? -18 : 20, scale: .8 }}
      animate={{ opacity: [0, .9, .9, 0], x: [index % 2 ? 180 + index * 20 : -160 - index * 18, index % 2 ? 35 : -35, 0, 0], y: [-100 - index * 9, -45 + index % 3 * 15, 0, 0], rotate: [index % 2 ? -18 : 20, 0, -8, 0], scale: [.8, 1, .65, .2] }}
      transition={{ duration: 1.55, delay: index * .06, times: [0, .55, .8, 1], ease: [.22, 1, .36, 1] }}>
      <svg viewBox="0 0 40 24" width="32" height="20" fill="none" aria-hidden="true">
        <motion.path stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          initial={{ d: 'M2 5 Q12 3 20 18 Q28 3 38 5' }}
          animate={{ d: ['M2 5 Q12 3 20 18 Q28 3 38 5', 'M2 17 Q12 9 20 13 Q28 9 38 17', 'M2 5 Q12 3 20 18 Q28 3 38 5'] }}
          transition={{ duration: .5, repeat: 3, ease: 'easeInOut' }} />
      </svg>
    </motion.span>)}
    {!reduced && clips.map((clip, index) => <motion.span key={`${text}-${replay}-${index}`} className={styles.letter} style={{ clipPath: `inset(-40% ${clip.right}% -40% ${clip.left}%)` }} initial={{ opacity: 0, y: ".7em", filter: "blur(3px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: .95, delay: (flock ? 1.15 : replay === 0 ? .18 : 0) + index * .06, ease: [.22, 1, .36, 1] }}>{text}</motion.span>)}
  </span>;
}
