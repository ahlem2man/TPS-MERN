export const initialState = {
  projects: []
};
export function projectsReducer(state, action) {
  switch (action.type) {
    case 'LOAD_PROJECTS':
      return { ...state, projects: action.payload };

    case 'ADD_PROJECT': {
      const newProject = {
        id: Date.now(),
        title: action.payload.title,
        description: action.payload.description,
        status: 'todo', 
        deadline: action.payload.deadline || null, 
        createdAt: new Date().toISOString(),
        timer: {
          minutes: action.payload.timerMinutes ?? 25,
          seconds: action.payload.timerSeconds ?? 0,
          isActive: false
        }
      };
      return { ...state, projects: [newProject, ...state.projects] };
    }

    case 'DELETE_PROJECT':
      return { ...state, projects: state.projects.filter(p => p.id !== action.payload) };

    case 'EDIT_PROJECT': {
      const { id, updates } = action.payload;
      return {
        ...state,
        projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
      };
    }

    case 'SET_STATUS': {
      const { id, status } = action.payload;
      return {
        ...state,
        projects: state.projects.map(p => p.id === id ? { ...p, status } : p)
      };
    }

    case 'UPDATE_PROJECT_TIMER': {
      const { id, timer } = action.payload;
      return {
        ...state,
        projects: state.projects.map(p => p.id === id ? { ...p, timer: { ...p.timer, ...timer } } : p)
      };
    }

    case 'RESET_ALL_TIMERS': {
      return {
        ...state,
        projects: state.projects.map(p => ({ ...p, timer: { minutes: 25, seconds: 0, isActive: false } }))
      };
    }

    default:
      return state;
  }
}
