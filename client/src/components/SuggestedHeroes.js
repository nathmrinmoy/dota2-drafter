import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDraftContext } from '../context/DraftContext';
import { awsWrapper } from '../../../backend/config/aws-wrapper';

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

  const getSuggestions = async () => {
    try {
      const suggestions = await awsWrapper.callService(
        'SuggestedHeroes',
        'getSuggestions',
        {
          allyTeam: state.allyTeam,
          enemyTeam: state.enemyTeam,
          userPreferences: currentUser.preferences
        }
      );

      // Track suggestions in batch
      await awsWrapper.batchCall(
        suggestions.map(suggestion => ({
          component: 'SuggestedHeroes',
          method: 'trackSuggestionAccuracy',
          args: [suggestion.id]
        }))
      );

      return suggestions;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      // Show user-friendly error message
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Unable to load suggestions. Please try again.' 
      });
      return [];
    }
  };

  const suggestions = getSuggestions();

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