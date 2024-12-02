import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDraftContext } from '../context/DraftContext';
import { teamAnalysisService } from '../services/teamAnalysisService';

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

    // Find first empty slot in ally team
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

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    };
  }, [clickTimeout]);

  const getSuggestedHeroes = () => {
    const allyHeroes = state.allyTeam.filter(hero => hero !== null);
    const enemyHeroes = state.enemyTeam.filter(hero => hero !== null);

    // If no heroes selected, return empty array
    if (allyHeroes.length === 0 && enemyHeroes.length === 0) {
      return [];
    }

    // Get all available heroes
    const availableHeroes = state.heroes.filter(hero => 
      !state.allyTeam.some(h => h?.id === hero.id) &&
      !state.enemyTeam.some(h => h?.id === hero.id)
    );

    // Count roles in current team
    const currentRoles = {
      CARRY: 0,
      SUPPORT: 0,
      INITIATOR: 0,
      DURABLE: 0,
      NUKER: 0,
      DISABLER: 0
    };

    allyHeroes.forEach(hero => {
      if (hero.roles) {
        hero.roles.forEach(role => {
          if (currentRoles.hasOwnProperty(role)) {
            currentRoles[role]++;
          }
        });
      }
    });

    return availableHeroes.map(hero => {
      let score = 50; // Start with base score

      // Role balance score (0-30 points)
      if (hero.roles) {
        hero.roles.forEach(role => {
          if (currentRoles[role] === 0) {
            score += 10; // Bonus for filling missing role
          } else if (currentRoles[role] >= 2) {
            score -= 5;  // Penalty for redundant role
          }
        });
      }

      // Pros and Cons score (0-20 points)
      if (hero.pros) {
        score += Math.min(hero.pros.length * 5, 10);
      }
      if (hero.cons) {
        score -= Math.min(hero.cons.length * 5, 10);
      }

      // Ability synergy score (0-20 points)
      if (hero.abilities) {
        const hasDisable = hero.abilities.some(ability => 
          ability.description?.toLowerCase().includes('stun') ||
          ability.description?.toLowerCase().includes('disable')
        );
        const hasEscape = hero.abilities.some(ability =>
          ability.description?.toLowerCase().includes('blink') ||
          ability.description?.toLowerCase().includes('escape')
        );
        
        if (hasDisable && currentRoles.DISABLER === 0) score += 10;
        if (hasEscape && !allyHeroes.some(h => 
          h.abilities?.some(a => 
            a.description?.toLowerCase().includes('escape')
          )
        )) score += 10;
      }

      // Small random factor (0-5 points) to break ties
      score += Math.random() * 5;

      return {
        ...hero,
        confidence: Math.min(Math.max(Math.round(score), 0), 100)
      };
    })
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
  };

  const suggestions = getSuggestedHeroes();

  if (suggestions.length === 0) {
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
              <img src={hero.fullImageUrl} alt={hero.name} />
            </HeroImage>
            <ConfidenceBar>
              {getConfidenceDots(hero.confidence).map((filled, index) => (
                <Dot key={index} filled={filled} />
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