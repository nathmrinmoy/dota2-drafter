import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDraftContext } from '../context/DraftContext';

const Container = styled(Box)({
  backgroundColor: 'transparent',
  padding: '0px',
  borderRadius: '4px',
  minHeight: '120px',
  display: 'flex',
  flexDirection: 'column'
});

const HeroesGrid = styled(Box)({
  display: 'flex',
  gap: '12px',
  overflowX: 'auto',
  height: '120px',
  '&::-webkit-scrollbar': {
    height: '4px'
  },
  '&::-webkit-scrollbar-track': {
    background: '#1e1e1e'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#333',
    borderRadius: '0px'
  }
});

const HeroCard = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)'
  },
  '&:active': {
    transform: 'translateY(0)'
  }
});

const HeroImage = styled(Box)({
  width: '120px',
  height: '67px',
  backgroundColor: '#2a2a2a',
  borderRadius: '4px',
  overflow: 'hidden',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
});

const ConfidenceBar = styled(Box)({
  display: 'flex',
  gap: '2px',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '4px'
}), Dot = styled(Box)(({ filled }) => ({
  width: '6px',
  height: '6px',
  backgroundColor: filled ? '#4CAF50' : '#fff',
  borderRadius: '50%',
  opacity: filled ? 1 : 0.5
}));

const ConfidenceScore = styled(Typography)({
  color: '#ffff',
  fontSize: '12px',
  textAlign: 'center',
  marginTop: '4px'
});

function SuggestedHeroes() {
  const { state, dispatch } = useDraftContext();
  const [clickTimeout, setClickTimeout] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleHeroClick = (hero) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      return;
    }

    const timeout = setTimeout(() => {
      dispatch({ type: 'SET_SELECTED_HERO', payload: hero });
      setClickTimeout(null);
    }, 200);

    setClickTimeout(timeout);
  };

  const handleHeroDoubleClick = (hero) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    }

    const emptySlotIndex = state.allyTeam.findIndex(slot => slot === null);
    if (emptySlotIndex !== -1) {
      dispatch({
        type: 'SET_ALLY_HERO',
        payload: {
          position: emptySlotIndex,
          hero
        }
      });
    }
  };

  const getSuggestions = () => {
    try {
      setError(null);
      setLoading(true);

      if (!state.heroes || !state.heroes.length) {
        return [];
      }

      const availableHeroes = state.heroes.filter(hero => {
        if (!hero) return false;
        if (state.selectedRole !== 'ALL' && !hero.roles?.includes(state.selectedRole)) {
          return false;
        }
        return !state.allyTeam.some(ally => ally?.id === hero.id) &&
               !state.enemyTeam.some(enemy => enemy?.id === hero.id);
      });

      return availableHeroes.slice(0, 5).map(hero => ({
        ...hero,
        confidence: Math.floor(Math.random() * 30) + 70
      }));
    } catch (err) {
      setError('Error getting suggestions');
      console.error('Error in getSuggestions:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError(null);
    setLoading(true);
    
    try {
      const newSuggestions = getSuggestions();
      setSuggestions(newSuggestions);
    } catch (err) {
      setError('Error getting suggestions');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [state.heroes, state.allyTeam, state.enemyTeam, state.selectedRole]);

  if (loading) {
    return (
      <Container>
        <Typography color="#666">Loading suggestions...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <Container>
        <Typography 
          color="#666" 
          fontSize="13px"
          sx={{ 
            height: '88px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          Select heroes to see suggestions
        </Typography>
      </Container>
    );
  }

  const getConfidenceDots = (confidence) => {
    const totalDots = 4;
    const filledDots = Math.ceil((confidence / 100) * totalDots);
    return Array(totalDots).fill(0).map((_, i) => i < filledDots);
  };

  return (
    <Container>
      <HeroesGrid>
        {suggestions.map((hero) => (
          <HeroCard 
            key={hero.id}
            onClick={() => handleHeroClick(hero)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleHeroDoubleClick(hero);
            }}
          >
            <HeroImage>
              <img 
                src={`https://cdn.dota2.com/apps/dota2/images/heroes/${hero.name}_full.png`}
                alt={hero.localized_name}
                onError={(e) => {
                  if (e.target.src.includes('_full.png')) {
                    e.target.src = `https://cdn.dota2.com/apps/dota2/images/heroes/${hero.name}_sb.png`;
                  } else if (e.target.src.includes('_sb.png')) {
                    e.target.src = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.name}.png`;
                  }
                }}
              />
            </HeroImage>
            <ConfidenceBar>
              {getConfidenceDots(hero.confidence).map((filled, index) => (
                <Dot key={index} filled={filled.toString()} />
              ))}
            </ConfidenceBar>
            <ConfidenceScore>
              {hero.confidence}%
            </ConfidenceScore>
          </HeroCard>
        ))}
      </HeroesGrid>
    </Container>
  );
}

export default SuggestedHeroes; 