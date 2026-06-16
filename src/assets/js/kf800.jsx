// Рушій сторінки KF800 (React). Контент програми — у kf800-data.js (window.__DATA__.program).
const { useState, useEffect } = React;

const program = (window.__DATA__ && window.__DATA__.program) || [];

// ============ ICONS ============
function Icon({ name, size = 16, color = 'currentColor', style = {} }) {
  const paths = {
    'chevron-down': <polyline points="6 9 12 15 18 9"/>,
    'target': <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    'alert': <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></>,
    'bulb': <><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></>,
    'settings': <><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></>,
    'external': <><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
    'dumbbell': <><path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/></>,
    'clock': <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    'chart': <><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}>
      {paths[name]}
    </svg>
  );
}

// ============ MUSCLE MAPPING ============
const MUSCLE_MAP = {
  'Груди': ['chest'],
  'Передня дельта': ['delt-front'],
  'Середня дельта': ['delt-mid'],
  'Задня дельта': ['delt-rear'],
  'Біцепс': ['biceps'],
  'Трицепс': ['triceps'],
  'Передпліччя': ['forearms'],
  'Найширша спини': ['lats'],
  'Середня спина': ['mid-back'],
  'Ромбоподібні': ['mid-back'],
  'Поперек': ['lower-back'],
  'Прямі м’язи живота': ['abs'],
  'Кор': ['abs', 'obliques'],
  'Косі м’язи': ['obliques'],
  'Ягодиці': ['glutes'],
  'Квадрицепси': ['quads'],
  'Біцепс стегна': ['hamstrings'],
  'Привідні м’язи стегна': ['adductors'],
  'Литкові м’язи': ['calves'],
  'Трапеція': ['trapezius'],
};

// ============ MUSCLE DIAGRAM ============
function MuscleDiagram({ targets, accent }) {
  const highlighted = new Set();
  targets.forEach(t => {
    const muscles = MUSCLE_MAP[t] || [];
    muscles.forEach(m => highlighted.add(m));
  });
  const fill = key => highlighted.has(key) ? accent : '#3a3a3d';
  const bodyFill = '#1d1d20';
  const bodyStroke = '#2a2a2d';

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="target" size={14} />
        Анатомія
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', background: '#0c0c0d', border: '1px solid #262629', borderRadius: 4, padding: '14px 8px 10px 8px' }}>
        {/* FRONT */}
        <div style={{ flex: 1, maxWidth: 160 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.1em', color: '#71717a', textAlign: 'center', marginBottom: 4, textTransform: 'uppercase' }}>Спереду</div>
          <svg viewBox="0 0 200 470" style={{ width: '100%', display: 'block' }}>
            <g fill={bodyFill} stroke={bodyStroke} strokeWidth="1">
              <ellipse cx="100" cy="38" rx="23" ry="28" />
              <path d="M 90,62 L 110,62 L 113,78 L 87,78 Z" />
              <path d="M 55,78 Q 100,73 145,78 L 143,140 L 140,212 L 60,212 L 57,140 Z" />
              <path d="M 60,212 L 140,212 L 137,258 L 63,258 Z" />
              <path d="M 55,80 L 42,90 L 36,170 L 30,255 Q 38,265 48,258 L 50,170 L 65,90 Z" />
              <path d="M 145,80 L 158,90 L 164,170 L 170,255 Q 162,265 152,258 L 150,170 L 135,90 Z" />
              <path d="M 63,258 L 96,258 L 92,360 L 84,455 L 65,455 L 60,360 Z" />
              <path d="M 137,258 L 104,258 L 108,360 L 116,455 L 135,455 L 140,360 Z" />
            </g>
            {/* Chest */}
            <path d="M 60,88 Q 80,82 95,92 L 95,138 Q 80,148 65,138 Z" fill={fill('chest')} />
            <path d="M 105,92 Q 120,82 140,88 L 135,138 Q 120,148 105,138 Z" fill={fill('chest')} />
            {/* Anterior deltoids */}
            <ellipse cx="55" cy="92" rx="13" ry="13" fill={fill('delt-front')} />
            <ellipse cx="145" cy="92" rx="13" ry="13" fill={fill('delt-front')} />
            {/* Lateral deltoids */}
            <ellipse cx="42" cy="100" rx="9" ry="14" fill={fill('delt-mid')} />
            <ellipse cx="158" cy="100" rx="9" ry="14" fill={fill('delt-mid')} />
            {/* Biceps */}
            <ellipse cx="42" cy="140" rx="10" ry="22" fill={fill('biceps')} />
            <ellipse cx="158" cy="140" rx="10" ry="22" fill={fill('biceps')} />
            {/* Forearms */}
            <ellipse cx="34" cy="210" rx="9" ry="32" fill={fill('forearms')} />
            <ellipse cx="166" cy="210" rx="9" ry="32" fill={fill('forearms')} />
            {/* Abs */}
            <g fill={fill('abs')}>
              <rect x="88" y="146" width="10" height="13" rx="2" />
              <rect x="102" y="146" width="10" height="13" rx="2" />
              <rect x="88" y="162" width="10" height="13" rx="2" />
              <rect x="102" y="162" width="10" height="13" rx="2" />
              <rect x="88" y="178" width="10" height="13" rx="2" />
              <rect x="102" y="178" width="10" height="13" rx="2" />
              <rect x="88" y="194" width="10" height="13" rx="2" />
              <rect x="102" y="194" width="10" height="13" rx="2" />
            </g>
            {/* Obliques */}
            <path d="M 70,150 L 86,148 L 86,206 L 70,200 Z" fill={fill('obliques')} />
            <path d="M 130,148 L 114,150 L 114,206 L 130,200 Z" fill={fill('obliques')} />
            {/* Quads */}
            <ellipse cx="78" cy="305" rx="15" ry="50" fill={fill('quads')} />
            <ellipse cx="122" cy="305" rx="15" ry="50" fill={fill('quads')} />
            {/* Adductors */}
            <path d="M 92,265 L 100,262 L 108,265 L 105,310 L 95,310 Z" fill={fill('adductors')} />
          </svg>
        </div>
        {/* BACK */}
        <div style={{ flex: 1, maxWidth: 160 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.1em', color: '#71717a', textAlign: 'center', marginBottom: 4, textTransform: 'uppercase' }}>Ззаду</div>
          <svg viewBox="0 0 200 470" style={{ width: '100%', display: 'block' }}>
            <g fill={bodyFill} stroke={bodyStroke} strokeWidth="1">
              <ellipse cx="100" cy="38" rx="23" ry="28" />
              <path d="M 90,62 L 110,62 L 113,78 L 87,78 Z" />
              <path d="M 55,78 Q 100,73 145,78 L 143,140 L 140,212 L 60,212 L 57,140 Z" />
              <path d="M 60,212 L 140,212 L 137,258 L 63,258 Z" />
              <path d="M 55,80 L 42,90 L 36,170 L 30,255 Q 38,265 48,258 L 50,170 L 65,90 Z" />
              <path d="M 145,80 L 158,90 L 164,170 L 170,255 Q 162,265 152,258 L 150,170 L 135,90 Z" />
              <path d="M 63,258 L 96,258 L 92,360 L 84,455 L 65,455 L 60,360 Z" />
              <path d="M 137,258 L 104,258 L 108,360 L 116,455 L 135,455 L 140,360 Z" />
            </g>
            {/* Trapezius */}
            <path d="M 87,78 L 113,78 L 130,92 L 100,150 L 70,92 Z" fill={fill('trapezius')} opacity="0.85" />
            {/* Posterior deltoids */}
            <ellipse cx="55" cy="95" rx="13" ry="11" fill={fill('delt-rear')} />
            <ellipse cx="145" cy="95" rx="13" ry="11" fill={fill('delt-rear')} />
            {/* Lats */}
            <path d="M 60,108 L 95,150 L 65,210 L 55,150 Z" fill={fill('lats')} />
            <path d="M 140,108 L 105,150 L 135,210 L 145,150 Z" fill={fill('lats')} />
            {/* Mid-back */}
            <rect x="91" y="100" width="18" height="55" rx="3" fill={fill('mid-back')} />
            {/* Triceps */}
            <ellipse cx="42" cy="140" rx="10" ry="22" fill={fill('triceps')} />
            <ellipse cx="158" cy="140" rx="10" ry="22" fill={fill('triceps')} />
            {/* Lower back */}
            <rect x="86" y="166" width="11" height="44" rx="2" fill={fill('lower-back')} />
            <rect x="103" y="166" width="11" height="44" rx="2" fill={fill('lower-back')} />
            {/* Glutes */}
            <ellipse cx="78" cy="240" rx="20" ry="20" fill={fill('glutes')} />
            <ellipse cx="122" cy="240" rx="20" ry="20" fill={fill('glutes')} />
            {/* Hamstrings */}
            <ellipse cx="78" cy="320" rx="14" ry="42" fill={fill('hamstrings')} />
            <ellipse cx="122" cy="320" rx="14" ry="42" fill={fill('hamstrings')} />
            {/* Calves */}
            <path d="M 67,372 Q 78,388 89,372 L 86,425 Q 78,430 70,425 Z" fill={fill('calves')} />
            <path d="M 111,372 Q 122,388 133,372 L 130,425 Q 122,430 114,425 Z" fill={fill('calves')} />
          </svg>
        </div>
      </div>
      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
        {targets.map((t, i) => (
          <span key={i} style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: accent, padding: '3px 7px', border: `1px solid ${accent}40`, background: `${accent}10`, borderRadius: 2, letterSpacing: '0.03em' }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ============ SECTION ============
function Section({ iconName, title, items, accent, danger }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: danger ? '#f87171' : accent }}>
        <Icon name={iconName} size={14} />
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{title}</span>
      </div>
      <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', fontFamily: "'Manrope', sans-serif", fontSize: 14, color: '#d4d4d8', lineHeight: 1.55 }}>
        {items.map((item, i) => (
          <li key={i} style={{ paddingLeft: 14, position: 'relative', marginBottom: 6 }}>
            <span style={{ position: 'absolute', left: 0, top: 9, width: 6, height: 1, background: danger ? '#f87171' : accent }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============ EXERCISE CARD ============
function ExerciseCard({ exercise, isOpen, onToggle, accent }) {
  return (
    <div style={{ background: '#161618', border: `1px solid ${isOpen ? accent : '#262629'}`, borderRadius: 4, marginBottom: 8, overflow: 'hidden', transition: 'border-color 0.2s' }}>
      <button onClick={onToggle} style={{ width: '100%', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#f5f5f5', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flex: 1, minWidth: 0 }}>
            {exercise.code !== '—' && (
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: accent, letterSpacing: '0.05em', flexShrink: 0 }}>{exercise.code}</span>
            )}
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, fontWeight: 600, lineHeight: 1.2 }}>{exercise.name}</span>
          </div>
          <Icon name="chevron-down" size={18} color="#a1a1aa" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
        <div style={{ display: 'flex', gap: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#a1a1aa', flexWrap: 'wrap' }}>
          <span style={{ color: '#f5f5f5' }}>{exercise.sets}</span>
          <span>{exercise.rir}</span>
          <span>відп. {exercise.rest}</span>
          <span>темпо {exercise.tempo}</span>
        </div>
      </button>
      {isOpen && (
        <div style={{ padding: '4px 16px 18px 16px', borderTop: '1px solid #262629', marginTop: 4 }}>
          <div style={{ height: 16 }} />
          <MuscleDiagram targets={exercise.targets} accent={accent} />
          <Section iconName="settings" title="Налаштування" items={exercise.setup} accent={accent} />
          <Section iconName="dumbbell" title="Виконання" items={exercise.execution} accent={accent} />
          {exercise.cues && exercise.cues.length > 0 && (
            <Section iconName="bulb" title="Ключові акценти" items={exercise.cues} accent={accent} />
          )}
          {exercise.mistakes && exercise.mistakes.length > 0 && (
            <Section iconName="alert" title="Помилки" items={exercise.mistakes} accent={accent} danger />
          )}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="external" size={14} />
              Демонстрація
            </div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 4, background: '#0c0c0d', border: '1px solid #262629' }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${exercise.videoId}?rel=0&playsinline=1`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                loading="lazy"
                title={exercise.name}
              />
            </div>
            <a href={`https://www.youtube.com/watch?v=${exercise.videoId}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 8, fontSize: 11, color: '#71717a', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.03em', textDecoration: 'none' }}>
              Відкрити на YouTube ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ APP ============
function App() {
  const [activeDayId, setActiveDayId] = useState(program[0].id);
  const [openExerciseIdx, setOpenExerciseIdx] = useState(null);
  const accent = '#5eead4';
  const activeDay = program.find(d => d.id === activeDayId);

  useEffect(() => {
    setOpenExerciseIdx(null);
  }, [activeDayId]);

  return (
    <div style={{ minHeight: '100vh', background: '#0c0c0d', color: '#f5f5f5', fontFamily: "'Manrope', sans-serif", paddingBottom: 80 }}>
      <div style={{ padding: '20px 16px 12px 16px', borderBottom: '1px solid #262629', background: '#0c0c0d' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: accent, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
          <span style={{ display: 'inline-block', width: 24, height: 1, background: accent }} />
          Програма • Upper / Lower
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, margin: 0, letterSpacing: '0.02em', lineHeight: 1 }}>KF800 / 8 ТИЖНІВ</h1>
        <div style={{ marginTop: 8, fontSize: 13, color: '#a1a1aa', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="clock" size={12} /> 3 дні / тиждень</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="chart" size={12} /> Гіпертрофія</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="target" size={12} /> 2× частота</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, padding: '12px 16px', overflowX: 'auto', background: '#0c0c0d', borderBottom: '1px solid #262629', position: 'sticky', top: 0, zIndex: 10 }}>
        {program.map(day => {
          const isActive = day.id === activeDayId;
          return (
            <button key={day.id} onClick={() => setActiveDayId(day.id)} style={{ flexShrink: 0, padding: '8px 14px', background: isActive ? accent : 'transparent', color: isActive ? '#0c0c0d' : '#d4d4d8', border: `1px solid ${isActive ? accent : '#262629'}`, borderRadius: 2, cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: '0.08em', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1, gap: 2 }}>
              <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>{day.dayShort}</span>
              <span>{day.name}</span>
            </button>
          );
        })}
      </div>
      <div style={{ padding: '20px 16px 8px 16px' }}>
        <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#a1a1aa', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{activeDay.dayFull} • {activeDay.exercises.length} вправ</div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, margin: 0, letterSpacing: '0.02em', lineHeight: 0.95 }}>{activeDay.name}</h2>
        <div style={{ color: accent, fontSize: 14, marginTop: 6, fontWeight: 500 }}>{activeDay.focus}</div>
      </div>
      <div style={{ padding: '12px 16px 32px 16px' }}>
        {activeDay.exercises.map((ex, idx) => (
          <ExerciseCard key={idx} exercise={ex} isOpen={openExerciseIdx === idx} onToggle={() => setOpenExerciseIdx(openExerciseIdx === idx ? null : idx)} accent={accent} />
        ))}
      </div>
      <div style={{ padding: '20px 16px', borderTop: '1px solid #262629', fontSize: 12, color: '#71717a', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6, letterSpacing: '0.02em' }}>
        <div style={{ marginBottom: 6 }}><span style={{ color: accent }}>RIR</span> = повторів у запасі до відмови</div>
        <div style={{ marginBottom: 6 }}><span style={{ color: accent }}>Темпо</span> = ексцентрик-пауза-концентрик (сек)</div>
        <div><span style={{ color: accent }}>Розминка</span> перед компаундами: 2 розгінні підходи 50% і 75% ваги по 5 повторів</div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
