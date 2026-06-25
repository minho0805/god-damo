import { courses, competencies, yearMeta } from '../data/curriculum';

const TYPE_COLOR = {
  lec:  '#66FF99',
  both: '#00C853',
  lab:  '#00A63E',
};

function Chip({ course }) {
  const color = TYPE_COLOR[course.type];
  return (
    <span style={{
      display: 'inline-block',
      border: `1px solid ${color}`,
      color,
      background: 'rgba(255,255,255,.03)',
      borderRadius: 4,
      padding: '3px 9px',
      fontSize: 12,
      fontFamily: 'var(--font-mono)',
      margin: '3px 4px 3px 0',
      letterSpacing: '.04em',
    }}>
      {course.ko}
    </span>
  );
}

// Keyed by year in Page2 — CSS `approach` animation re-runs on each key change
export default function CurriculumTable({ year }) {
  const meta = yearMeta[year - 1];
  const s1 = `${year}-1`;
  const s2 = `${year}-2`;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 32px 40px',
      animation: 'approach .55s cubic-bezier(.2,.8,.2,1) both',
      pointerEvents: 'none',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(0,200,83,0.65)', letterSpacing: '.22em', marginBottom: 6 }}>
          0{year} / 04 · {meta.en}
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: meta.color }}>
          {meta.label} 커리큘럼
        </div>
      </div>

      {/* Table */}
      <div style={{
        width: '100%',
        maxWidth: 820,
        border: '1px solid rgba(0,200,83,.1)',
        borderRadius: 6,
        overflow: 'hidden',
        background: 'rgba(2,8,5,.75)',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '230px 1fr 1fr',
          borderBottom: '1px solid rgba(0,200,83,.1)',
        }}>
          <div style={thStyle}>전공역량</div>
          <div style={{ ...thStyle, borderLeft: '1px solid rgba(0,200,83,.08)' }}>{year}학년 1학기</div>
          <div style={{ ...thStyle, borderLeft: '1px solid rgba(0,200,83,.08)' }}>{year}학년 2학기</div>
        </div>

        {competencies.map((comp) => {
          const c1 = courses.filter(c => c.comp === comp.id && c.sem === s1);
          const c2 = courses.filter(c => c.comp === comp.id && c.sem === s2);
          return (
            <div key={comp.id} style={{
              display: 'grid',
              gridTemplateColumns: '230px 1fr 1fr',
              borderBottom: '1px solid rgba(0,200,83,.06)',
            }}>
              <div style={{ padding: '14px 16px', borderLeft: `3px solid ${comp.color}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: comp.color }}>{comp.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(0,200,83,0.65)', letterSpacing: '.12em', marginTop: 3 }}>{comp.en}</div>
              </div>
              <div style={{ padding: '12px 14px', borderLeft: '1px solid rgba(0,200,83,.06)' }}>
                {c1.length > 0 ? c1.map((c, i) => <Chip key={i} course={c} />) : <span style={{ opacity: .25, fontSize: 12 }}>—</span>}
              </div>
              <div style={{ padding: '12px 14px', borderLeft: '1px solid rgba(0,200,83,.06)' }}>
                {c2.length > 0 ? c2.map((c, i) => <Chip key={i} course={c} />) : <span style={{ opacity: .25, fontSize: 12 }}>—</span>}
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: 16, fontSize: 13, opacity: .6, maxWidth: 600, textAlign: 'center', lineHeight: 1.7 }}>
        {meta.why}
      </p>
    </div>
  );
}

const thStyle = {
  padding: '10px 16px',
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: 'rgba(0,200,83,0.65)',
  letterSpacing: '.16em',
  background: 'rgba(0,200,83,.03)',
};
