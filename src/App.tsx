import { useEffect, useRef, useState } from "react";
import { MotionConfig } from "motion/react";
import { pages, origin, pageForPath, migrateLegacyLink, type PagePath } from "./routes";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import Gallery from "./components/Gallery/Gallery";
import Projects from "./components/Projects/Projects";
import About from "./components/About/About";
import Footer from "./components/Footer/Footer";
import Contact from "./components/Contact/Contact";
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
export default function App({ initialPath = '/' }: { initialPath?: PagePath }) {
  const readLocation = () => {
    if (typeof window === 'undefined') return { path: initialPath, hash: '' };
    const { pathname, hash } = window.location;
    const legacy = pathname === '/' && (hash === '#fotografie' || hash === '#projekte');
    return { path: pageForPath(legacy ? `/${hash.slice(1)}` : pathname), hash: legacy ? '' : hash };
  };
  const [route, setRoute] = useState(readLocation);
  const galleryPage = route.path === '/fotografie';
  const projectsPage = route.path === '/projekte';
  useEffect(() => {
    const navigate = () => {
      migrateLegacyLink();
      const next = readLocation();
      setRoute(previous => previous.path === next.path && previous.hash === next.hash ? previous : next);
    };
    const followLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || !(url.pathname in pages)) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      event.preventDefault();
      window.history.pushState(null, '', url.pathname + url.search + url.hash);
      navigate();
    };
    navigate();
    window.addEventListener('popstate', navigate);
    window.addEventListener('hashchange', navigate);
    document.addEventListener('click', followLink);
    return () => {
      window.removeEventListener('popstate', navigate);
      window.removeEventListener('hashchange', navigate);
      document.removeEventListener('click', followLink);
    };
  }, []);
  useEffect(() => {
    const meta = pages[route.path];
    const canonical = origin + route.path;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
    const frame = requestAnimationFrame(() => {
      const target = route.hash ? document.getElementById(decodeURIComponent(route.hash.slice(1))) : null;
      if (target) target.scrollIntoView();
      else {
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (galleryPage || projectsPage) document.getElementById(projectsPage ? 'projects-title' : 'gallery-title')?.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [route.path, route.hash, galleryPage, projectsPage]);
  const dialog = useRef<HTMLDialogElement>(null);
  const [topic] = useState<InfoTopic>("Kontakt");
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#inhalt">
        Zum Inhalt springen
      </a>
      <Header />
      <main id="inhalt">
        {galleryPage ? <Gallery /> : projectsPage ? <Projects /> : <>
          <Hero />
          <Services />
          <About />
        </>}
        <Contact />
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
