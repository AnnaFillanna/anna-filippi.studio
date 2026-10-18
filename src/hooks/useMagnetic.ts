import { useEffect, useState, type PointerEvent } from 'react';
import { useReducedMotion, useSpring } from 'motion/react';

/** Apply to an existing motion.a/button. Its layout and native semantics stay intact. */
export function useMagnetic(strength = 4) {
  const reduced = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const x = useSpring(0, { stiffness: 190, damping: 25, mass: 0.35 });
  const y = useSpring(0, { stiffness: 190, damping: 25, mass: 0.35 });
  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setFinePointer(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    if (reduced || !finePointer) { x.jump(0); y.jump(0); }
  }, [reduced, finePointer, x, y]);
  const reset = () => { x.set(0); y.set(0); };
  return {
    style: { x, y },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      if (reduced || !finePointer || event.pointerType !== 'mouse') return;
      const rect = event.currentTarget.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2 - x.get());
      const dy = event.clientY - (rect.top + rect.height / 2 - y.get());
      x.set(Math.max(-strength, Math.min(strength, dx * 0.06)));
      y.set(Math.max(-strength, Math.min(strength, dy * 0.1)));
    },
    onPointerLeave: reset,
    onPointerCancel: reset,
    onBlur: reset,
  };
}
