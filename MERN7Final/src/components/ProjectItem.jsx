import React, { useEffect, useState } from 'react';

export default function ProjectItem({ project, dispatch }) {

  const [minutes, setMinutes] = useState(project.timer?.minutes ?? 25);
  const [seconds, setSeconds] = useState(project.timer?.seconds ?? 0);
  const [isActive, setIsActive] = useState(project.timer?.isActive ?? false);

  useEffect(() => {
    setMinutes(project.timer?.minutes ?? 25);
    setSeconds(project.timer?.seconds ?? 0);
    setIsActive(project.timer?.isActive ?? false);
  }, [project.timer]);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prev => {
          if (prev === 0) {
            if (minutes === 0) {
            
              setIsActive(false);
            
              try { window.navigator.vibrate?.(200); } catch {}
              alert(` Timer du projet "${project.title}" terminé !`);
              return 0;
            } else {
              setMinutes(m => m - 1);
              return 59;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes]); 
  useEffect(() => {
    dispatch({
      type: 'UPDATE_PROJECT_TIMER',
      payload: {
        id: project.id,
        timer: { minutes, seconds, isActive }
      }
    });
  }, [minutes, seconds, isActive, dispatch, project.id]);

  const toggleStatus = () => {
    const next = project.status === 'todo' ? 'doing' : project.status === 'doing' ? 'done' : 'todo';
    dispatch({ type: 'SET_STATUS', payload: { id: project.id, status: next } });
  };

  const deleteProject = () => {
    if (window.confirm(`Supprimer le projet "${project.title}" ?`)) {
      dispatch({ type: 'DELETE_PROJECT', payload: project.id });
    }
  };

  const startPause = () => setIsActive(a => !a);
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  const deadlineText = project.deadline ? new Date(project.deadline).toLocaleDateString() : '—';

  return (
    <div style={{
      border: '1px solid #ddd',
      padding: 16,
      borderRadius: 8,
      marginBottom: 12,
      background: '#fff'
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0 }}>{project.title}</h3>
          <p style={{ margin: '6px 0', color: '#555' }}>{project.description}</p>
          <div style={{ fontSize: 13, color: '#666' }}>
            Statut: <strong>{project.status}</strong> — Deadline: <strong>{deadlineText}</strong>
          </div>
        </div>

        <div style={{ width: 220 }}>
          <div style={{
            background: '#34495e',
            color: 'white',
            padding: 10,
            borderRadius: 8,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={startPause} style={btnSmall}>
                {isActive ? 'Pause' : 'Start'}
              </button>
              <button onClick={resetTimer} style={btnSmallGray}>Reset</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'space-between' }}>
            <button onClick={toggleStatus} style={btnSmall}>
              Changer statut
            </button>
            <button onClick={deleteProject} style={btnSmallDanger}>Suppr</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const btnSmall = {
  padding: '8px 12px',
  borderRadius: 6,
  border: 'none',
  background: '#2ecc71',
  color: 'white',
  cursor: 'pointer'
};

const btnSmallGray = {
  ...btnSmall,
  background: '#95a5a6'
};

const btnSmallDanger = {
  ...btnSmall,
  background: '#e74c3c'
};
