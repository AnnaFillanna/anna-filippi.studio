import test from "node:test";
import assert from "node:assert/strict";
import { buildContactMailto } from "../src/lib/contact-mail.ts";

test("Kontakt-Mailto verwendet den Empfänger und alle Formularangaben", () => {
  const url = buildContactMailto({
    name: "Anna Beispiel",
    email: "kunde@example.org",
    project: "Software / Web-App",
    budget: "1.500–3.000 €",
    message: "Ich möchte eine individuelle Anwendung.",
  });

  assert.ok(url.startsWith("mailto:annafilippi@web.de?"));
  assert.ok(url.includes("Projektanfrage"));
  assert.ok(url.includes("Anna%20Beispiel"));
  assert.ok(url.includes("kunde%40example.org"));
  assert.ok(url.includes("Web-App"));
});

test("Kontakt-Mailto behandelt ein leeres Budget und fehlende Angaben sicher", () => {
  const url = buildContactMailto({ name: "", email: "", project: "", budget: "", message: "Test" });
  assert.ok(url.includes("Keine%20Angabe"));
  assert.ok(url.includes("Test"));
});
