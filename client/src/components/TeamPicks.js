import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDraftContext } from '../context/DraftContext';
import HeroSelectionModal from './HeroSelectionModal';

const TeamContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '20px'
});

const TeamTitle = styled(Typography)(({ team }) => ({
  color: '#fff',
  fontSize: '12px',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  order: team === 'ally' ? 0 : 2
}));

const HeroesContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
  order: 1
});

const HeroSlotWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  width: '108px',
  position: 'relative',
  zIndex: 1,
  '&:hover': {
    zIndex: 2,
    '& .hero-label': {
      visibility: 'visible',
      transform: 'translateY(0)',
      opacity: 1
    }
  }
});

const HeroSlot = styled(Box)(({ borderColor, team }) => ({
  position: 'relative',
  width: '108px',
  height: '60px',
  backgroundColor: '#1e1e1e',
  cursor: 'pointer',
  overflow: 'hidden',
  transform: `skew(${team === 'enemy' ? '15deg' : '-15deg'})`,
  '&:hover': {
    backgroundColor: '#262626'
  }
}));

const HeroImage = styled('img')(({ team }) => ({
  width: '120%',
  height: '100%',
  objectFit: 'cover',
  transform: `skew(${team === 'enemy' ? '-15deg' : '15deg'})`,
  marginLeft: '-10%',
  marginRight: '-10%',
  position: 'relative',
  left: '0',
  display: 'block'
}));

const HeroLabel = styled(Typography)({
  fontSize: '12px',
  color: '#fff',
  textAlign: 'center',
  position: 'absolute',
  top: '100%',
  left: 0,
  width: '100%',
  padding: '4px',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  transition: 'all 0.2s ease',
  opacity: 0,
  visibility: 'hidden',
  transform: 'translateY(-10px)',
  className: 'hero-label',
  zIndex: 10
});

const EmptySlotText = styled(Typography)(({ team }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: `translate(-50%, -50%) skew(${team === 'enemy' ? '-15deg' : '15deg'})`,
  color: '#fff',
  fontSize: '12px',
  textTransform: 'uppercase'
}));

// These colors should match the design exactly
const teamColors = [
  '#FF1493', // Bright pink
  '#32CD32', // Lime green
  '#FF8C00', // Dark orange
  '#9370DB', // Medium purple
  '#00CED1'  // Dark turquoise
];

function TeamPicks({ team, picks }) {
  const { state, dispatch } = useDraftContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [clickTimeout, setClickTimeout] = useState(null);

  const handleHeroSelect = (position) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      return;
    }

    const timeout = setTimeout(() => {
      dispatch({ type: 'SET_SELECTED_POSITION', payload: position });
      setModalOpen(true);
      setClickTimeout(null);
    }, 200);

    setClickTimeout(timeout);
  };

  const handleHeroDoubleClick = (position, hero) => {
    if (!hero) return;

    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    }

    dispatch({
      type: team === 'ally' ? 'SET_ALLY_HERO' : 'SET_ENEMY_HERO',
      payload: {
        position,
        hero: null
      }
    });

    if (state.selectedHero?.id === hero.id) {
      dispatch({ type: 'SET_SELECTED_HERO', payload: null });
    }
  };

  React.useEffect(() => {
    return () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    };
  }, [clickTimeout]);

  return (
    <TeamContainer>
      <TeamTitle team={team}>
        {team === 'ally' ? 'ALLY' : 'ENEMY'}
      </TeamTitle>
      <HeroesContainer>
        {picks.map((hero, index) => (
          <HeroSlotWrapper key={index}>
            <HeroSlot
              team={team}
              onClick={() => handleHeroSelect(index)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleHeroDoubleClick(index, hero);
              }}
            >
              {hero ? (
                <HeroImage 
                  team={team}
                  src={hero.iconUrl} 
                  alt={hero.name} 
                />
              ) : (
                <EmptySlotText team={team}>+ ADD</EmptySlotText>
              )}
            </HeroSlot>
            {hero && (
              <HeroLabel>
                {hero.name}
              </HeroLabel>
            )}
          </HeroSlotWrapper>
        ))}
      </HeroesContainer>
      <HeroSelectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        team={team}
      />
    </TeamContainer>
  );
}

export default TeamPicks; 