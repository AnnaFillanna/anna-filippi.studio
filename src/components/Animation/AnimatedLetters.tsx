import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import styles from './AnimatedLetters.module.scss';

/** Clip copies of the fully typeset title, preserving its original kerning and width. */
export default function AnimatedLetters({ text }: { text: string }) {
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
    {!reduced && clips.map((clip, index) => <motion.span key={`${text}-${replay}-${index}`} className={styles.letter} style={{ clipPath: `inset(-40% ${clip.right}% -40% ${clip.left}%)` }} initial={{ opacity: 0, y: ".7em", filter: "blur(3px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: .95, delay: (replay === 0 ? .18 : 0) + index * .06, ease: [.22, 1, .36, 1] }}>{text}</motion.span>)}
  </span>;
}
