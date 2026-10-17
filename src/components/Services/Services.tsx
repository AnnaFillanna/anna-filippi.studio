import { motion, useReducedMotion } from 'motion/react';
import type { InfoTopic } from '../../App';
import styles from './Services.module.scss';
const services=[{title:'DIGITAL',text:'Websites, Web-Applikationen und KI-Integrationen.',image:'laptop.jpg',theme:'digital',alt:'Dunkler Laptop mit Programmcode vor bordeauxrotem Hintergrund.'},{title:'VISUAL',text:'Produktfotografie, visuelles Storytelling und Markenästhetik.',image:'flower.jpg',theme:'visual',alt:'Skulpturale dunkelrote Blume vor elfenbeinfarbenem Hintergrund.'}] as const;
export default function Services({onInfo}:{onInfo:(topic:InfoTopic)=>void}){
 const reduced=useReducedMotion();
 return <section id="leistungen" className={styles.services} aria-label="Leistungen: Digital und Visual">{services.map((service,index)=><motion.article key={service.title} className={`${styles.service} ${styles[service.theme]}`} initial={reduced?false:{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.8,delay:index*.12}} aria-labelledby={`title-${service.theme}`}>
   <div className={styles.image}><img src={`images/${service.image}`} alt={service.alt} width="1536" height="1024" loading="lazy"/></div>
   <div className={styles.content}><h2 id={`title-${service.theme}`}>{service.title}.</h2><p>{service.text}</p><button type="button" onClick={()=>onInfo(service.title)} aria-label={`Mehr erfahren über ${service.title}`}>MEHR ERFAHREN <span aria-hidden="true">↗</span></button></div>
 </motion.article>)}</section>;
}
