import { useEffect, useRef, useState } from "react";
import { MotionConfig } from "motion/react";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import Gallery from "./components/Gallery/Gallery";
import Projects from "./components/Projects/Projects";
import About from "./components/About/About";
import Footer from "./components/Footer/Footer";
export type InfoTopic =
  | "Über mich"
  | "Projekte"
  | "Kontakt"
  | "WEB"
  | "FOTO";
const descriptions: Record<InfoTopic, string> = {
  "Über mich":
    "Die persönliche Vorstellung folgt im nächsten Entwicklungsschritt.",
  Projekte:
    "Die Projektgalerie folgt. Hier werden künftig ausgewählte, reale Arbeiten vorgestellt.",
  Kontakt:
    "Der Kontaktbereich wird im nächsten Schritt ergänzt. Es ist noch keine Kontaktadresse hinterlegt.",
  WEB:
    "Websites, Web-Applikationen und KI-Integrationen. Weitere Informationen zu diesen Leistungen folgen.",
  FOTO:
    "Produktfotografie, visuelles Storytelling und Markenästhetik. Weitere Informationen zu diesen Leistungen folgen.",
};
export default function App() {
  const [galleryPage, setGalleryPage] = useState(() => window.location.hash === '#fotografie');
  useEffect(() => {
    const navigate = () => {
      const hash = window.location.hash;
      if (hash !== '#inhalt') setGalleryPage(hash === '#fotografie');
    };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  useEffect(() => {
    const homeTitle = document.title;
    if (galleryPage) document.title = 'Produktfotografie – Anna Filippi';
    const frame = requestAnimationFrame(() => {
      if (galleryPage) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        document.getElementById('gallery-title')?.focus({ preventScroll: true });
      } else {
        const id = window.location.hash.slice(1);
        if (id) document.getElementById(id)?.scrollIntoView();
      }
    });
    return () => { cancelAnimationFrame(frame); document.title = homeTitle; };
  }, [galleryPage]);
  const dialog = useRef<HTMLDialogElement>(null);
  const [topic] = useState<InfoTopic>("Kontakt");
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#inhalt">
        Zum Inhalt springen
      </a>
      <Header />
      <main id="inhalt">
        {galleryPage ? <Gallery /> : <>
          <Hero />
          <Services />
          <About />
          <Projects />
        </>}
      </main>
      <Footer />
      <dialog
        ref={dialog}
        className="dialog"
        aria-labelledby="info-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <button type="button" onClick={() => dialog.current?.close()} autoFocus>
          Schließen ×
        </button>
        <h2 id="info-title">{topic}</h2>
        <p>{descriptions[topic]}</p>
      </dialog>
    </MotionConfig>
  );
}
