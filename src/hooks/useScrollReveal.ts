import { useReducedMotion } from 'motion/react';

/** Reusable motion props; no extra wrapper or layout changes. */
export function useScrollReveal(delay = 0) {
  const reduced = useReducedMotion();
  return {
    initial: reduced ? false as const : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: reduced ? 0 : 0.8, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}
