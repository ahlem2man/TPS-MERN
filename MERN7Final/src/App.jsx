import React, { useEffect, useReducer, useState } from 'react';
import { projectsReducer, initialState } from './reducers/projectsReducer';
import ProjectItem from './components/ProjectItem';
import Stats from './components/Stats';
import './index.css';

function App() {
  const [state, dispatch] = useReducer(projectsReducer, initialState);
  const { projects } = state;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(''); 
  const [filterStatus, setFilterStatus] = useState('all'); 
  const [search, setSearch] = useState('');
  const [sortByDeadline, setSortByDeadline] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('projects-manager');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_PROJECTS', payload: parsed });
      } catch (e) {
        console.error('Erreur parse localStorage projects', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('projects-manager', JSON.stringify(projects));
  }, [projects]);
  const addProject = () => {
    if (!title.trim()) {
      alert('Le titre est requis');
      return;
    }
    dispatch({
      type: 'ADD_PROJECT',
      payload: {
        title: title.trim(),
        description: description.trim(),
        deadline: deadline ? new Date(deadline).toISOString() : null
      }
    });
    setTitle('');
    setDescription('');
    setDeadline('');
  };
  const filtered = projects
    .filter(p => (filterStatus === 'all' ? true : p.status === filterStatus))
    .filter(p => (search.trim() ? (
      (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase())
    ) : true));

  const sorted = [...filtered].sort((a, b) => {
    if (!sortByDeadline) return new Date(b.createdAt) - new Date(a.createdAt); 
    const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
    const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
    return da - db; 
  });
  const resetAllTimers = () => {
    dispatch({ type: 'RESET_ALL_TIMERS' });
  };

  return (
    <div style={{ maxWidth: 1000, margin: '30px auto', padding: 16 }}>
      <h1 style={{ textAlign: 'center' }}>Gestionnaire de Projets</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, marginTop: 20 }}>
        {/* Left column: form + list */}
        <div>
          {/* Form */}
          <div style={{ background: '#ecf0f1', padding: 12, borderRadius: 8, marginBottom: 12 }}>
            <h3>Ajouter un projet</h3>
            <input placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            <label style={{ display: 'block', marginBottom: 8 }}>
              Deadline
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={{ marginLeft: 8 }} />
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={addProject} style={btnPrimary}>Ajouter</button>
              <button onClick={() => { setTitle(''); setDescription(''); setDeadline(''); }} style={btnGray}>Annuler</button>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input placeholder="Rechercher titre/description..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, padding: 8 }} />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">Tous</option>
              <option value="todo">To do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="checkbox" checked={sortByDeadline} onChange={e => setSortByDeadline(e.target.checked)} />
              Trier par deadline
            </label>
          </div>

          {/* Projects list */}
          <div>
            {sorted.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#777' }}>Aucun projet</div>
            ) : (
              sorted.map(p => <ProjectItem key={p.id} project={p} dispatch={dispatch} />)
            )}
          </div>

        </div>

        {/* Right column: stats */}
        <div>
          <Stats projects={projects} />
          <div style={{ background: '#fff', padding: 12, borderRadius: 8, border: '1px solid #eee' }}>
            <h4>Actions globales</h4>
            <button onClick={resetAllTimers} style={btnGray}>Réinitialiser tous les timers</button>
            <p style={{ marginTop: 8, fontSize: 13, color: '#666' }}>Les timers Pomodoro sont indépendants par projet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const btnPrimary = {
  padding: '10px 16px',
  background: '#27ae60',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer'
};

const btnGray = {
  ...btnPrimary,
  background: '#95a5a6'
};

const inputStyle = {
  width: '100%',
  padding: 8,
  marginBottom: 8,
  borderRadius: 6,
  border: '1px solid #ddd'
};

export default App;
