import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import styles from './Gallery.module.scss';

const dimensions: Record<number, { width: number; height: number }> = {"1": {"width": 1023, "height": 1280}, "2": {"width": 853, "height": 1280}, "3": {"width": 953, "height": 1191}, "4": {"width": 1023, "height": 1280}, "5": {"width": 914, "height": 1280}, "6": {"width": 1023, "height": 1280}, "7": {"width": 720, "height": 1280}, "8": {"width": 1280, "height": 853}, "9": {"width": 849, "height": 1280}, "10": {"width": 960, "height": 1280}, "11": {"width": 1066, "height": 1600}, "12": {"width": 1066, "height": 1600}, "13": {"width": 1142, "height": 1600}, "14": {"width": 1066, "height": 1600}, "15": {"width": 1143, "height": 1600}, "16": {"width": 1143, "height": 1600}, "17": {"width": 1067, "height": 1600}, "18": {"width": 1200, "height": 1600}};
const collections = {
  staged: { label: 'Inszenierte Produktfotografie', title: 'Licht. Material.', accent: 'Atmosphäre.', text: 'Schmuck im Dialog mit Stoff, Spiegelungen und natürlichen Texturen.', photos: [
    { id: 2, title: 'Perlen & Seide', alt: 'Goldfarbene Ohrringe mit Perlen auf einem Spiegel neben weißem Satin' },
    { id: 5, title: 'Botanische Ruhe', alt: 'Goldfarbene Ohrringe auf einer weißen kleinen Säule vor grünen Zweigen' },
    { id: 1, title: 'Samt & Reflexion', alt: 'Goldfarbene Ohrringe mit schwarzen Steinen auf einem Spiegel vor schwarzem Samt' },
    { id: 6, title: 'Grünes Leuchten', alt: 'Ohrringe mit grünen Steinen auf einer Glasschale mit weißem Tüll' },
    { id: 7, title: 'Form & Struktur', alt: 'Goldfarbene Kette mit Blattanhänger auf einem weißen strukturierten Stein' },
    { id: 10, title: 'Natürliche Nuancen', alt: 'Schmuck mit grünen Perlen und einem perlmuttfarbenen Element in einer Muschelschale' },
    {"id": 11, "title": "Licht & Schatten", "alt": "Goldfarbener Schlangenring mit blauem Stein auf weißen Sockeln"},
    {"id": 12, "title": "Gold & Tüll", "alt": "Goldfarbene runde Ohrringe in einer Glasschale mit weißem Tüll"},
    {"id": 13, "title": "Stein & Metall", "alt": "Gold- und silberfarbene Ohrringe vor rötlichem Stein"},
    {"id": 14, "title": "Goldene Kreise", "alt": "Goldfarbene Creolen an einem Grashalm mit Spiegelung"},
    {"id": 15, "title": "Fließendes Gold", "alt": "Lange goldfarbene Kettenohrringe auf dunklem Stein"},
    {"id": 16, "title": "Botanische Akzente", "alt": "Goldfarbene Creolen auf grauem Stein vor blauen Blüten"},
    {"id": 17, "title": "Grün & Stein", "alt": "Grüne Ohrringe mit goldfarbenem Rand auf einem grauen Stein"},
    {"id": 18, "title": "Federleicht", "alt": "Goldfarbene Ohrringe in Blattform vor einer Feder"},
  ] },
  clean: { label: 'Produkt im Fokus', title: 'Klare Formen.', accent: 'Feine Details.', text: 'Reduzierte Hintergründe. Raum für Farbe, Form und die kleinen Besonderheiten.', photos: [
    { id: 8, title: 'Rot & Gold', alt: 'Goldfarbene Ohrringe mit roten Steinen auf weißem Hintergrund' },
    { id: 3, title: 'Eine fließende Linie', alt: 'Schlangenförmiger goldfarbener Ring mit blauem Stein auf weißem Hintergrund' },
    { id: 9, title: 'Organische Formen', alt: 'Grüne Ohrringe mit goldfarbenem Rand auf weißem Hintergrund' },
    { id: 4, title: 'Drei Facetten', alt: 'Goldfarbener Ring mit drei unterschiedlich geformten klaren Steinen auf weißem Hintergrund' },
  ] },
};
type Category = keyof typeof collections;
export default function Gallery() {
  const [category, setCategory] = useState<Category>('staged');
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const reduced = useReducedMotion();
  const collection = collections[category];
  const photo = collection.photos[selected];
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  const show = (index: number, button: HTMLButtonElement) => {
    trigger.current = button; setSelected(index); setOpen(true); dialog.current?.showModal();
  };
  const step = (amount: number) => setSelected(value => (value + amount + collection.photos.length) % collection.photos.length);
  return <section id="fotografie" className={styles.gallery} aria-labelledby="gallery-title">
    <div className={styles.pageNavigation}><a className={styles.backLink} href="#leistungen">ZURÜCK ZUM ATELIER</a><a className={styles.backLink} href="#kontakt">KONTAKT </a></div>
    <div className={styles.hero}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}><span /> ANNA FILIPPI / PRODUKTFOTOGRAFIE</p>
        <h1 id="gallery-title" tabIndex={-1}>Kleine Details.<br /><em>Große Wirkung.</em></h1>
        <p className={styles.lead}>Licht, das Formen zeichnet. Materialien, die Geschichten erzählen. Ich mache sichtbar, was deine Produkte besonders macht.</p>
      </div>
      <div className={styles.heroVisual}>
        <img src="/images/gallery-calla.jpg" alt="Rote Calla vor einer sonnenbeschienenen hellen Wand" width="816" height="1456" fetchPriority="high" />
      </div>
    </div>
    <div id="foto-kollektion" className={styles.filters} role="group" aria-label="Fotos nach Stil auswählen">
      {(Object.keys(collections) as Category[]).map(key => <button key={key} type="button" aria-pressed={key === category} onClick={() => { setCategory(key); setSelected(0); }}>{collections[key].title} {collections[key].accent}</button>)}
    </div>
    <p className={styles.srOnly} role="status">{collection.label}: {collection.photos.length} Fotografien</p>
    <div className={`${styles.grid} ${category === 'clean' ? styles.clean : ''}`}>
      {collection.photos.map((item, index) => <motion.figure key={item.id} className={styles.item} initial={reduced ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: reduced ? 0 : .7 }}>
        <button type="button" className={styles.imageButton} onClick={event => show(index, event.currentTarget)} aria-label={`${item.title} – Foto vergrößern`} aria-haspopup="dialog"><img src={`/images/portfolio/anna-filippi-${item.id}.jpg`} alt={item.alt} width={dimensions[item.id].width} height={dimensions[item.id].height} loading="lazy" decoding="async" /><span className={styles.view}>ANSEHEN</span></button>
        <figcaption><span>{item.title}</span><span>ANNA FILIPPI</span></figcaption>
      </motion.figure>)}
    </div>
    <dialog ref={dialog} className={styles.lightbox} aria-label="Fotografie in Großansicht" onClose={() => { setOpen(false); trigger.current?.focus(); }} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={event => { if (event.key === 'ArrowRight') { event.preventDefault(); step(1); } if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); } }}>
      {open && <><div className={styles.viewerTop}><span>ANNA FILIPPI / FOTO</span><button type="button" autoFocus onClick={() => dialog.current?.close()}>SCHLIESSEN</button></div><img className={styles.fullImage} src={`/images/portfolio/anna-filippi-${photo.id}.jpg`} alt={photo.alt} /><div className={styles.viewerBottom}><button type="button" onClick={() => step(-1)}>ZURÜCK</button><p aria-live="polite">{photo.title} · {selected + 1} / {collection.photos.length}</p><button type="button" onClick={() => step(1)}>WEITER</button></div></>}
    </dialog>
  </section>;
}
