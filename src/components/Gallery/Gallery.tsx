import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import styles from "./Gallery.module.scss";

const additionalPhotoSources: Record<number, string> = {
  "19": "/images/portfolio/DSC08033 (1).jpg",
  "20": "/images/portfolio/lkjh (1).png",
  "21": "/images/portfolio/ChatGPTImage28.Dez.2025_14_12_13.png",
  "22": "/images/portfolio/dgft (1).png",
  "23": "/images/portfolio/5B9C7EA2-E3D3-47A7-8195-F0D46150D883_e9f4f705-e388-4e4e-98eb-b104fd968e5c (1).png",
  "24": "/images/portfolio/A6705381_11b96729-6ce3-4849-bb21-ecea410df535.png",
  "25": "/images/portfolio/hzgthg (1).png",
  "26": "/images/portfolio/237_7377b7bf-af9f-4896-a897-13ca93a6ef8b.png",
  "27": "/images/portfolio/oeplo.png",
  "28": "/images/portfolio/asdf (1).png",
  "29": "/images/portfolio/losder2.png.jpg",
  "30": "/images/portfolio/oelkj.png",
  "31": "/images/portfolio/ChatGPTImage28.Dez.2025_13_52_30.png",
  "32": "/images/portfolio/2693f2d7f91be0e7ac84b42eb9e2b53a.jpg",
  "33": "/images/portfolio/Ohringe_1_1.jpg",
  "34": "/images/portfolio/white (1).png",
  "35": "/images/portfolio/qwret (1).png",
  "36": "/images/portfolio/zhdeg (1).png",
  "37": "/images/portfolio/610974098_17870155233506883_7656635994878217710_n (2).jpg",
  "38": "/images/portfolio/juhz (1).png",
  "39": "/images/portfolio/hvo8v6 (1).jpg",
  "40": "/images/portfolio/hsgdf (1).png",
  "41": "/images/portfolio/bcizrs (1).png",
  "42": "/images/portfolio/fgrtd (1).png"
};

function photoSource(id: number) {
  return additionalPhotoSources[id] ?? (id === 8
    ? "/images/portfolio/anna-filippi-8-chain.webp"
    : `/images/portfolio/anna-filippi-${id}.jpg`);
}

const dimensions: Record<number, { width: number; height: number }> = {
  "1": { width: 1023, height: 1280 },
  "2": { width: 853, height: 1280 },
  "3": { width: 953, height: 1191 },
  "4": { width: 1023, height: 1280 },
  "5": { width: 914, height: 1280 },
  "6": { width: 1023, height: 1280 },
  "7": { width: 720, height: 1280 },
  "8": { width: 1346, height: 1683 },
  "9": { width: 849, height: 1280 },
  "10": { width: 960, height: 1280 },
  "11": { width: 1066, height: 1600 },
  "12": { width: 1066, height: 1600 },
  "13": { width: 1142, height: 1600 },
  "14": { width: 1066, height: 1600 },
  "15": { width: 1143, height: 1600 },
  "16": { width: 1143, height: 1600 },
  "17": { width: 1067, height: 1600 },
  "18": { width: 1200, height: 1600 },
  "19": { width: 2274, height: 3185 },
  "20": { width: 980, height: 1225 },
  "21": { width: 758, height: 947 },
  "22": { width: 1024, height: 1281 },
  "23": { width: 1024, height: 1536 },
  "24": { width: 1555, height: 1944 },
  "25": { width: 1160, height: 1450 },
  "26": { width: 2152, height: 3313 },
  "27": { width: 969, height: 1211 },
  "28": { width: 1068, height: 1335 },
  "29": { width: 1121, height: 1401 },
  "30": { width: 2009, height: 2812 },
  "31": { width: 1134, height: 1418 },
  "32": { width: 1200, height: 1600 },
  "33": { width: 3303, height: 4128 },
  "34": { width: 1500, height: 1875 },
  "35": { width: 1158, height: 1448 },
  "36": { width: 1024, height: 1536 },
  "37": { width: 1372, height: 1715 },
  "38": { width: 1016, height: 1270 },
  "39": { width: 2175, height: 3046 },
  "40": { width: 950, height: 1424 },
  "41": { width: 1476, height: 2066 },
  "42": { width: 1110, height: 1389 },
};
const collections = {
  staged: {
    label: "Inszenierte Produktfotografie",
    title: "Licht. Material.",
    accent: "Atmosphäre.",
    text: "Schmuck im Dialog mit Stoff, Spiegelungen und natürlichen Texturen.",
    photos: [
      {"id": 19, "title": "Warme Akzente", "alt": "Ohrringe mit rotbraunen Steinen neben einer cremefarbenen Vase und einem Spiegel im Sonnenlicht"},
      {"id": 32, "title": "Glieder im Dialog", "alt": "Silber- und goldfarbene Gliederketten auf einer hellen Stoffrolle vor dunklem Hintergrund"},
      {"id": 33, "title": "Goldene Falten", "alt": "Goldfarbene Ohrstecker mit breiten gefalteten Formen auf einem hellen Sockel im weichen Licht"},
      {"id": 37, "title": "Struktur im Sand", "alt": "Goldfarbene geriffelte Creolen mit abgerundeter dreieckiger Form auf einer sandfarbenen Oberfläche"},
      {"id": 39, "title": "Orange im Sonnenlicht", "alt": "Goldfarbene Ohrringe mit orangefarbenen Steinen in einer kleinen hellblauen Schale auf Holz im Sonnenlicht"},
      {"id": 41, "title": "Licht auf Keramik", "alt": "Goldfarbenes Armband und Ring an einer cremefarbenen Vase vor grauer Wand mit Licht und Schatten"},
      {
        id: 2,
        title: "Perlen & Seide",
        alt: "Goldfarbene Ohrringe mit Perlen auf einem Spiegel neben weißem Satin",
      },
      {
        id: 5,
        title: "Botanische Ruhe",
        alt: "Goldfarbene Ohrringe auf einer weißen kleinen Säule vor grünen Zweigen",
      },
      {
        id: 1,
        title: "Samt & Reflexion",
        alt: "Goldfarbene Ohrringe mit schwarzen Steinen auf einem Spiegel vor schwarzem Samt",
      },
      {
        id: 6,
        title: "Grünes Leuchten",
        alt: "Ohrringe mit grünen Steinen auf einer Glasschale mit weißem Tüll",
      },
      {
        id: 7,
        title: "Form & Struktur",
        alt: "Goldfarbene Kette mit Blattanhänger auf einem weißen strukturierten Stein",
      },
      {
        id: 10,
        title: "Natürliche Nuancen",
        alt: "Schmuck mit grünen Perlen und einem perlmuttfarbenen Element in einer Muschelschale",
      },
      {
        id: 11,
        title: "Licht & Schatten",
        alt: "Goldfarbener Schlangenring mit blauem Stein auf weißen Sockeln",
      },
      {
        id: 12,
        title: "Gold & Tüll",
        alt: "Goldfarbene runde Ohrringe in einer Glasschale mit weißem Tüll",
      },
      {
        id: 13,
        title: "Stein & Metall",
        alt: "Gold- und silberfarbene Ohrringe vor rötlichem Stein",
      },
      {
        id: 14,
        title: "Goldene Kreise",
        alt: "Goldfarbene Creolen an einem Grashalm mit Spiegelung",
      },
      {
        id: 15,
        title: "Fließendes Gold",
        alt: "Lange goldfarbene Kettenohrringe auf dunklem Stein",
      },
      {
        id: 16,
        title: "Botanische Akzente",
        alt: "Goldfarbene Creolen auf grauem Stein vor blauen Blüten",
      },
      {
        id: 17,
        title: "Grün & Stein",
        alt: "Grüne Ohrringe mit goldfarbenem Rand auf einem grauen Stein",
      },
      {
        id: 18,
        title: "Federleicht",
        alt: "Goldfarbene Ohrringe in Blattform vor einer Feder",
      },
    ],
  },
  clean: {
    label: "Produkt im Fokus",
    title: "Klare Formen.",
    accent: "Feine Details.",
    text: "Reduzierte Hintergründe. Raum für Farbe, Form und die kleinen Besonderheiten.",
    photos: [
      {"id": 20, "title": "Zwei Lichtpunkte", "alt": "Goldfarbener Ring mit geriffelter Schiene und zwei rechteckigen hellen Steinen auf weißem Hintergrund"},
      {"id": 21, "title": "Glanzvolle Creolen", "alt": "Breite goldfarbene Creolen mit kleinen hellen Steinen auf weißem Hintergrund"},
      {"id": 22, "title": "Goldene Schleifen", "alt": "Goldfarbene Ohrstecker aus geschwungenen, parallel verlaufenden Linien auf weißem Hintergrund"},
      {"id": 23, "title": "Feine Kaskaden", "alt": "Lange goldfarbene Ohrringe mit unterschiedlich langen feinen Ketten auf weißem Hintergrund"},
      {"id": 27, "title": "Sanfter Schimmer", "alt": "Goldfarbener Ring mit ovalem weiß schimmerndem Einsatz auf hellem Hintergrund"},
      {"id": 28, "title": "Glück im Detail", "alt": "Silberfarbener Armreif mit goldfarbenem Hufeisen und kleinen hellen Steinen auf weißem Hintergrund"},
      {"id": 29, "title": "Blau & Gold", "alt": "Goldfarbenes Armband mit verschiedenen Kettenstrukturen, blauen und weißen Perlen auf weißem Hintergrund"},
      {"id": 30, "title": "Verschlungener Glanz", "alt": "Goldfarbene Ohrstecker mit verschlungenen geriffelten Formen und hellen Steinen auf weißem Hintergrund"},
      {"id": 31, "title": "Zarte Schleifen", "alt": "Goldfarbene Schleifenohrringe mit langen feinen Ketten auf weißem Hintergrund"},
      {"id": 35, "title": "Verspielte Details", "alt": "Goldfarbenes Armband mit länglichen Gliedern, einer weißen Perle und kleinen Anhängern auf weißem Hintergrund"},
      {"id": 36, "title": "Drei goldene Ebenen", "alt": "Drei goldfarbene Halsketten mit unterschiedlichen Gliedern, einem sichelförmigen und einem runden Anhänger auf weißem Hintergrund"},
      {"id": 38, "title": "Glied für Glied", "alt": "Goldfarbener Ring aus breiten ineinandergreifenden Kettengliedern auf weißem Hintergrund"},
      {"id": 40, "title": "Kreuz & Medaillon", "alt": "Feine goldfarbene Halskette mit Kreuz und kleinem ovalem Anhänger auf weißem Hintergrund"},
      {
        id: 8,
        title: "Goldene Sonne",
        alt: "Goldfarbene Halskette mit rundem, mit hellen Steinen besetztem Sonnenanhänger auf hellem Hintergrund",
      },
      {
        id: 3,
        title: "Eine fließende Linie",
        alt: "Schlangenförmiger goldfarbener Ring mit blauem Stein auf weißem Hintergrund",
      },
      {
        id: 9,
        title: "Organische Formen",
        alt: "Grüne Ohrringe mit goldfarbenem Rand auf weißem Hintergrund",
      },
      {
        id: 4,
        title: "Drei Facetten",
        alt: "Goldfarbener Ring mit drei unterschiedlich geformten klaren Steinen auf weißem Hintergrund",
      },
    ],
  },
};
type Category = keyof typeof collections;
export default function Gallery() {
  const [category, setCategory] = useState<Category>("staged");
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const reduced = useReducedMotion();
  const [lineReady, setLineReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setLineReady(true), 180);
    return () => window.clearTimeout(timer);
  }, []);
  const collection = collections[category];
  const photo = collection.photos[selected];
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  const show = (index: number, button: HTMLButtonElement) => {
    trigger.current = button;
    setSelected(index);
    setOpen(true);
    dialog.current?.showModal();
  };
  const step = (amount: number) =>
    setSelected(
      (value) =>
        (value + amount + collection.photos.length) % collection.photos.length,
    );
  return (
    <section
      id="fotografie"
      className={styles.gallery}
      aria-labelledby="gallery-title"
    >
      <span className="sunlight" aria-hidden="true" />
      <div className={styles.pageNavigation}>
        <a className={styles.backLink} href="/#leistungen">
          ZURÜCK ZUM ATELIER
        </a>
        <a className={styles.backLink} href="/kontakt">
          KONTAKT{" "}
        </a>
      </div>
      <div className={`${styles.hero} ${lineReady ? styles.lineReady : ""}`}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>
            <span /> ANNA FILIPPI / PRODUKTFOTOGRAFIE
          </p>
          <h1 id="gallery-title" tabIndex={-1}>
            Produktfotografie.
            <br />
            <em>Große Wirkung.</em>
          </h1>
          <p className={styles.lead}>
            Produkt- und Schmuckfotografie für Onlineshops, Websites und Marken. Von klaren Produktansichten auf hellem Hintergrund bis zur kreativen Inszenierung – ich zeige, was deine Produkte besonders macht.
          </p>
        </div>
        <div className={styles.heroVisual}>
          <img
            src="/images/gallery-calla.jpg"
            alt="Rote Calla vor einer sonnenbeschienenen hellen Wand"
            width="816"
            height="1456"
            fetchPriority="high"
          />
        </div>
      </div>
      <div
        id="foto-kollektion"
        className={styles.filters}
        role="group"
        aria-label="Fotos nach Stil auswählen"
      >
        {(Object.keys(collections) as Category[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={key === category}
            onClick={() => {
              setCategory(key);
              setSelected(0);
            }}
          >
            <span className={styles.filterTitle}>{collections[key].title} {collections[key].accent}</span>
            <span className={styles.filterMeta}>
              <span>{key === "clean" ? "AUF HELLEM HINTERGRUND" : "KOMPOSITIONEN"}</span>
              <span className={styles.filterAction}><span className={styles.arrowCircle} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4 12h16M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg></span>{key === "clean" ? "Galerie ansehen" : "Jetzt entdecken"}</span>
            </span>
          </button>
        ))}
      </div>
      <p className={styles.srOnly} role="status">
        {collection.label}: {collection.photos.length} Fotografien
      </p>
      <div
        className={`${styles.grid} ${category === "clean" ? styles.clean : ""}`}
      >
        {collection.photos.map((item, index) => (
          <motion.figure
            key={item.id}
            className={styles.item}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: reduced ? 0 : 0.7 }}
          >
            <button
              type="button"
              className={styles.imageButton}
              onClick={(event) => show(index, event.currentTarget)}
              aria-label={`${item.title} – Foto vergrößern`}
              aria-haspopup="dialog"
            >
              <img
                src={photoSource(item.id)}
                alt={item.alt}
                width={dimensions[item.id].width}
                height={dimensions[item.id].height}
                loading="lazy"
                decoding="async"
              />
              <span className={styles.view}>ANSEHEN</span>
            </button>
            <figcaption>
              <span>{item.title}</span>
              <span>ANNA FILIPPI</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
      <dialog
        ref={dialog}
        className={styles.lightbox}
        aria-label="Fotografie in Großansicht"
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
        }}
      >
        {open && (
          <>
            <div className={styles.viewerTop}>
              <span>ANNA FILIPPI / FOTO</span>
              <button
                type="button"
                autoFocus
                onClick={() => dialog.current?.close()}
              >
                SCHLIESSEN
              </button>
            </div>
            <img
              className={styles.fullImage}
              src={photoSource(photo.id)}
              alt={photo.alt}
            />
            <div className={styles.viewerBottom}>
              <button type="button" onClick={() => step(-1)}>
                ZURÜCK
              </button>
              <p aria-live="polite">
                {photo.title} · {selected + 1} / {collection.photos.length}
              </p>
              <button type="button" onClick={() => step(1)}>
                WEITER
              </button>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
