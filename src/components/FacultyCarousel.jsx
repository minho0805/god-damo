import { useState, useRef } from 'react';
import { faculty } from '../data/faculty';

const EASE = 'cubic-bezier(.22,.85,.25,1)';
const DUR = 460;

export default function FacultyCarousel() {
  const [idx, setIdx] = useState(0);
  const stageRef = useRef(null);

  const animate = (dir) => {
    const el = stageRef.current;
    if (!el) return;
    const fromX = dir > 0 ? 68 : -68;
    el.animate(
      [
        { transform: `translateX(${fromX}px)`, opacity: 0, filter: 'blur(3px)' },
        { transform: 'translateX(0)', opacity: 1, filter: 'blur(0)' },
      ],
      { duration: DUR, easing: EASE, fill: 'both' }
    );
  };

  const go = (next) => {
    const dir = next > idx ? 1 : -1;
    setIdx(next);
    setTimeout(() => animate(dir), 0);
  };

  const prev = () => go((idx - 1 + faculty.length) % faculty.length);
  const next = () => go((idx + 1) % faculty.length);

  const prof = faculty[idx];

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 620, overflow: 'hidden' }}>
      {/* PROFESSOR wordmark */}
      <div style={{
        position: 'absolute', top: 68, right: 32,
        fontFamily: 'var(--font-mono)', fontWeight: 700,
        fontSize: 'clamp(28px,5vw,68px)',
        letterSpacing: '.22em',
        color: 'rgba(255,255,255,.18)',
        userSelect: 'none',
      }}>
        PROFESSOR
      </div>

      {/* Index label top-left */}
      <div style={{
        position: 'absolute', top: 72, left: 32,
        fontFamily: 'var(--font-mono)', fontSize: 12, color: '#0099aa',
      }}>
        [[ 교수진 11명 · 전용 연구실 7개 ]]
      </div>

      {/* Tick indicators */}
      <div style={{ position: 'absolute', top: 72, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
        {faculty.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            style={{
              width: i === idx ? 40 : 22,
              height: 3,
              borderRadius: 2,
              border: 'none',
              cursor: 'pointer',
              background: i === idx ? '#00f5ff' : 'rgba(0,245,255,.22)',
              transition: 'width .3s, background .3s',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Stage */}
      <div ref={stageRef} style={{ position: 'absolute', inset: 0 }}>
        {/* Portrait */}
        <img
          src={prof.img}
          alt={prof.name}
          style={{
            position: 'absolute',
            left: '50%',
            top: '48%',
            transform: 'translate(-50%, -50%)',
            height: 'min(58vh, 560px)',
            maxWidth: '36vw',
            objectFit: 'contain',
            WebkitMaskImage: 'radial-gradient(120% 120% at 50% 42%, #000 52%, transparent 88%)',
            maskImage: 'radial-gradient(120% 120% at 50% 42%, #000 52%, transparent 88%)',
            filter: 'drop-shadow(0 0 50px rgba(0,245,255,.18))',
          }}
        />

        {/* Name block */}
        <div style={{
          position: 'absolute', left: 38, bottom: 74,
          background: 'rgba(4,8,15,.5)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(0,245,255,.12)',
          borderRadius: 10,
          padding: '18px 22px',
        }}>
          <div style={{ fontSize: 'clamp(28px,3vw,42px)', fontWeight: 700, color: '#f0f4f8' }}>
            :: {prof.name}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#00f5ff', letterSpacing: '.24em', marginTop: 4 }}>
            {prof.degree} · PROFESSOR
          </div>
          <div style={{ height: 1, background: 'linear-gradient(#00f5ff, transparent)', width: 200, margin: '10px 0' }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#0099aa' }}>
            {String(idx + 1).padStart(2, '0')} / {String(faculty.length).padStart(2, '0')}
          </div>
        </div>

        {/* Detail block */}
        <div style={{
          position: 'absolute', right: 38, bottom: 74,
          width: 'min(300px, 34vw)',
          background: 'rgba(4,8,15,.5)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(0,245,255,.12)',
          borderRadius: 10,
          padding: '18px 22px',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#00f5ff', letterSpacing: '.22em', marginBottom: 10 }}>
            전공분야 // RESEARCH
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'right' }}>
            {prof.fields.map((f, i) => (
              <div key={i} style={{ fontSize: 15, fontWeight: 700 }}>{f}</div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 12, opacity: .66 }}>
            {prof.room} · {prof.tel}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#00f5ff', marginTop: 4 }}>
            {prof.email}
          </div>
        </div>
      </div>

      {/* Arrow buttons */}
      <button onClick={prev} style={arrowStyle({ left: 32 })}>‹</button>
      <button onClick={next} style={arrowStyle({ right: 32 })}>›</button>
    </div>
  );
}

function arrowStyle(pos) {
  return {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 54,
    height: 54,
    borderRadius: '50%',
    border: '1px solid rgba(0,245,255,.3)',
    background: 'rgba(7,14,26,.55)',
    backdropFilter: 'blur(6px)',
    color: '#00f5ff',
    fontSize: 24,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    transition: 'all .2s',
    ...pos,
  };
}
