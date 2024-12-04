import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { useDraftContext } from '../context/DraftContext';

const ModalOverlay = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999
});

const ModalContent = styled(Box)({
  backgroundColor: 'rgba(23, 25, 33, 0.9)',
  borderRadius: '12px',
  width: '1200px',
  height: '800px',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'relative'
});

const HeaderSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '24px'
});

const CloseButton = styled(IconButton)({
  color: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
});

const SearchBar = styled(TextField)({
  '& .MuiInputBase-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    color: '#fff',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)'
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  '& .MuiInputBase-input': {
    padding: '12px 16px'
  }
});

const HeroGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
  gap: '16px',
  overflowY: 'auto',
  padding: '8px',
  height: '100%',
  '&::-webkit-scrollbar': {
    width: '4px'
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '2px'
  },
  '&::-webkit-scrollbar-button': {
    display: 'none'
  }
});

const HeroCard = styled(Box)({
  width: '80px',
  height: '120px',
  position: 'relative',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)'
  }
});

const HeroImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '8px'
});

const HeroName = styled(Typography)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '8px',
  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
  color: '#fff',
  fontSize: '12px',
  textAlign: 'center',
  borderRadius: '0 0 8px 8px'
});

function AddHeroModal({ open, onClose, team, position }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { state, dispatch } = useDraftContext();
  const [filteredHeroes, setFilteredHeroes] = useState([]);

  useEffect(() => {
    if (!open) {
      setSearchTerm('');
    }
  }, [open]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = state.heroes.filter(hero => 
        hero.localized_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHeroes(filtered.sort((a, b) => 
        a.localized_name.localeCompare(b.localized_name)
      ));
    } else {
      setFilteredHeroes([...state.heroes].sort((a, b) => 
        a.localized_name.localeCompare(b.localized_name)
      ));
    }
  }, [searchTerm, state.heroes]);

  const handleHeroSelect = (hero) => {
    dispatch({
      type: team === 'ally' ? 'SET_ALLY_HERO' : 'SET_ENEMY_HERO',
      payload: {
        position,
        hero
      }
    });
    onClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  if (!open) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <HeaderSection>
          <SearchBar
            fullWidth
            placeholder="Search heroes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <CloseButton onClick={handleClose}>
            <CloseIcon />
          </CloseButton>
        </HeaderSection>
        <HeroGrid>
          {filteredHeroes.map(hero => (
            <HeroCard key={hero.id} onClick={() => handleHeroSelect(hero)}>
              <HeroImage src={hero.gridImage} alt={hero.localized_name} />
              <HeroName>{hero.localized_name}</HeroName>
            </HeroCard>
          ))}
        </HeroGrid>
      </ModalContent>
    </ModalOverlay>
  );
}

export default AddHeroModal; 