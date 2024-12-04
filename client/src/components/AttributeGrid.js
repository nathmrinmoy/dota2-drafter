import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDraftContext } from '../context/DraftContext';
import { StrengthIcon, AgilityIcon, IntelligenceIcon, UniversalIcon } from '../assets/icons/AttributeIcons';

const GridContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  alignItems: 'center',
  width: 'auto',
  margin: '0 auto',
  maxWidth: '100%',
  position: 'relative',
  overflow: 'visible'
});

const AttributeHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  width: '100%',
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
  gridAutoRows: '65px',
  gap: '12px',
  backgroundColor: 'transparent',
  padding: '4px',
  borderRadius: '2px',
  width: 'fit-content',
  height: 'auto',
  margin: '0 auto',
  position: 'relative',
  overflow: 'visible'
});

const HeroCard = styled(Box)(({ isHighlighted, hasHighlightedHero }) => ({
  position: 'relative',
  cursor: 'pointer',
  width: '40px',
  height: '65px',
  opacity: hasHighlightedHero && !isHighlighted ? 0.2 : 1,
  transition: 'opacity 0.2s, transform 0.2s',
  transform: isHighlighted ? 'scale(1.1)' : 'none',
  '&:hover': {
    zIndex: 10000,
    '& .hero-tooltip': {
      opacity: 1,
      visibility: 'visible'
    }
  }
}));

const HeroImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '2px',
  overflow: 'hidden',
  '&.loading': {
    backgroundColor: '#1e1e1e',
    animation: 'pulse 1.5s infinite'
  }
});

const HeroTooltip = styled(Box)({
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  padding: '8px 12px',
  borderRadius: '4px',
  zIndex: 10001,
  opacity: 0,
  visibility: 'hidden',
  transition: 'opacity 0.2s, visibility 0.2s',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  pointerEvents: 'none',
  minWidth: 'max-content',
  '& .hero-name': {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  '& .confidence': {
    color: '#999',
    fontSize: '12px',
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    whiteSpace: 'nowrap'
  },
  '& .confidence-label': {
    color: '#666',
    fontSize: '12px',
    textTransform: 'uppercase',
    marginRight: '4px'
  }
});

const IconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    width: '14px',
    height: '14px'
  }
});

const EmptySlot = styled(Box)({
  width: '40px',
  height: '65px',
  backgroundColor: 'transparent',
  minWidth: '40px'
});

const ContentWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '100%',
  overflow: 'visible'
});

const displayNameMap = {
  'zuus': 'Zeus',
  'wisp': 'IO',
  'rattletrap': 'Clockwork',
  'furion': "Nature's Prophet",
  'shredder': 'Timbersaw',
  'abyssal_underlord': 'Underlord',
  'skeleton_king': 'Wraith King',
  // Add any other name mappings here
};

function AttributeGrid({ type, searchTerm, highlightedHeroId }) {
  const [heroes, setHeroes] = useState([]);
  const [error, setError] = useState(null);
  const { state, dispatch } = useDraftContext();

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        setError(null);
        
        const filteredHeroes = state.heroes.filter(hero => {
          const attr = hero.primary_attr;
          return (() => {
            switch(type) {
              case 'STRENGTH': return attr === 'str';
              case 'AGILITY': return attr === 'agi';
              case 'INTELLIGENCE': return attr === 'int';
              case 'UNIVERSAL': return attr === 'all';
              default: return false;
            }
          })();
        });
        
        setHeroes(filteredHeroes);
      } catch (error) {
        console.error('Error in AttributeGrid:', error);
        setError(error.message);
      }
    };

    fetchHeroes();
  }, [type, state.heroes]);

  if (error) {
    return (
      <GridContainer>
        <Typography 
          color="error" 
          sx={{ 
            color: 'Mark'
          }}
        >
          Error: {error}
        </Typography>
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
    <ContentWrapper>
      <GridContainer>
        <AttributeHeader>
          <IconWrapper>{getAttributeIcon()}</IconWrapper>
          <AttributeLabel>{type}</AttributeLabel>
        </AttributeHeader>
        <GridSection>
          {heroes.map((hero, index) => (
            <HeroCard
              key={hero.id}
              id={`hero-${hero.id}`}
              isHighlighted={Array.isArray(highlightedHeroId) ? 
                highlightedHeroId.includes(hero.id) : 
                hero.id === highlightedHeroId}
              hasHighlightedHero={highlightedHeroId !== null}
              sx={{
                border: hero.id === highlightedHeroId ? '2px solid #4CAF50' : 'none'
              }}
              onClick={() => handleHeroClick(hero)}
            >
              <HeroImage 
                src={hero.gridImage}
                alt={hero.name}
                loading="lazy"
              />
              <HeroTooltip className="hero-tooltip">
                <Typography className="hero-name">
                  {hero.localized_name}
                </Typography>
                <Typography className="confidence">
                  <span className="confidence-label">Confidence Score:</span>
                  <span>{hero.confidence}%</span>
                </Typography>
              </HeroTooltip>
            </HeroCard>
          ))}
          {[...Array(Math.max(0, 33 - heroes.length))].map((_, index) => (
            <EmptySlot key={`empty-${index}`} />
          ))}
        </GridSection>
      </GridContainer>
    </ContentWrapper>
  );
}

export default AttributeGrid; 