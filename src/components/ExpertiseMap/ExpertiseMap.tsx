import { useId } from 'react';
import styles from './ExpertiseMap.module.scss';

type ExpertiseMapProps = {
  title: string;
  center: string;
  areas: readonly string[];
};

export default function ExpertiseMap({ title, center, areas }: ExpertiseMapProps) {
  const headingId = useId();
  const rows = Math.max(3, Math.ceil(areas.length / 2));
  const centerY = 150 / rows;

  return (
    <section className={styles.expertise} aria-labelledby={headingId}>
      <h2 id={headingId}>{title}</h2>
      <p className={styles.description}>Fachliche Ausrichtung und Weiterentwicklungsbereiche</p>
      <div className={styles.map}>
        <svg className={styles.lines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {areas.map((area, index) => (
            <line
              key={area}
              x1="50"
              y1={centerY}
              x2={Math.floor(index / 2) === 1 ? (index % 2 === 0 ? 12.5 : 87.5) : (index % 2 === 0 ? 25 : 75)}
              y2={(Math.floor(index / 2) + .5) * 100 / rows}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        <p className={styles.center} style={{ top: `${centerY}%` }}>{center}</p>
        <ul className={styles.areas} style={{ gridTemplateRows: `repeat(${rows}, minmax(4.5rem, 1fr))` }}>
          {areas.map((area, index) => (
            <li
              key={area}
              style={{
                gridColumn: Math.floor(index / 2) === 1 ? (index % 2 === 0 ? '1 / 2' : '4 / 5') : (index % 2 === 0 ? '1 / 3' : '3 / 5'),
                gridRow: Math.floor(index / 2) + 1,
              }}
            >
              {area}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
