import { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import styles from './Hero.module.scss';
export default function Hero(){
  const section=useRef<HTMLElement>(null);
  const reduced=useReducedMotion();
  const intro=(delay:number)=>({initial:reduced?false:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:1.1,delay,ease:[.22,1,.36,1] as const}});
  return <section id="start" ref={section} className={styles.hero} aria-labelledby="hero-title">
    <div className={styles.portrait}><img src="/images/Hero.png" alt="Anna Filippi im Profil, mit wehendem blondem Haar und bordeauxrotem Stoff, nach links blickend." width="1280" height="445" fetchPriority="high"/></div>
    <div className={styles.fabricExtension} aria-hidden="true"><img src="images/hero-fabric-extension.png" alt="" width="2172" height="724" /></div>
    <div className={styles.copy}>
      <motion.p {...intro(.1)} className={styles.eyebrow}>DIGITAL ATELIER</motion.p>
      <motion.h1 {...intro(.22)} id="hero-title">ANNA FILIPPI</motion.h1>
      <motion.p {...intro(.42)} className={styles.tagline}>Webentwicklung.<br/>Produktfotografie.<br/>Digitale Lösungen.</motion.p>
    </div>
    <motion.a {...intro(.65)} href="#leistungen" className={styles.scroll}>SCROLL <span aria-hidden="true">↓</span><span className={styles.srOnly}> zu den Leistungen</span></motion.a>
    <p className={styles.location}>ANDERNACH · DE</p>
  </section>;
}
