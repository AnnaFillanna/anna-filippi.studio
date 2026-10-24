export const fillicatDetails = [
  ["Aufgabe", "Programmieren durch praktische Aufgaben und individuelles Training vermitteln."],
  ["Umsetzung", "Adaptive Übungen, automatische Code-Tests und gezielte Hilfestellungen für JavaScript und TypeScript."],
  ["Stand", "In Entwicklung. Weitere Programmiersprachen sind geplant."],
];

export const danaDetails = [
  ["Aufgabe", "Arbeiten des Studios zeigen und den Weg zur Terminanfrage vereinfachen."],
  ["Umsetzung", "Responsive Website mit Tattoo- und Piercing-Galerien, geschützter Medienverwaltung und WhatsApp-Kontakt."],
  ["Ergebnis", "Veröffentlicht auf tattoodana.de. Entwickelt mit React, TypeScript und Supabase."],
];

export const mammaDetails = [
  ["Aufgabe", "Eine individuelle Pizza-Bestellung als interaktive Anwendung erlebbar machen."],
  ["Umsetzung", "Pizza-Konfigurator mit Zutatenwahl, Preisberechnung und Warenkorb. Entwickelt mit React und TypeScript."],
  ["Demo", "Ohne Registrierung als Demo-Gast testen. Keine echte Pizzeria; alle Bestellungen sind ausschließlich Tests."],
];

export const kavroDetails = [
  ["Aufgabe", "Den digitalen Auftritt eines modernen Barber Studios mit einer unkomplizierten Terminplanung verbinden."],
  ["Umsetzung", "Responsive Studio-Website mit Serviceübersicht und interaktiver Terminbuchung."],
  ["Technologien", "Entwickelt mit React, TypeScript und React Router."],
];

export const projects = [
  {
    name: "Dana Tattoo Studio",
    category: "FULL-STACK WEBENTWICKLUNG",
    description:
      "Eine individuelle Website für ein Tattoo- und Piercingstudio – mit interaktiven Galerien und direktem Kontakt.",
    scope: "React · TypeScript · SCSS · Supabase",
    status: "Veröffentlicht · Kundenprojekt",
    imagePrefix: "dana",
    featuredCategory: "Webdesign · Webentwicklung",
    isDemo: false,
    imageExtension: "png",
    detailHref: "/dana-tattoo-studio",
    details: danaDetails,
    buttonLabel: "Projekt ansehen",
    href: "https://tattoodana.de",
  },
  {
    name: "Mamma Mia – Pizza mit Amore",
    category: "WEBENTWICKLUNG · INTERAKTIVE DEMO",
    description: "Eine interaktive Portfolio-Demo mit Pizza-Konfigurator, Warenkorb und Testbestellungen.",
    scope: "",
    status: "Portfolio-Demo · Keine echten Bestellungen",
    imagePrefix: "mamma-mia",
    featuredCategory: "Webdesign · Interaktive Demo",
    isDemo: true,
    imageExtension: "jpg",
    detailHref: "https://annafillanna.github.io/Pizzeria-Mama-Mia/#/login",
    details: mammaDetails,
    buttonLabel: "Demo ausprobieren",
    href: "https://annafillanna.github.io/Pizzeria-Mama-Mia/#/login",
  },
  {
    name: "KAVRO — Barber Studio",
    category: "WEBENTWICKLUNG · BUCHUNGSERLEBNIS",
    description: "Ein digitaler Auftritt für ein modernes Barber Studio – mit Serviceübersicht und interaktiver Terminbuchung.",
    scope: "",
    status: "Eigenes Projekt · Quellcode auf GitHub",
    imagePrefix: "kavro",
    featuredCategory: "Webdesign · Webentwicklung · Demo",
    isDemo: true,
    imageExtension: "png",
    detailHref: "https://annafillanna.github.io/kavro-barber-shop/",
    details: kavroDetails,
    buttonLabel: "Projekt ansehen",
    href: "https://annafillanna.github.io/kavro-barber-shop/",
  },
  {
    name: "FilliCat",
    category: "EDTECH / SOFTWAREENTWICKLUNG",
    description:
      "Programmieren lernen mit praktischen Aufgaben, direktem Feedback und individuellem Training.",
    scope: "",
    status: "Eigenes Projekt · In Entwicklung",
    imagePrefix: "fillicat",
    imageExtension: "png",
    detailHref: "/softwareentwicklung",
    details: fillicatDetails,
    buttonLabel: "Projekt ansehen",
    href: "https://fillicat.com",
  },
];
