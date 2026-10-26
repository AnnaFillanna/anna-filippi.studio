import { useEffect, useRef, useState } from "react";
import { MotionConfig } from "motion/react";
import { BrowserRouter, StaticRouter, Route, Routes, useLocation, useNavigate } from "react-router";
import { pages, origin, pageForPath, type PagePath } from "./routes";
import AboutPage from "./components/AboutPage/AboutPage";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import FeaturedProjects from "./components/FeaturedProjects/FeaturedProjects";
import Services from "./components/Services/Services";
import ProjectProcess from "./components/ProjectProcess/ProjectProcess";
import Gallery from "./components/Gallery/Gallery";
import Projects from "./components/Projects/Projects";
import Footer from "./components/Footer/Footer";
import HomeContact from "./components/HomeContact/HomeContact";
import BookingDemo from './components/BookingDemo/BookingDemo';
import Contact from "./components/Contact/Contact";
import Impressum from "./components/LegalPages/Impressum";
import Datenschutz from "./components/LegalPages/Datenschutz";

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
  return typeof window === 'undefined'
    ? <StaticRouter location={initialPath}><Site /></StaticRouter>
    : <BrowserRouter><Site /></BrowserRouter>;
}

function Site() {
  const location = useLocation();
  const navigate = useNavigate();
  const pagePath = pageForPath(location.pathname);
  useEffect(() => {
    if (location.pathname === '/' && (location.hash === '#projekte' || location.hash === '#fotografie' || location.hash === '#ueber-mich')) {
      void navigate(`/${location.hash.slice(1)}${location.search}`, { replace: true });
    }
  }, [location.pathname, location.hash, location.search, navigate]);
  useEffect(() => {
    if (location.hash === '#kontakt' && location.pathname !== '/' && location.pathname !== '/kontakt') {
      void navigate('/kontakt' + location.search, { replace: true });
    }
  }, [location.pathname, location.hash, location.search, navigate]);
  useEffect(() => {
    // Preserve existing anchor components while React Router handles navigation.
    const followLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || !Object.hasOwn(pages, url.pathname)) return;
      event.preventDefault();
      void navigate(url.pathname + url.search + url.hash);
    };
    document.addEventListener('click', followLink);
    return () => document.removeEventListener('click', followLink);
  }, [navigate]);
  useEffect(() => {
    const meta = pages[pagePath];
    const canonical = origin + pagePath;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
    const frame = requestAnimationFrame(() => {
      let id = location.hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* Retain malformed hashes as harmless literal anchors. */ }
      const target = id ? document.getElementById(id) : null;
      if (target) target.scrollIntoView();
      else {
        window.scrollTo({ top: 0, behavior: 'instant' });
        const heading = pagePath === '/kontakt' ? 'contact-title' : pagePath === '/impressum' || pagePath === '/datenschutz' ? 'legal-title' : (pagePath === '/softwareentwicklung' || pagePath === '/dana-tattoo-studio') ? 'software-title' : pagePath === '/projekte' ? 'projects-title' : pagePath === '/fotografie' ? 'gallery-title' : pagePath === '/ueber-mich' ? 'about-page-title' : null;
        if (heading) document.getElementById(heading)?.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pagePath, location.hash, location.key]);
  const dialog = useRef<HTMLDialogElement>(null);
  const [topic] = useState<InfoTopic>("Kontakt");
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#inhalt">
        Zum Inhalt springen
      </a>
      <Header />
      <main id="inhalt">
        <Routes>
          <Route path="/" element={<><Hero /><Services /><FeaturedProjects /><ProjectProcess /></>} />
          <Route path="/softwareentwicklung" element={<Projects softwareOnly />} />
          <Route path="/dana-tattoo-studio" element={<Projects danaOnly />} />
          <Route path="/projekte" element={<Projects />} />
          <Route path="/fotografie" element={<Gallery />} />
          <Route path="/ueber-mich" element={<AboutPage />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
        </Routes>
        {pagePath === "/" && <><HomeContact /><BookingDemo /></>}
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
