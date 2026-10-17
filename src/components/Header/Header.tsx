import { useRef, useState } from 'react';
import type { InfoTopic } from '../../App';
import styles from './Header.module.scss';
export default function Header({onInfo}:{onInfo:(topic:InfoTopic)=>void}){
  const [open,setOpen]=useState(false);
  const toggle=useRef<HTMLButtonElement>(null);
  const show=(topic:InfoTopic)=>{setOpen(false);toggle.current?.focus();onInfo(topic);};
  return <header className={styles.header} onKeyDown={event=>{if(event.key==='Escape'){setOpen(false);toggle.current?.focus();}}}>
    <a href="#start" className={styles.monogram} aria-label="Anna Filippi – Startseite">A<span>F</span><i aria-hidden="true">.</i></a>
    <button type="button" className={styles.menuToggle} ref={toggle} aria-controls="hauptnavigation" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?'SCHLIESSEN −':'MENÜ +'}</button>
    <nav id="hauptnavigation" aria-label="Hauptnavigation" className={`${styles.nav} ${open?styles.open:''}`}>
      <button type="button" onClick={()=>show('Über mich')}>Über mich</button><button type="button" onClick={()=>show('Projekte')}>Projekte</button><a href="#leistungen" onClick={()=>setOpen(false)}>Leistungen</a><button type="button" onClick={()=>show('Kontakt')}>Kontakt</button>
    </nav>
    <button type="button" className={styles.startProject} onClick={()=>onInfo('Kontakt')}>PROJEKT STARTEN <span aria-hidden="true">↗</span></button>
  </header>;
}
