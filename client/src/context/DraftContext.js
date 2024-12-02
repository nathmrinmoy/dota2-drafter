import React, { createContext, useContext, useReducer, useEffect } from 'react';
import heroService from '../services/heroService';

const DraftContext = createContext();

const initialState = {
  allyTeam: Array(5).fill(null),
  enemyTeam: Array(5).fill(null),
  selectedLane: null,
  selectedPosition: null,
  selectedHero: null,
  selectedRole: 'ALL',
  heroes: [],
  loading: true,
  error: null
};

function draftReducer(state, action) {
  switch (action.type) {
    case 'SET_ALLY_HERO':
      const newAllyTeam = [...state.allyTeam];
      newAllyTeam[action.payload.position] = action.payload.hero;
      return { 
        ...state, 
        allyTeam: newAllyTeam,
      };
      
    case 'SET_ENEMY_HERO':
      const newEnemyTeam = [...state.enemyTeam];
      newEnemyTeam[action.payload.position] = action.payload.hero;
      return { 
        ...state, 
        enemyTeam: newEnemyTeam,
      };
      
    case 'SET_LANE':
      return { ...state, selectedLane: action.payload };
      
    case 'SET_SELECTED_POSITION':
      return { ...state, selectedPosition: action.payload };

    case 'SET_SELECTED_HERO':
      return { ...state, selectedHero: action.payload };

    case 'SET_HEROES':
      return {
        ...state,
        heroes: action.payload || [],
        loading: false,
        error: null
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
        heroes: []
      };

    case 'SET_ROLE':
      return {
        ...state,
        selectedRole: action.payload
      };

    default:
      return state;
  }
}

export function DraftContextProvider({ children }) {
  const [state, dispatch] = useReducer(draftReducer, initialState);

  useEffect(() => {
    let mounted = true;

    const fetchHeroes = async () => {
      try {
        // console.log('Fetching heroes...');
        const heroes = await heroService.getAllHeroes();
        console.log('Received heroes:', heroes);
        
        if (!mounted) return;

        if (Array.isArray(heroes) && heroes.length > 0) {
          console.log('Dispatching heroes:', heroes);
          dispatch({ type: 'SET_HEROES', payload: heroes });
        } else {
          console.log('No heroes found');
          dispatch({ type: 'SET_ERROR', payload: 'No heroes found' });
        }
      } catch (error) {
        console.error('Error in fetchHeroes:', error);
        if (mounted) {
          dispatch({ type: 'SET_ERROR', payload: error.message });
        }
      }
    };

    fetchHeroes();
    return () => { mounted = false; };
  }, []);

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return <div>Error: {state.error}</div>;
  }

  return (
    <DraftContext.Provider value={{ state, dispatch }}>
      {children}
    </DraftContext.Provider>
  );
}

export function useDraftContext() {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error('useDraftContext must be used within a DraftContextProvider');
  }
  return context;
} 