import { useEffect, useId, useState, useSyncExternalStore } from 'react';
import { loadRating, serverSnapshot, snapshot, subscribe, submitRating } from './ratingsStore';
import styles from './ProjectRating.module.scss';

export default function ProjectRating({ project, name, inDevelopment = false }: { project: string; name: string; inDevelopment?: boolean }) {
  // Do not mount a reader or voting controls for projects still in development.
  if (inDevelopment || project === 'fillicat') return null;
  return <RatingControls project={project} name={name} />;
}

function RatingControls({ project, name }: { project: string; name: string }) {
  const id = useId();
  const state = useSyncExternalStore(subscribe, () => snapshot(project), serverSnapshot);
  const [stars, setStars] = useState(0);
  useEffect(() => { void loadRating(project); }, [project]);
  const vote = state.rating?.myVote ?? stars;
  return (
    <div className={styles.rating} aria-label={`Projektbewertung: ${name}`}>
      <p className={styles.summary}>
        {state.state === 'loading' ? 'Bewertungen werden geladen …' : state.state === 'unavailable' ? 'Bewertungen sind derzeit nicht verfügbar.'
          : state.rating?.count ? `${state.rating.average?.toLocaleString('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 })} von 5 · ${state.rating.count} ${state.rating.count === 1 ? 'Bewertung' : 'Bewertungen'}` : 'Noch keine Bewertungen'}
      </p>
      <form onSubmit={event => { event.preventDefault(); if (stars) void submitRating(project, stars); }}>
        <fieldset disabled={state.state !== 'ready' || state.busy || Boolean(state.rating?.myVote)} className={styles.controls}>
          <legend>Wie gefällt dir dieses Projekt?</legend>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map(value => <label key={value} className={styles.star} data-filled={value <= vote}>
              <input type="radio" name={`rating-${id}`} value={value} checked={vote === value} onChange={() => setStars(value)} aria-label={`${value} ${value === 1 ? 'Stern' : 'Sterne'}`} />
              <span aria-hidden="true">{value <= vote ? '★' : '☆'}</span>
            </label>)}
          </div>
          {!state.rating?.myVote && <button type="submit" disabled={!stars}>{state.busy ? 'Wird gespeichert …' : 'Bewertung senden'}</button>}
        </fieldset>
      </form>
      {state.rating?.myVote && !state.message && <p className={styles.note}>Aus deinem Netzwerk bereits bewertet: {state.rating.myVote} von 5.</p>}
      {state.state === 'unavailable' && <button type="button" className={styles.retry} onClick={() => { void loadRating(project, true); }}>Erneut laden</button>}
      <p className={styles.note}>Bewertung des Projekts durch Websitebesucher, keine Kundenrezension. Einmal pro Projekt und Netzwerk. <a href="/datenschutz">Datenschutz</a></p>
      <p className={styles.message} role="status" aria-live="polite">{state.message}</p>
    </div>
  );
}
