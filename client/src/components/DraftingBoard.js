import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDraftContext } from '../context/DraftContext';
import TeamPicks from './TeamPicks';
import SuggestedHeroes from './SuggestedHeroes';
import AttributeGrid from './AttributeGrid';
import RoleSelector from './RoleSelector';
import HeroDetails from './HeroDetails';

const DraftContainer = styled(Box)({
  background: 'linear-gradient(180deg, #0E1014 0%, #32414D 50%, #141619 100%)',
  minHeight: '100vh',
  padding: '32px',
  color: '#fff'
});

// Main layout container
const MainLayout = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0'
});

// Top container for team picks
const TopContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: '20px',
  marginBottom: '20px',
  height: '120px'
});

// Middle container for attribute grid and hero details
const MiddleContainer = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '40px',
  width: 'calc(840px + 60px + 300px)',  // Width = AttributeGrid + gap + HeroDetails
  height: '500px',
  margin: '0 auto',
  justifyContent: 'center'  // Center the content
});

const AttributeGridContainer = styled(Box)({
  width: '1200px',  // Fixed width
  height: '500px', // Fixed height
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '24px'
});

const HeroDetailsContainer = styled(Box)({
  width: '300px',  // Fixed width
  height: '500px', // Fixed height
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
});

// Bottom container for roles and suggestions
const BottomContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginTop: '100px',
  height: '500px',
  width: '1200px',
  padding: '0',
  marginLeft: '0'
});

const TopRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '40px',
  gap: '20px',
  width: '100%'
});

const SuggestedHeroesLabel = styled(Typography)({
  color: '#fff',
  fontSize: '20px',
  fontWeight: 400,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  fontFamily: '"Open Sans", sans-serif',
  opacity: 0.6,
  marginLeft: '0'
});

const VSText = styled(Box)({
  color: '#999',
  fontSize: '20px',
  opacity: 0.8,
  marginTop: '30px'
});

// Add a new styled component for the empty state
const EmptyHeroDetails = styled(Box)({
  backgroundColor: '#1F202A',
  color: '#666',
  width: '350px',
  height: '600px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'px',
  textAlign: 'center',
  fontSize: '14px',
  letterSpacing: '0.5px'
});

// Add new components for the split sections
const HeroHeaderSection = styled(Box)({
  backgroundColor: 'transparent',
  height: '60px',
  borderRadius: '4px',
  padding: '0 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  marginTop: '-28px',
  width: '100%'
});

const HeroDetailsSection = styled(Box)({
  backgroundColor: '#1F202A',
  height: '500px',
  borderRadius: '4px'
});

// Add these styled components
const HeroName = styled(Typography)({
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#fff',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontFamily: 'Reaver, serif'
});

const ConfidenceWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  marginLeft: 'auto'
});

const ConfidenceIcon = styled(Box)({
  width: '16px',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::before': {
    content: '"⚡"',  // Using lightning bolt emoji as icon
    fontSize: '14px',
    color: '#4CAF50'
  }
});

const ConfidenceScore = styled(Typography)({
  color: '#fff',  // Changed from #4CAF50 to white
  fontSize: '16px',
  fontWeight: 600
});

// The rest of the space will be taken by SuggestedHeroes
const SuggestedHeroesContainer = styled(Box)({
  flex: 1,
  overflow: 'auto'
});

// Update RoleSelector container width
const StyledSelect = styled(Select)({
  backgroundColor: 'transparent',
  color: '#fff',
  width: 'auto',  // Keep auto width
  height: '40px',
  '& .MuiSelect-select': {
    padding: '8px 8px 8px 0',  // Keep reduced padding
    minWidth: 'auto'  // Keep auto min-width
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  '& .MuiSvgIcon-root': {
    color: '#fff',
    opacity: 0.6,
    marginLeft: '4px',  // Keep reduced space between text and chevron
    width: '20px',      // Keep smaller chevron
    height: '20px'
  }
});

// Also update MenuItem styling
const StyledMenuItem = styled(MenuItem)({
  color: '#fff',
  backgroundColor: '#1a1a1a',
  '&:hover': {
    backgroundColor: '#262626'
  },
  '&.Mui-selected': {
    backgroundColor: '#262626'
  }
});

const SearchOverlay = styled(Box)({
  position: 'fixed',
  top: '40px',
  left: '50%',
  transform: 'translate(-50%, 0)',
  padding: '16px 32px',
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  color: '#fff',
  borderRadius: '8px',
  fontSize: '80px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  zIndex: 99999,
  textShadow: '0 0 20px rgba(255, 255, 255, 0.7), 0 0 40px rgba(255, 255, 255, 0.4)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
  pointerEvents: 'none'
});

function DraftingBoard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedHeroId, setHighlightedHeroId] = useState(null);
  const { state, dispatch } = useDraftContext();

  const handleSearch = useCallback((updateFn) => {
    setSearchTerm(updateFn);
  }, []);

  // Add back the timeout to clear search and highlight
  useEffect(() => {
    if (searchTerm) {
      const timer = setTimeout(() => {
        setSearchTerm('');
        setHighlightedHeroId(null);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  // Keep the effect to find matching hero
  useEffect(() => {
    if (searchTerm) {
      const allHeroes = state.heroes;
      const matchingHero = allHeroes.find(hero => 
        hero.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      );

      if (matchingHero) {
        setHighlightedHeroId(matchingHero.id);
        const heroElement = document.getElementById(`hero-${matchingHero.id}`);
        if (heroElement) {
          heroElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
  }, [searchTerm, state.heroes]);

  return (
    <DraftContainer>
      {searchTerm && (
        <SearchOverlay>
          {searchTerm}
        </SearchOverlay>
      )}
      <MainLayout>
        {/* Top: Team Picks */}
        <TopContainer>
          <TeamPicks team="ally" picks={state.allyTeam} />
          <VSText>VS</VSText>
          <TeamPicks team="enemy" picks={state.enemyTeam} />
        </TopContainer>

        {/* Middle: Attribute Grid and Hero Details */}
        <MiddleContainer>
          <AttributeGridContainer>
            <AttributeGrid 
              type="STRENGTH" 
              onSearch={handleSearch} 
              searchTerm={searchTerm}
              highlightedHeroId={highlightedHeroId} 
            />
            <AttributeGrid 
              type="AGILITY" 
              onSearch={handleSearch} 
              searchTerm={searchTerm}
              highlightedHeroId={highlightedHeroId}
            />
            <AttributeGrid 
              type="INTELLIGENCE" 
              onSearch={handleSearch} 
              searchTerm={searchTerm}
              highlightedHeroId={highlightedHeroId}
            />
            <AttributeGrid 
              type="UNIVERSAL" 
              onSearch={handleSearch} 
              searchTerm={searchTerm}
              highlightedHeroId={highlightedHeroId}
            />
          </AttributeGridContainer>
          
          <HeroDetailsContainer>
            <HeroHeaderSection>
              {state.selectedHero ? (
                <>
                  <HeroName>{state.selectedHero.name}</HeroName>
                  <ConfidenceWrapper>
                    <ConfidenceIcon />
                    <ConfidenceScore>
                      {state.selectedHero.confidence || 0}%
                    </ConfidenceScore>
                  </ConfidenceWrapper>
                </>
              ) : (
                <Typography color="#666">Select a hero</Typography>
              )}
            </HeroHeaderSection>
            
            <HeroDetailsSection>
              {state.selectedHero ? (
                <HeroDetails selectedHero={state.selectedHero} />
              ) : (
                <EmptyHeroDetails>
                  Select a hero to view or add to a team
                </EmptyHeroDetails>
              )}
            </HeroDetailsSection>
          </HeroDetailsContainer>
        </MiddleContainer>

        {/* Bottom: Role Selector and Suggested Heroes */}
        <BottomContainer>
          <TopRow>
            <SuggestedHeroesLabel>Suggested Heroes</SuggestedHeroesLabel>
            <StyledSelect 
              defaultValue="ALL"
              value={state.selectedRole}
              onChange={(e) => dispatch({ type: 'SET_ROLE', payload: e.target.value })}
            >
              <StyledMenuItem value="ALL">All Roles</StyledMenuItem>
              <StyledMenuItem value="TANK">Tank</StyledMenuItem>
              <StyledMenuItem value="DAMAGE">Damage</StyledMenuItem>
              <StyledMenuItem value="SUPPORT">Support</StyledMenuItem>
            </StyledSelect>
          </TopRow>
          <SuggestedHeroesContainer>
            <SuggestedHeroes />
          </SuggestedHeroesContainer>
        </BottomContainer>
      </MainLayout>
    </DraftContainer>
  );
}

export default DraftingBoard; 