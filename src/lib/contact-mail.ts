export type ContactMailData = {
  name?: unknown;
  email?: unknown;
  project?: unknown;
  budget?: unknown;
  message?: unknown;
};

export function buildContactMailto(data: ContactMailData) {
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const project = typeof data.project === "string" ? data.project.trim() : "";
  const budget = typeof data.budget === "string" && data.budget.trim()
    ? data.budget.trim()
    : "Keine Angabe";
  const message = typeof data.message === "string" ? data.message.trim() : "";

  const subject = `Projektanfrage · ${project || "Neue Anfrage"}`;
  const body = [
    `Name: ${name}`,
    `E-Mail: ${email}`,
    `Projekt: ${project || "Keine Angabe"}`,
    `Budget: ${budget}`,
    "",
    message,
  ].join("\n");

  return `mailto:annafilippi@web.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
