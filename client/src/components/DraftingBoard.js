import React, { useState, useCallback, useEffect } from 'react';
import { Box, Select, MenuItem, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDraftContext } from '../context/DraftContext';
import TeamPicks from './TeamPicks';
import SuggestedHeroes from './SuggestedHeroes';
import AttributeGrid from './AttributeGrid';
import RoleSelector from './RoleSelector';
import HeroDetails from './HeroDetails';
import VSImage from './VSImage';

const Container = styled(Box)({
  backgroundColor: '#0D1117',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  userSelect: 'none'
});

const TopSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
});

const TeamSection = styled(Box)(({ side }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: side === 'left' ? 'row' : 'row-reverse'
}));

const GameModeSelector = styled(Box)({
  margin: '24px',
  minWidth: '10px',
  '& .MuiSelect-select': {
    color: '#fff',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent'
  },
  '& .MuiSelect-select': {
    minWidth: '100px',
    textAlign: 'center',
    padding: '0 8px 0 0 !important'
  },
  '& .MuiSelect-icon': {
  }
});

const StyledMenuItem = styled(MenuItem)({
  color: '#fff',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)'
    }
  }
});

const TopSectionContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%'
});

const MainContent = styled(Box)({
  display: 'flex',
  padding: '24px',
  gap: '24px',
  maxWidth: '1600px',
  margin: '0 auto',
  width: '100%',
  alignItems: 'flex-start',
  overflow: 'visible'
});

const GridSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '60px',
  flex: 1,
  height: '100%',
  minWidth: 0,
  overflow: 'visible',
  alignItems: 'center'
});

const SideSection = styled(Box)({
  width: '350px',
  flexShrink: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  marginTop: '35px'
});

const BottomContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
  width: '1200px',
  alignSelf: 'flex-start'
});

const SuggestionsContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'left',
  gap: '24px',
  width: '1000px'
});

const SuggestedHeroesLabel = styled(Box)({
  color: '#ffff',
  fontSize: '24px',
  letterSpacing: '1px',
  textTransform: 'lettercase',
  fontWeight: 'semibold'
});

const AttributeGridsContainer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gridTemplateRows: 'repeat(2, auto)',
  gap: '24px',
  width: '1200px',
  '& > *': {
    width: 'auto',
    minWidth: 0,
    display: 'flex'
  }
});

const SearchText = styled(Typography)({
  position: 'absolute',
  top: '10%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: '#000',
  fontSize: '48px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  zIndex: 1000,
  textShadow: '0 0 20px #FF4242',  // Dota 2 red glow
  opacity: props => props.show ? 1 : 0,
  transition: 'opacity 0.2s',
  userSelect: 'none'
});

function DraftingBoard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedHeroId, setHighlightedHeroId] = useState(null);
  const { state, dispatch } = useDraftContext();
  const [gameMode, setGameMode] = useState('turbo');

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore key presses when typing in input fields
      if (e.target.tagName === 'INPUT') return;
      
      // Only handle alphanumeric keys
      if (e.key.length === 1 && /^[a-zA-Z0-9]$/.test(e.key)) {
        setSearchTerm(prev => prev + e.key);
      }
      
      // Handle backspace
      if (e.key === 'Backspace') {
        setSearchTerm(prev => prev.slice(0, -1));
      }
      
      // Handle escape to clear search
      if (e.key === 'Escape') {
        setSearchTerm('');
        setHighlightedHeroId(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const matchingHeroes = state.heroes.filter(hero => {
        // Create a searchable name map
        const searchNameMap = {
          'zuus': 'zeus',
          'wisp': 'io',
          'rattletrap': 'clockwork',
          'furion': "nature's prophet",
          'shredder': 'timbersaw',
          'abyssal_underlord': 'underlord',
          'skeleton_king': 'wraith king',
          'nevermore': 'shadow fiend',  // Add Shadow Fiend's internal name mapping
          // Add any other name mappings here
        };

        // Get the searchable name
        const searchableName = searchNameMap[hero.name.toLowerCase()] || hero.name.toLowerCase();
        
        // Match from the start of the searchable name
        return searchableName.startsWith(searchTerm.toLowerCase());
      });

      if (matchingHeroes.length > 0) {
        setHighlightedHeroId(matchingHeroes.map(hero => hero.id));
      } else {
        setHighlightedHeroId(null);
      }

      const timer = setTimeout(() => {
        setSearchTerm('');
        setHighlightedHeroId(null);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [searchTerm, state.heroes]);

  const handleGameModeChange = (event) => {
    setGameMode(event.target.value);
  };

  return (
    <Container>
      <SearchText show={searchTerm.length > 0}>
        {searchTerm}
      </SearchText>
      <TopSection>
        <TopSectionContent>
          <TeamSection side="left">
            <TeamPicks team="ally" picks={state.allyTeam} />
          </TeamSection>
          
          <GameModeSelector>
            <Select
              value={gameMode}
              onChange={handleGameModeChange}
              variant="outlined"
              sx={{
                backgroundColor: 'transparent',
                '& fieldset': { border: 'none' }
              }}
              MenuProps={{
                sx: {
                  '& .MuiPaper-root': {
                    backgroundColor: 'rgba(20, 20, 20, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    marginTop: '0px'
                  }
                },
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'center'
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'center'
                }
              }}
            >
              <StyledMenuItem value="normal">Normal</StyledMenuItem>
              <StyledMenuItem value="turbo">Turbo</StyledMenuItem>
              <StyledMenuItem value="ranked">Ranked</StyledMenuItem>
            </Select>
          </GameModeSelector>
          
          <TeamSection side="right">
            <TeamPicks team="enemy" picks={state.enemyTeam} />
          </TeamSection>
        </TopSectionContent>
      </TopSection>

      <MainContent>
        <GridSection>
          <AttributeGridsContainer>
            <AttributeGrid 
              type="STRENGTH" 
              searchTerm={searchTerm}
              highlightedHeroId={highlightedHeroId} 
            />
            <AttributeGrid 
              type="AGILITY" 
              searchTerm={searchTerm}
              highlightedHeroId={highlightedHeroId}
            />
            <AttributeGrid 
              type="INTELLIGENCE" 
              searchTerm={searchTerm}
              highlightedHeroId={highlightedHeroId}
            />
            <AttributeGrid 
              type="UNIVERSAL" 
              searchTerm={searchTerm}
              highlightedHeroId={highlightedHeroId}
            />
          </AttributeGridsContainer>
          <BottomContainer>
            <SuggestionsContainer>
              <SuggestedHeroesLabel>
                SUGGESTED HEROES
              </SuggestedHeroesLabel>
              <RoleSelector />
            </SuggestionsContainer>
            <SuggestedHeroes />
          </BottomContainer>
        </GridSection>

        <SideSection>
          <HeroDetails selectedHero={state.selectedHero} />
        </SideSection>
      </MainContent>
    </Container>
  );
}

export default DraftingBoard;