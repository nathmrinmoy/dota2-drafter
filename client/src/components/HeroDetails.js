import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import TalentTree from './TalentTree';
import TalentTreeIcon from '../assets/icons/TalentTreeIcon';
import AghanimIcon from '../assets/icons/AghanimIcon';
import AghanimDetails from './AghanimDetails';
import { useDraftContext } from '../context/DraftContext';
import { StrengthIcon, AgilityIcon, IntelligenceIcon } from '../assets/icons/AttributeIcons';
import { HeroDetails as awsServices } from '../../../backend/config/aws-services';



const Container = styled(Box)({
  backgroundColor: '#141619',
  color: '#fff',
  width: '350px',
  height: '600px',
  display: 'flex',
  flexDirection: 'column'
});

// Hero Image Section
const TopSection = styled(Box)({
  height: '160px'
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

// Abilities Section
const AbilitiesSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  padding: '16px',
  height: '60px',
  position: 'relative'
});

// Pros and Cons Section
const ProConSection = styled(Box)({
  padding: '16px',
  flex: 1,  // Take remaining space
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
});

const SectionTitle = styled(Typography)({
  color: '#666',
  fontSize: '12px',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  marginBottom: '8px'
});

const ListItem = styled(Typography)({
  color: '#999',
  fontSize: '13px',
  marginBottom: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '&::before': {
    content: '"•"',
    color: '#666'
  }
});

// Remove Button Section
const ButtonSection = styled(Box)({
  padding: '16px',
  marginTop: 'auto',
  display: 'flex',
  gap: '8px',
  justifyContent: 'center'
});

const RemoveButton = styled(Box)({
  width: '50%',
  padding: '12px',
  backgroundColor: '#333',
  color: '#fff',
  textAlign: 'center',
  borderRadius: '4px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#444'
  }
});

// Ability related components
const AbilityIcon = styled(Box)({
  width: '48px',
  height: '48px',
  backgroundColor: '#1a1a1a',
  borderRadius: '4px',
  overflow: 'hidden',
  flexShrink: 0,
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
});

const AbilityContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
  flex: 1,
  overflowX: 'auto',
  padding: '4px'
});

const IconWrapper = styled(Box)({
  width: '48px',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  borderRadius: '4px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(34, 34, 34, 0.5)'
  }
});

const StyledTalentIcon = styled(TalentTreeIcon)({
  width: '48px',
  height: '48px',
  '& svg': {
    width: '100%',
    height: '100%'
  }
});

const StyledAghanimIcon = styled(AghanimIcon)({
  width: '48px',
  height: '48px',
  '& svg': {
    width: '100%',
    height: '100%'
  }
});

const ExtraAbilitiesContainer = styled(Box)({
  position: 'absolute',
  top: 'calc(100% + 8px)',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#1a1a1a',
  borderRadius: '4px',
  padding: '8px',
  display: 'flex',
  gap: '8px',
  zIndex: 10,
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
});

const MoreAbilitiesIcon = styled(Box)({
  width: '48px',
  height: '48px',
  backgroundColor: '#1a1a1a',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontSize: '16px',
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    backgroundColor: '#262626'
  }
});

// Pros and Cons sections
const ProSection = styled(Box)({
  flex: 1
});

const ConSection = styled(Box)({
  flex: 1
});

// Action buttons
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

const EmptyHeroDetails = styled(Typography)({
  color: '#999',
  fontSize: '16px',
  textAlign: 'center',
  padding: '16px'
});

function HeroDetails({ selectedHero }) {
  const { state, dispatch } = useDraftContext();

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

  const handleRemove = () => {
    const allyIndex = state.allyTeam.findIndex(hero => hero?.id === selectedHero.id);
    const enemyIndex = state.enemyTeam.findIndex(hero => hero?.id === selectedHero.id);

    if (allyIndex !== -1) {
      dispatch({
        type: 'SET_ALLY_HERO',
        payload: {
          position: allyIndex,
          hero: null
        }
      });
    }

    if (enemyIndex !== -1) {
      dispatch({
        type: 'SET_ENEMY_HERO',
        payload: {
          position: enemyIndex,
          hero: null
        }
      });
    }
  };

  const isHeroInTeams = () => {
    return state.allyTeam.some(hero => hero?.id === selectedHero.id) ||
           state.enemyTeam.some(hero => hero?.id === selectedHero.id);
  };

  const fetchHeroStats = async (heroId) => {
    try {
      const stats = await awsServices.methods.getHeroStats(heroId);
      setHeroStats(stats);
    } catch (error) {
      console.error('Error fetching hero stats:', error);
    }
  };

  if (!selectedHero) {
    return (
      <EmptyHeroDetails>
        Select a hero to view or add to a team
      </EmptyHeroDetails>
    );
  }

  console.log('Selected Hero:', selectedHero); // Debug log

  return (
    <Container>
      <TopSection>
        <ImageContainer>
          <img src={selectedHero.fullImageUrl} alt={selectedHero.name} />
        </ImageContainer>
      </TopSection>

      <AbilitiesSection>
        <Tooltip title={<TalentTree talents={selectedHero.talents} />}>
          <IconWrapper>
            <StyledTalentIcon />
          </IconWrapper>
        </Tooltip>
        
        <AbilityContainer>
          {selectedHero.abilities && selectedHero.abilities.length > 4 ? (
            <>
              {/* Show first 2 abilities */}
              {selectedHero.abilities.slice(0, 2).map((ability, index) => (
                <AbilityIcon key={index}>
                  <img 
                    src={ability.icon[0]} 
                    alt={ability.name}
                    onError={(e) => {
                      const currentIndex = ability.icon.indexOf(e.target.src);
                      if (currentIndex < ability.icon.length - 1) {
                        e.target.src = ability.icon[currentIndex + 1];
                      } else {
                        e.target.src = '/images/default_ability.png';
                        e.target.onerror = null;
                      }
                    }}
                  />
                </AbilityIcon>
              ))}
              
              {/* Show 4th ability */}
              <AbilityIcon>
                <img 
                  src={selectedHero.abilities[3].icon[0]} 
                  alt={selectedHero.abilities[3].name}
                  onError={(e) => {
                    const currentIndex = selectedHero.abilities[3].icon.indexOf(e.target.src);
                    if (currentIndex < selectedHero.abilities[3].icon.length - 1) {
                      e.target.src = selectedHero.abilities[3].icon[currentIndex + 1];
                    } else {
                      e.target.src = '/images/default_ability.png';
                      e.target.onerror = null;
                    }
                  }}
                />
              </AbilityIcon>

              {/* Show +n component with hover tooltip */}
              <Tooltip
                title={
                  <ExtraAbilitiesContainer>
                    {selectedHero.abilities.slice(4).map((ability, index) => (
                      <AbilityIcon key={index}>
                        <img 
                          src={ability.icon[0]} 
                          alt={ability.name}
                          onError={(e) => {
                            const currentIndex = ability.icon.indexOf(e.target.src);
                            if (currentIndex < ability.icon.length - 1) {
                              e.target.src = ability.icon[currentIndex + 1];
                            } else {
                              e.target.src = '/images/default_ability.png';
                              e.target.onerror = null;
                            }
                          }}
                        />
                      </AbilityIcon>
                    ))}
                  </ExtraAbilitiesContainer>
                }
                placement="bottom"
                arrow
              >
                <MoreAbilitiesIcon>
                  +{selectedHero.abilities.length - 4}
                </MoreAbilitiesIcon>
              </Tooltip>
            </>
          ) : (
            // Show all abilities if 4 or fewer
            selectedHero.abilities?.map((ability, index) => (
              <AbilityIcon key={index}>
                <img 
                  src={ability.icon[0]} 
                  alt={ability.name}
                  onError={(e) => {
                    const currentIndex = ability.icon.indexOf(e.target.src);
                    if (currentIndex < ability.icon.length - 1) {
                      e.target.src = ability.icon[currentIndex + 1];
                    } else {
                      e.target.src = '/images/default_ability.png';
                      e.target.onerror = null;
                    }
                  }}
                />
              </AbilityIcon>
            ))
          )}
        </AbilityContainer>

        <Tooltip title={<AghanimDetails aghanims={selectedHero.aghanims} />}>
          <IconWrapper>
            <StyledAghanimIcon />
          </IconWrapper>
        </Tooltip>
      </AbilitiesSection>

      <ProConSection>
        <ProSection>
          <SectionTitle>PROS</SectionTitle>
          {selectedHero.pros?.map((pro, index) => (
            <ListItem key={index}>{pro}</ListItem>
          ))}
        </ProSection>
        <ConSection>
          <SectionTitle>CONS</SectionTitle>
          {selectedHero.cons?.map((con, index) => (
            <ListItem key={index}>{con}</ListItem>
          ))}
        </ConSection>
      </ProConSection>

      <ButtonSection>
        {isHeroInTeams() ? (
          <RemoveButton onClick={handleRemove}>REMOVE</RemoveButton>
        ) : (
          <>
            <ActionButton color="#4CAF50" onClick={() => handleTeamAdd('ally')}>
              + ALLY
            </ActionButton>
            <ActionButton color="#f44336" onClick={() => handleTeamAdd('enemy')}>
              + ENEMY
            </ActionButton>
          </>
        )}
      </ButtonSection>
    </Container>
  );
}

export default HeroDetails; 