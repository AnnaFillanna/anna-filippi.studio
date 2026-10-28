export type Rating = { project: string; count: number; average: number | null; myVote: number | null };
type Snapshot = { state: 'loading' | 'ready' | 'unavailable'; rating?: Rating; busy?: boolean; message?: string };
const initial: Snapshot = { state: 'loading' };
const snapshots = new Map<string, Snapshot>();
const listeners = new Set<() => void>();
const requests = new Map<string, Promise<void>>();
export const serverSnapshot = () => initial;
export const snapshot = (project: string) => snapshots.get(project) ?? initial;
export function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
function publish(project: string, value: Snapshot) { snapshots.set(project, value); listeners.forEach(listener => listener()); }
function parseRating(data: unknown, project: string): Rating {
  if (!data || typeof data !== 'object') throw new Error('Invalid rating');
  const value = data as Rating;
  if (value.project !== project || !Number.isSafeInteger(value.count) || value.count < 0
    || (value.count === 0 ? value.average !== null : typeof value.average !== 'number' || !Number.isFinite(value.average) || value.average < 1 || value.average > 5)
    || (value.myVote !== null && (!Number.isInteger(value.myVote) || value.myVote < 1 || value.myVote > 5 || value.count === 0))) throw new Error('Invalid rating');
  return { project, count: value.count, average: value.average, myVote: value.myVote };
}
export function loadRating(project: string, retry = false): Promise<void> {
  const active = requests.get(project);
  if (active) return active;
  if (!retry && snapshots.has(project)) return Promise.resolve();
  const task = (async () => {
    publish(project, { state: 'loading' });
    try {
      const response = await fetch(`/api/project-ratings?project=${encodeURIComponent(project)}`, { cache: 'no-store', signal: AbortSignal.timeout(6000) });
      if (!response.ok) throw new Error('Unavailable');
      publish(project, { state: 'ready', rating: parseRating(await response.json(), project) });
    } catch { publish(project, { state: 'unavailable' }); }
  })().finally(() => requests.delete(project));
  requests.set(project, task);
  return task;
}
export async function submitRating(project: string, stars: number) {
  const current = snapshot(project);
  if (current.state !== 'ready' || current.busy || current.rating?.myVote) return;
  publish(project, { ...current, busy: true, message: 'Deine Bewertung wird gespeichert …' });
  try {
    const response = await fetch('/api/project-ratings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project, stars }), signal: AbortSignal.timeout(6000),
    });
    if (!response.ok && response.status !== 409) {
      const message = response.status === 429 ? 'Zu viele Versuche. Bitte warte 10 Minuten.' : 'Die Speicherung konnte nicht bestätigt werden. Bitte versuche es erneut.';
      publish(project, { ...current, message });
      return;
    }
    const rating = parseRating(await response.json(), project);
    if (rating.myVote === null) throw new Error('Missing vote acknowledgement');
    publish(project, { state: 'ready', rating, message: response.status === 409
      ? 'Aus deinem Netzwerk wurde dieses Projekt bereits bewertet.' : 'Vielen Dank! Deine Bewertung ist gespeichert.' });
  } catch { publish(project, { ...current, message: 'Die Speicherung konnte nicht bestätigt werden. Bitte versuche es erneut.' }); }
}
