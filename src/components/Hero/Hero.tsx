import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import styles from './Hero.module.scss';
export default function Hero(){
  const section=useRef<HTMLElement>(null);
  const reduced=useReducedMotion();
  const {scrollYProgress}=useScroll({target:section,offset:['start start','end start']});
  const y=useTransform(scrollYProgress,[0,1],[0,45]);
  const intro=(delay:number)=>({initial:reduced?false:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:1.1,delay,ease:[.22,1,.36,1] as const}});
  return <section id="start" ref={section} className={styles.hero} aria-labelledby="hero-title">
    <motion.div className={styles.portrait} style={{y:reduced?0:y}}><img src="images/anna-original.jpg" alt="Anna Filippi im Profil, mit wehendem blondem Haar und bordeauxrotem Stoff, nach links blickend." width="1280" height="445" fetchPriority="high"/></motion.div>
    <div className={styles.copy}>
      <motion.p {...intro(.1)} className={styles.eyebrow}>DIGITAL ATELIER</motion.p>
      <motion.h1 {...intro(.22)} id="hero-title">ANNA<br/>FILIPPI</motion.h1>
      <motion.p {...intro(.42)} className={styles.tagline}>Webentwicklung.<br/>Produktfotografie.<br/>Digitale Lösungen.</motion.p>
    </div>
    <motion.a {...intro(.65)} href="#leistungen" className={styles.scroll}>SCROLL <span aria-hidden="true">↓</span><span className={styles.srOnly}> zu den Leistungen</span></motion.a>
    <p className={styles.location}>ANDERNACH · DE</p>
  </section>;
}
