# Supabase-Grundlage

Der Client liegt in `src/lib/supabase/client.ts`. Nutzung in zukünftigen Datenzugriffen:

```ts
import { getSupabase } from './lib/supabase/client';
const supabase = getSupabase();
```

Der Singleton wird erst beim ersten Aufruf erzeugt. Bestehende Komponenten importieren ihn noch nicht. Es gibt keine neuen Datenabfragen, Cookies, Auth-Weiterleitungen oder persistenten Sessions. Der statische Vite/SSR-Build benötigt deshalb noch keine Supabase-Verbindung. Bei einer späteren Auth-Integration müssen Session-Verhalten und Datenschutz bewusst konfiguriert werden.

## Konfiguration

Vite liest `VITE_SUPABASE_URL` und `VITE_SUPABASE_PUBLISHABLE_KEY` aus der vorhandenen `.env.local` im Projektverzeichnis. Eine env-Datei in einem Komponentenordner wird nicht benötigt. Werte wurden nicht verändert. Der Client validiert HTTPS-Projekt-URL und `sb_publishable_`-Format ohne Werte zu protokollieren. Das validiert die Konfiguration, nicht die serverseitige Gültigkeit des Schlüssels.

In Vercel unter Project → Settings → Environment Variables dieselben beiden Variablen mit den vorhandenen Werten hinterlegen. Production und die gewünschten Preview/Development-Umgebungen auswählen; für Preview möglichst ein separates Testprojekt verwenden. Danach einen neuen Build/Deployment auslösen, da Vite die Werte zur Build-Zeit einbindet. Bestehende Resend-, Redis- und IT-Recht-Variablen beibehalten. Keine Änderungen an vercel.json nötig. Es wurde kein Deployment durchgeführt.

`VITE_`-Variablen sind öffentlich. Nur der Publishable Key gehört hierhin, niemals Passwort, Secret Key oder Service-Role-Key. Eine Laufzeitprüfung kann einen versehentlich ins Frontend eingebauten geheimen Wert nicht vor der Offenlegung schützen. Daher vor jedem Deployment auch die Umgebungskonfiguration prüfen.

## Datenbanktypen und nächste Schritte

`database.types.ts` ist ein absichtlich leeres Schema als technische Grundlage, keine aus dem Projekt gelesene Datenbankdefinition. Es wurden keine Tabellen oder Rechte geändert und keine SQL-Befehle ausgeführt.

1. Benötigte Daten, Beziehungen und Zugriffe je Rolle festlegen (öffentlich, angemeldet, Eigentümer, Administration).
2. Eine versionierte Migration vorbereiten: Tabellen und Constraints, RLS auf allen API-exponierten Tabellen, minimale Grants und explizite Policies. Keine pauschale öffentliche Schreibfreigabe.
3. Zuerst in einer getrennten Testumgebung prüfen: anonyme Nutzer, Eigentümer und fremde Nutzer; unerlaubte Lese-/Schreibzugriffe müssen scheitern.
4. Nach Freigabe Migration anwenden und TypeScript-Typen über das Supabase-Dashboard oder die CLI generieren. Damit `src/lib/supabase/database.types.ts` ersetzen; anschließend typisierte Abfragen implementieren.

Offizielle Dokumentation:
- https://supabase.com/docs/reference/javascript/initializing
- https://supabase.com/docs/guides/api/rest/generating-types
- https://supabase.com/docs/guides/database/postgres/row-level-security

Kontaktversand bleibt bei Resend und Upstash; die Rechtstext-API behält Redis. Supabase ersetzt keine bestehende Integration.
