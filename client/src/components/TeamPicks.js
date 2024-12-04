import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDraftContext } from '../context/DraftContext';
import AddHeroModal from './AddHeroModal';

const TeamContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  width: '100%',
  justifyContent: team => team === 'ally' ? 'flex-start' : 'flex-end',
  userSelect: 'none'
});

const TeamTitle = styled(Typography)(({ team }) => ({
  color: '#fff',
  fontSize: '14px',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  order: team === 'ally' ? 0 : 2,
  fontFamily: '"Island Moments", cursive',
  textShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
}));

const HeroesContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
  order: 1
});

const HeroSlot = styled(Box)(({ team }) => ({
  width: '108px',
  height: '60px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(8px)',
  cursor: 'pointer',
  overflow: 'hidden',
  transform: `skew(${team === 'enemy' ? '15deg' : '-15deg'})`,
  position: 'relative',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '& .add-text': {
      color: '#fff'
    }
  }
}));

const HeroImage = styled('img')(({ team }) => ({
  width: '120%',
  height: '100%',
  objectFit: 'cover',
  transform: `skew(${team === 'enemy' ? '-15deg' : '15deg'})`,
  marginLeft: '-10%'
}));

const TeamPicksContainer = styled(Box)({
  display: 'flex',
  gap: '12px'
});

const HeroPick = styled(Box)({
  width: '120px',
  height: '68px',
  backgroundColor: '#1A1A1A',
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
});

const VSImage = styled('img')({
  width: '48px',
  height: '48px',
  margin: '0 12px',
  filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
});

const AddText = styled(Typography)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: team => `translate(-50%, -50%) skew(${team === 'enemy' ? '-15deg' : '15deg'})`,
  color: '#666',
  fontSize: '14px',
  transition: 'color 0.2s'
});

const VSContainer = styled(Box)({
  width: '60px',
  height: '60px',
  position: 'relative',
  margin: '0 20px'
});

const Container = styled(Box)({
  margin: '0 20px'
});

function TeamPicks({ team, picks }) {
  const { dispatch } = useDraftContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [clickTimeout, setClickTimeout] = useState(null);

  const handleClick = (index, hero) => {
    if (clickTimeout) {
      // Double click detected
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      if (hero) {
        dispatch({
          type: team === 'ally' ? 'SET_ALLY_HERO' : 'SET_ENEMY_HERO',
          payload: { position: index, hero: null }
        });
      }
    } else {
      // First click - wait for potential second click
      setClickTimeout(
        setTimeout(() => {
          setClickTimeout(null);
          setSelectedPosition(index);
          setModalOpen(true);
        }, 250)  // 250ms window for double click
      );
    }
  };

  return (
    <Container>
      <AddHeroModal 
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        team={team}
        position={selectedPosition}
      />
      <TeamContainer team={team}>
        <TeamTitle team={team}>
          {team === 'ally' ? 'ALLY' : 'ENEMY'}
        </TeamTitle>
        <HeroesContainer>
          {picks.map((hero, index) => (
            <HeroSlot 
              key={index} 
              team={team}
              onClick={() => handleClick(index, hero)}
            >
              {hero ? (
                <HeroImage 
                  team={team}
                  src={hero.iconUrl} 
                  alt={hero.name} 
                />
              ) : (
                <AddText className="add-text" team={team}>
                  + ADD
                </AddText>
              )}
            </HeroSlot>
          ))}
        </HeroesContainer>
      </TeamContainer>
    </Container>
  );
}

export default TeamPicks; 