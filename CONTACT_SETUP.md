# Kontaktformular: spätere Einrichtung

Das Formular nutzt bereits eine serverseitige Vercel-Funktion, Supabase und die Resend-HTTP-API. Es wurde kein Konto eingerichtet und keine echte Nachricht versendet. Solange die Serverkonfiguration fehlt oder `CONTACT_ENABLED` nicht `true` ist, wird keine Anfrage gespeichert oder versendet.

## 1. Resend vorbereiten

1. Einen Resend-Tarif selbst prüfen und bei Bedarf ein Konto einrichten; dabei können Kosten entstehen.
2. Eine eigene Absenderdomain in Resend hinzufügen und die dort angezeigten DNS-Einträge beim Domainanbieter setzen. Die Verifizierung abwarten.
3. Einen API-Schlüssel für den serverseitigen Einsatz erstellen und sicher verwahren. Die Empfängeradresse `annafilippi@web.de` ist nicht automatisch ein verifizierter Absender; die Absenderadresse muss zur verifizierten eigenen Domain gehören.

## 2. Vercel und bestehende Infrastruktur

Für die betreffende Umgebung unter **Project Settings → Environment Variables** setzen. Die Vorlage [.env.contact.example](.env.contact.example) enthält keine echten Schlüssel. Geheimnisse nicht committen, nicht im Browser verwenden und nicht mit `VITE_` beginnen.

| Variable | Zweck |
| --- | --- |
| `RESEND_API_KEY` | Server-Schlüssel von Resend |
| `CONTACT_EMAIL_FROM` | Verifizierte Absenderadresse |
| `CONTACT_EMAIL_TO` | Empfänger, beispielsweise `annafilippi@web.de` |
| `CONTACT_ALLOWED_ORIGINS` | Kommagetrennte erlaubte Ursprünge, für Produktion z. B. `https://annafilippi.studio` |
| `CONTACT_ENABLED` | Zunächst `false`, erst nach Prüfung bewusst auf `true` setzen |
| `SUPABASE_SECRET_KEY` | Bestehender serverseitiger Supabase-Secret-Key mit passenden INSERT-Rechten |
| `SUPABASE_URL` | Supabase-Projekt-URL; alternativ wird die bestehende `VITE_SUPABASE_URL` gelesen |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Bestehender Redis-REST-Zugang |
| `RATE_LIMIT_SECRET` | Zufälliges serverseitiges Geheimnis mit mindestens 32 Zeichen |

Die älteren Namen `CONTACT_FROM` und `CONTACT_TO` funktionieren weiterhin; wenn beide Namen gesetzt sind, haben `CONTACT_EMAIL_FROM` beziehungsweise `CONTACT_EMAIL_TO` Vorrang. Änderungen an Absender, Empfänger oder `RATE_LIMIT_SECRET` können die Wiederholung bereits begonnener Anfragen beeinflussen und sollten koordiniert werden.

Die vorhandene Tabelle `kontaktanfragen` und ihre INSERT-Berechtigungen müssen im jeweiligen Supabase-Projekt vorhanden sein. Redis wird nicht nur für fünf Anfragen pro IP in zehn Minuten genutzt, sondern auch für den separaten Freigabeschalter `contact:control:enabled` und die dauerhafte Wiedererkennung von Anfragen. Ohne diese Infrastruktur schlägt der Versand geschlossen fehl. Der Redis-Schalter muss für einen freigegebenen Betrieb durch die zuständige Person gezielt auf `true` gesetzt werden. Bestehende Redis-Zustände nicht löschen oder zurücksetzen; Details und Grenzen stehen in [KONTAKT-SUPABASE.md](docs/KONTAKT-SUPABASE.md) und [KONTAKT-NOT-AUS.md](docs/KONTAKT-NOT-AUS.md).

Für eine kleine Website ist ein externer Redis-Dienst allein für Rate-Limiting nicht zwingend. Die **bestehende** Umsetzung braucht ihn aber auch für Freigabe und Duplikatschutz. Eine Entfernung wäre eine gesonderte Architekturänderung und ist hier nicht erfolgt. Kosten, Speicherbedarf und Aufbewahrung vor Aktivierung prüfen; für Tests getrennte Infrastruktur verwenden.

## 3. Freigabe und Test

1. Datenschutz, Empfänger, Supabase-Rechte und Redis-Konfiguration prüfen. Vercel muss die Node-Funktion `/api/contact` bereitstellen; `npm run dev` allein startet nur Vite.
2. Zunächst mit deaktiviertem `CONTACT_ENABLED` und einer geschützten, getrennten Testumgebung arbeiten. Die im Code gesetzte Formularfreigabe `formEnabled` und der serverseitige Schalter sind unabhängig voneinander.
3. Nach ausdrücklicher Freigabe serverseitigen Schalter und Redis-Freigabe aktivieren und nach Änderungen der Vercel-Variablen neu deployen. Keine produktive Testnachricht ohne Zustimmung versenden.
4. Eine eigene Testanfrage senden und Supabase-Eintrag, Resend-Status und Posteingang einschließlich Spamordner prüfen. Eine Annahme durch Resend garantiert keine Zustellung.

Bei 502, 503 oder Zeitüberschreitung kann der Eingang bereits erfolgt sein. Der angebotene E-Mail-Entwurf wird nur auf eigenen Klick geöffnet und nicht automatisch versendet; vor erneutem Kontakt den Eingang prüfen. Weitere Hinweise zu Wiederholungen und unklaren Zuständen enthält [KONTAKT-SUPABASE.md](docs/KONTAKT-SUPABASE.md).
