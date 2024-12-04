import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDraftContext } from '../context/DraftContext';

const Container = styled(Box)({
  backgroundColor: '#141619',
  color: '#fff',
  width: '350px',
  height: '700px',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  userSelect: 'none'
});

const EmptyStateContainer = styled(Container)({
  justifyContent: 'center',
  alignItems: 'center',
  padding: '16px'
});

const TopSection = styled(Box)({
  height: '160px',
  position: 'relative'
});

const ImageContainer = styled(Box)({
  width: '100%',
  height: '100%',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
});

const ImageOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: '16px'
});

const HeroName = styled(Typography)({
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
});

const TagsContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
  flexWrap: 'nowrap',
  overflow: 'hidden'
});

const RoleChip = styled(Chip)({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#fff',
  flexShrink: 0,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.4)'
  }
});

const ProConSection = styled(Box)({
  padding: '16px',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  overflow: 'auto',
  paddingRight: '20px',
  '&:hover': {
    paddingRight: '16px'
  },
  '&::-webkit-scrollbar': {
    width: '4px',
    display: 'none'
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
  },
  '&:hover::-webkit-scrollbar': {
    display: 'block'
  }
});

const ButtonSection = styled(Box)({
  padding: '16px',
  marginTop: 'auto',
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
  position: 'sticky',
  bottom: 0,
  backgroundColor: '#141619',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
});

const ActionButton = styled(Box)(({ color }) => ({
  width: '50%',
  padding: '12px',
  backgroundColor: color,
  color: '#fff',
  textAlign: 'center',
  borderRadius: '4px',
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.9
  }
}));

const HeroImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '4px',
  backgroundColor: '#1e1e1e',
  '&.loading': {
    backgroundColor: '#1e1e1e',
    animation: 'pulse 1.5s infinite'
  }
});

const DetailsContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
});

const HeroImageSection = styled(Box)({
  height: '200px',
  width: '100%',
  position: 'relative'
});

const MatchupSection = styled(Box)({
  flex: 1,
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
});

const HeroMatchup = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '& img': {
    width: '32px',
    height: '32px',
    borderRadius: '4px'
  }
});

const SectionTitle = styled(Typography)({
  color: '#999',
  fontSize: '14px',
  textTransform: 'uppercase',
  marginBottom: '12px',
  letterSpacing: '1px'
});

const AdvantageList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
});

const AdvantageItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '4px',
  '& img': {
    width: '24px',
    height: '24px',
    borderRadius: '2px'
  }
});

function HeroDetails({ selectedHero }) {
  const { state, dispatch } = useDraftContext();
  const containerRef = useRef(null);
  const [visibleRoles, setVisibleRoles] = useState([]);

  useEffect(() => {
    if (selectedHero && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const chipWidth = 70;
      const maxChips = Math.floor(containerWidth / chipWidth);
      setVisibleRoles(selectedHero.roles.slice(0, maxChips));
    }
  }, [selectedHero]);

  const handleTeamAdd = (team) => {
    const teamArray = team === 'ally' ? state.allyTeam : state.enemyTeam;
    const emptySlotIndex = teamArray.findIndex(slot => slot === null);
    
    if (emptySlotIndex !== -1) {
      dispatch({
        type: team === 'ally' ? 'SET_ALLY_HERO' : 'SET_ENEMY_HERO',
        payload: {
          position: emptySlotIndex,
          hero: selectedHero
        }
      });
    }
  };

  const getHeroAdvantages = () => {
    return {
      pros: [
        { hero: 'crystal_maiden', reason: 'Strong against low mobility' },
        { hero: 'drow_ranger', reason: 'Can easily close gap' },
        { hero: 'sniper', reason: 'High burst damage' }
      ],
      cons: [
        { hero: 'axe', reason: 'Vulnerable to disables' },
        { hero: 'lion', reason: 'Weak against burst damage' },
        { hero: 'lina', reason: 'Poor early game' }
      ]
    };
  };

  if (!selectedHero) {
    return (
      <EmptyStateContainer>
        <Typography variant="h8" color="textSecondary">
          Select a hero to view details
        </Typography>
      </EmptyStateContainer>
    );
  }

  return (
    <Container>
      <TopSection>
        <ImageContainer>
          <HeroImage 
            src={selectedHero.fullImageUrl}
            alt={selectedHero.localized_name}
            loading="lazy"
            onError={(e) => {
              if (e.target.src.includes('_full.jpg')) {
                e.target.src = selectedHero.gridImage;
              }
            }}
          />
        </ImageContainer>
        <ImageOverlay>
          <HeroName>{selectedHero.localized_name}</HeroName>
          <TagsContainer ref={containerRef}>
            {visibleRoles.map(role => (
              <RoleChip 
                key={role} 
                label={role}
                size="small"
              />
            ))}
          </TagsContainer>
        </ImageOverlay>
      </TopSection>

      <ProConSection>
        <Box>
          <SectionTitle>Strong Against</SectionTitle>
          <AdvantageList>
            {getHeroAdvantages().pros.map((advantage, index) => (
              <AdvantageItem key={index}>
                <img 
                  src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${advantage.hero}.png`}
                  alt={advantage.hero}
                />
                <Typography>{advantage.reason}</Typography>
              </AdvantageItem>
            ))}
          </AdvantageList>
        </Box>

        <Box>
          <SectionTitle>Weak Against</SectionTitle>
          <AdvantageList>
            {getHeroAdvantages().cons.map((disadvantage, index) => (
              <AdvantageItem key={index}>
                <img 
                  src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${disadvantage.hero}.png`}
                  alt={disadvantage.hero}
                />
                <Typography>{disadvantage.reason}</Typography>
              </AdvantageItem>
            ))}
          </AdvantageList>
        </Box>
      </ProConSection>

      <ButtonSection>
        <ActionButton 
          color="#4CAF50"
          onClick={() => handleTeamAdd('ally')}
        >
          ADD TO ALLY
        </ActionButton>
        <ActionButton 
          color="#f44336"
          onClick={() => handleTeamAdd('enemy')}
        >
          ADD TO ENEMY
        </ActionButton>
      </ButtonSection>
    </Container>
  );
}

export default HeroDetails; 