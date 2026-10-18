import { useRef, useState } from "react";
import { MotionConfig } from "motion/react";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import Gallery from "./components/Gallery/Gallery";
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
  const dialog = useRef<HTMLDialogElement>(null);
  const [topic, setTopic] = useState<InfoTopic>("Kontakt");
  const openInfo = (value: InfoTopic) => {
    setTopic(value);
    dialog.current?.showModal();
  };
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#inhalt">
        Zum Inhalt springen
      </a>
      <Header />
      <main id="inhalt">
        <Hero />
        <Services onInfo={openInfo} />
        <Gallery />
        <About />
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
