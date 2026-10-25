export const fillicatDetails = [
  ["Aufgabe", "Programmieren durch praktische Aufgaben und individuelles Training vermitteln."],
  ["Funktionen", "Adaptive Übungen, automatische Code-Tests und gezielte Hilfestellungen für JavaScript und TypeScript. So können Lernende ihren Code direkt überprüfen und gezielt weiterüben."],
  ["Stand", "In Entwicklung. Weitere Programmiersprachen sind geplant."],
];

export const danaDetails = [
  ["Aufgabe", "Arbeiten des Studios zeigen und den Weg zur Terminanfrage vereinfachen."],
  ["Funktionen", "Responsive Website mit Tattoo- und Piercing-Galerien, geschützter Medienverwaltung und WhatsApp-Kontakt. Interessierte können Arbeiten ansehen und ihre Idee direkt mit dem Studio besprechen."],
  ["Stand", "Veröffentlicht auf tattoodana.de. Entwickelt mit React, TypeScript und Supabase."],
];

export const mammaDetails = [
  ["Aufgabe", "Eine individuelle Pizza-Bestellung als interaktive Anwendung erlebbar machen."],
  ["Funktionen", "Pizza-Konfigurator mit Zutatenwahl, Preisberechnung und Warenkorb. Die Demo macht den Weg von der eigenen Zusammenstellung bis zur Testbestellung nachvollziehbar. Entwickelt mit React und TypeScript."],
  ["Demo", "Ohne Registrierung als Demo-Gast testen. Keine echte Pizzeria; alle Bestellungen sind ausschließlich Tests."],
];

export const kavroDetails = [
  ["Aufgabe", "Den digitalen Auftritt eines modernen Barber Studios mit einer unkomplizierten Terminplanung verbinden."],
  ["Funktionen", "Responsive Studio-Website mit Serviceübersicht und interaktiver Terminbuchung. Besucher können Leistungen vergleichen und die Terminauswahl ausprobieren."],
  ["Technologien", "Entwickelt mit React, TypeScript und React Router."],
];

export const projects = [
  {
    name: "Dana Tattoo Studio",
    projectType: "Kundenprojekt",
    category: "FULL-STACK WEBENTWICKLUNG",
    description:
      "Website für ein Tattoo- und Piercingstudio: Arbeiten entdecken und die eigene Tattoo-Idee direkt per WhatsApp besprechen.",
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
    projectType: "Demoprojekt",
    category: "WEBENTWICKLUNG · INTERAKTIVE DEMO",
    description: "Interaktive Demo mit Pizza-Konfigurator: Zutaten auswählen, den Preis nachvollziehen und eine Testbestellung durchspielen.",
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
    projectType: "Demoprojekt",
    category: "WEBENTWICKLUNG · BUCHUNGSERLEBNIS",
    description: "Demo für ein Barber Studio mit Serviceübersicht und interaktiver Terminbuchung – vom Vergleichen der Leistungen bis zur Terminauswahl.",
    scope: "",
    status: "Eigenes Projekt · Demo · Quellcode auf GitHub",
    imagePrefix: "kavro",
    mobileImageExtension: "jpg",
    mobileImageAlt: "Barber bei der Arbeit im KAVRO Studio",
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
    projectType: "Eigenes Projekt",
    subtitle: "Adaptive Lernplattform für Programmierung",
    category: "EDTECH / SOFTWAREENTWICKLUNG",
    description:
      "Programmieren lernen mit praktischen Aufgaben: Code ausprobieren, direktes Feedback erhalten und gezielt weiterüben.",
    scope: "",
    status: "Eigenes Projekt · In Entwicklung",
    imagePrefix: "fillicat",
    isDemo: false,
    imageExtension: "png",
    detailHref: "/softwareentwicklung",
    details: fillicatDetails,
    buttonLabel: "Projekt ansehen",
    href: "https://fillicat.com",
  },
];
