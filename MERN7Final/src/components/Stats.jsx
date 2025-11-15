import React from 'react';
export default function Stats({ projects }) {
  const total = projects.length;
  const todo = projects.filter(p => p.status === 'todo').length;
  const doing = projects.filter(p => p.status === 'doing').length;
  const done = projects.filter(p => p.status === 'done').length;
  const max = Math.max(todo, doing, done, 1);
  const bar = (count, color) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 80 }}>{count}</div>
      <div style={{ flex: 1, background: '#ecf0f1', height: 16, borderRadius: 8 }}>
        <div style={{ width: `${(count / max) * 100}%`, height: '100%', background: color, borderRadius: 8 }} />
      </div>
    </div>
  );

  return (
    <div style={{ padding: 12, background: '#fff', borderRadius: 8, border: '1px solid #eee', marginBottom: 12 }}>
      <h4 style={{ marginTop: 0 }}>Statistiques</h4>
      <div style={{ fontSize: 14, color: '#444', marginBottom: 8 }}>
        Total projets : <strong>{total}</strong>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>To do</div>
          <div>{todo}</div>
        </div>
        {bar(todo, '#3498db')}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Doing</div>
          <div>{doing}</div>
        </div>
        {bar(doing, '#f39c12')}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Done</div>
          <div>{done}</div>
        </div>
        {bar(done, '#2ecc71')}
      </div>
    </div>
  );
}
