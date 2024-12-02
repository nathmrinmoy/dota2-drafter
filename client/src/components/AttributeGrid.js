import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StrengthIcon, AgilityIcon, IntelligenceIcon, UniversalIcon } from '../assets/icons/AttributeIcons';

const GridContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
});

const AttributeHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  position: 'relative'
});

const AttributeLabel = styled(Typography)({
  color: '#666',
  fontSize: '12px',
  letterSpacing: '1px',
  textTransform: 'uppercase'
});

const GridSection = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(11, 40px)',
  gridTemplateRows: 'repeat(3, 65px)',
  gap: '12px',
  backgroundColor: 'transparent',
  padding: '4px',
  borderRadius: '2px',
  justifyContent: 'start'
});

const HeroSlot = styled(Box)(({ hasHero, isHighlighted, $hasHighlightedHero }) => ({
  width: '40px',
  height: '65px',
  backgroundColor: isHighlighted ? 'rgba(42, 42, 42, 0.5)' : 'transparent',
  position: 'relative',
  overflow: 'visible',
  transition: 'all 0.2s',
  cursor: hasHero ? 'pointer' : 'default',
  borderRadius: '2px',
  border: isHighlighted ? '2px solid #4CAF50' : 'none',
  transform: isHighlighted ? 'scale(1.05)' : 'none',
  zIndex: isHighlighted ? 1000 : 1,
  '&:hover': {
    backgroundColor: hasHero ? 'rgba(42, 42, 42, 0.3)' : 'transparent',
    '& .hero-tooltip': {
      opacity: hasHero ? 1 : 0
    },
    zIndex: 1000
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    opacity: $hasHighlightedHero && !isHighlighted ? 1 : 0,
    transition: 'opacity 0.2s',
    pointerEvents: 'none'
  }
}));

const HeroImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '2px',
  overflow: 'hidden'
});

const HeroTooltip = styled(Box)({
  position: 'absolute',
  bottom: '-24px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: '#fff',
  fontSize: '12px',
  padding: '4px 8px',
  textAlign: 'center',
  opacity: 0,
  transition: 'opacity 0.2s',
  whiteSpace: 'nowrap',
  borderRadius: '4px',
  zIndex: 1001
});

const IconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    width: '14px',
    height: '14px'
  }
});

function AttributeGrid({ type, onSearch, searchTerm, highlightedHeroId }) {
  const [heroes, setHeroes] = useState([]);
  const [error, setError] = useState(null);
  const { state, dispatch } = useDraftContext();

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        setError(null);
        const allHeroes = await awsServices.methods.getAllHeroes();
        const filteredHeroes = await awsServices.methods.getHeroesByAttribute(allHeroes, type);
        setHeroes(filteredHeroes);
      } catch (error) {
        console.error('Error fetching heroes:', error);
        setError(error.message);
        setHeroes([]);
      }
    };

    fetchHeroes();
  }, [type]);

  const handleKeyPress = useCallback((event) => {
    if (type !== 'STRENGTH') return;
    
    const key = event.key.toLowerCase();
    
    if (/^[a-z0-9]$/.test(key)) {
      onSearch(prev => {
        const newTerm = (prev + key).toLowerCase();
        return newTerm;
      });
    }
  }, [type, onSearch]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (error) {
    return (
      <GridContainer>
        <Typography color="error">Error: {error}</Typography>
      </GridContainer>
    );
  }

  const getAttributeIcon = () => {
    switch (type) {
      case 'STRENGTH': return <StrengthIcon />;
      case 'AGILITY': return <AgilityIcon />;
      case 'INTELLIGENCE': return <IntelligenceIcon />;
      case 'UNIVERSAL': return <UniversalIcon />;
      default: return null;
    }
  };

  const handleHeroClick = (hero) => {
    dispatch({ type: 'SET_SELECTED_HERO', payload: hero });
  };

  return (
    <GridContainer>
      <AttributeHeader>
        <IconWrapper>{getAttributeIcon()}</IconWrapper>
        <AttributeLabel>{type}</AttributeLabel>
      </AttributeHeader>
      <GridSection>
        {heroes.map(hero => (
          <HeroSlot
            key={hero.id}
            id={`hero-${hero.id}`}
            hasHero={true}
            isHighlighted={hero.id === highlightedHeroId}
            $hasHighlightedHero={highlightedHeroId !== null}
            onClick={() => handleHeroClick(hero)}
          >
            <HeroImage 
              src={hero.gridImage}
              alt={hero.name}
              loading="lazy"
            />
            <HeroTooltip className="hero-tooltip">
              {hero.name}
            </HeroTooltip>
          </HeroSlot>
        ))}
      </GridSection>
    </GridContainer>
  );
}

export default AttributeGrid; 