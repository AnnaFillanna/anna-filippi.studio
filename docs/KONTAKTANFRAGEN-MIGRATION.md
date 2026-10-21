# Kontaktanfragen: vorbereitete Migration

Datei: `supabase/migrations/20261021000100_create_kontaktanfragen.sql`.
Status: laut Bestätigung der Projektinhaberin bereits manuell im Supabase SQL Editor ausgeführt. Nicht erneut auf die vorhandene Tabelle anwenden. Diese Datei dokumentiert die ursprüngliche Migration; der aktuelle Serverablauf steht in [KONTAKT-SUPABASE.md](KONTAKT-SUPABASE.md).

## Ablauf vor der Serverintegration (historisch)

`src/components/Contact/Contact.tsx` sendet JSON an `/api/contact`, mit einem `Idempotency-Key` je unverändertem Versandversuch. `src/config/contact.ts` hat aktuell `formEnabled: false`. Zusätzlich verlangt die API `CONTACT_ENABLED=true` und die erforderliche Serverkonfiguration.

`api/contact.js` prüft POST/JSON, erlaubte Origin, 16.000-Byte-Limit, Honeypot `website`, Feldtypen und Längen, entfernt äußere Leerzeichen und validiert E-Mail und Auswahlwerte. Upstash begrenzt auf fünf Versuche je IP-Hash innerhalb von zehn Minuten. Resend erhält danach die Nachricht; Erfolg wird nur mit bestätigter E-Mail-ID gemeldet. Supabase wird bisher nicht aufgerufen. `api/legal.js` ist eine unabhängige IT-Recht-/Redis-Integration und bleibt unverändert.

## Tabelle und Zugriffe

| Spalte | Herkunft / Regel |
| --- | --- |
| `id` | Automatisch generierte UUID, Primärschlüssel |
| `created_at` | Datenbankzeit, `timestamptz` |
| `status` | `neu`, `in_bearbeitung`, `erledigt`, `archiviert`; Standard `neu` |
| `name` | Pflichtfeld, 1–100 Zeichen, nicht nur Leerraum, keine Zeilenumbrüche |
| `email` | Pflichtfeld, maximal 254 Zeichen, einfache Syntaxprüfung wie in der API |
| `project` | Exakt die vier vorhandenen Formularoptionen |
| `budget` | Exakt die vorhandenen Optionen; `''` für keine Angabe |
| `message` | Pflichtfeld, 10–5.000 Zeichen, nicht nur Leerraum |

Keine Speicherung von Honeypot, IP, IP-Hash, Cookies oder erfundener Einwilligung. Die Servervalidierung bleibt maßgeblich: PostgreSQL zählt Unicode-Zeichen, JavaScript UTF-16-Codeeinheiten; SQL-Checks ersetzen die bisherigen Limits und das Trimmen nicht. PostgreSQL-Text kann keine NUL-Zeichen speichern.

RLS ist aktiviert und erzwungen. Es gibt bewusst keine erlaubenden Policies. Zusätzlich werden alle Tabellenrechte für PUBLIC, `anon` und `authenticated` entzogen. Auch angemeldete Besucher dürfen keine Datensätze lesen, erstellen, ändern oder löschen. Die Migration prüft effektive Tabellen-/Spaltenrechte dieser Rollen vor dem Commit und bricht bei unerwarteten Berechtigungen ab.

`service_role` erhält ausschließlich INSERT für die fünf Formularspalten. Die späteren Serveraufrufe dürfen weder `id`, `created_at`, `status` setzen noch `.select()` an den Insert anhängen. Bearbeitung und Löschung sind zunächst nur administrativ möglich; weitere Rechte müssen separat geplant werden. Administratoren und BYPASSRLS-Rollen sind nicht durch RLS eingeschränkt. Vorhandene privilegierte RPC-Funktionen müssen beim späteren Integrationsreview berücksichtigt werden.

## Erstinstallation in einer neuen Datenbank (nicht erneut in Production ausführen)

1. Zuerst im separaten Testprojekt ausprobieren. Vor Production Projektname und Projekt-URL kontrollieren sowie Backup-/Wiederherstellungsoptionen prüfen.
2. Im SQL Editor zunächst nur diese Vorprüfung ausführen:
   ```sql
   select to_regclass('public.kontaktanfragen') as existing_table;
   ```
   Erwartet: `NULL`. Wenn die Tabelle existiert: stoppen, Struktur und Nutzung prüfen; nichts löschen oder überschreiben.
3. Neue SQL-Abfrage öffnen und die **gesamte Migrationsdatei einschließlich BEGIN und COMMIT** einfügen. Als administrativer Projektbenutzer ausführen. Keine einzelnen markierten Ausschnitte ausführen. Die Migration verändert nur die neue Tabelle, ihren Index und ihre eigenen Rechte; keine globalen Default-Grants.
4. Bei Fehlern stoppen. Bei einer noch offenen/abgebrochenen Transaktion `ROLLBACK;` ausführen. Nicht durch Entfernen von RLS oder Rechteprüfungen „reparieren“. Die Datei ist absichtlich nicht wiederholt ausführbar: ein bestehender Tabellenname führt zum Fehler.
5. Nach Erfolg mit diesen ausschließlich lesenden Abfragen prüfen:
   ```sql
   select relrowsecurity, relforcerowsecurity
   from pg_class where oid = 'public.kontaktanfragen'::regclass;
   -- Beide Werte müssen true sein.

   select policyname from pg_policies
   where schemaname = 'public' and tablename = 'kontaktanfragen';
   -- Keine Zeilen erwartet.

   select r.role_name, p.operation,
     has_table_privilege(r.role_name, 'public.kontaktanfragen', p.operation) as allowed
   from (values ('anon'), ('authenticated')) as r(role_name)
   cross join (values ('SELECT'), ('INSERT'), ('UPDATE'), ('DELETE')) as p(operation);
   -- Alle allowed-Werte müssen false sein.

   select column_name, privilege_type
   from information_schema.column_privileges
   where table_schema = 'public' and table_name = 'kontaktanfragen'
     and grantee = 'service_role';
   -- Genau INSERT für name, email, project, budget, message erwartet.
   ```
6. Datum, Projekt und Dateiversion der manuellen Ausführung dokumentieren. Der SQL Editor trägt diese Ausführung nicht automatisch als CLI-Migration ein. Vor einem späteren `supabase db push` die Migrationshistorie gezielt abgleichen; die Datei nicht blind erneut anwenden.

## Ursprüngliche Anforderungen an die inzwischen implementierte Vercel-Anbindung

Einen separaten Serverclient innerhalb der Vercel-Funktion verwenden, mit einem ausschließlich serverseitigen Supabase Secret Key beziehungsweise Service-Role-Key. Niemals `VITE_` dafür verwenden oder den bestehenden Browserclient umfunktionieren. Der vorhandene Publishable Key darf diese Tabelle nicht beschreiben.

Die öffentliche Kontakt-API behält Validierung, Honeypot, Origin-Prüfung und Upstash-Rate-Limit; Origin allein ist keine Authentifizierung. Erst danach genau die fünf validierten, getrimmten Felder einfügen. Keine beliebigen JSON-Objekte aus dem Request in die Datenbank übernehmen.

Vor Umsetzung das Verhalten bei Teilfehlern zwischen Datenbank und Resend sowie Wiederholungen festlegen. Der bestehende E-Mail-Idempotency-Key verhindert keine doppelten Datenbankeinträge; dafür wird eine gesonderte, payloadgebundene Idempotenzstrategie benötigt. `status` ist kein E-Mail-Zustellstatus. Aufbewahrung, administrativer Zugriff und Löschprozess vor produktiver Speicherung festlegen. Nach Anwendung die echten Datenbanktypen neu generieren; die aktuelle leere Typengrundlage bleibt bis dahin unverändert.

Referenz: https://supabase.com/docs/guides/database/postgres/row-level-security
