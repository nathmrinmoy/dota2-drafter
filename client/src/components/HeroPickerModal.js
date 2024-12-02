// Rename from HeroSelectionModal.js to HeroPickerModal.js

// Update imports in other files from:
import HeroSelectionModal from './HeroSelectionModal';
// to:
import HeroPickerModal from './HeroPickerModal'; 

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Box,
  IconButton,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useDraftContext } from '../context/DraftContext';
import heroService from '../services/heroService';

const HeroCard = styled(Box)(({ isDisabled }) => ({
  padding: '8px',
  backgroundColor: '#2a2a2a',
  border: '1px solid #333',
  borderRadius: '4px',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  transition: 'all 0.2s',
  opacity: isDisabled ? 0.5 : 1,
  pointerEvents: isDisabled ? 'none' : 'auto',
  '&:hover': {
    backgroundColor: isDisabled ? '#2a2a2a' : '#333',
    transform: isDisabled ? 'none' : 'translateY(-2px)'
  }
}));

const HeroImage = styled('img')({
  width: '100%',
  height: 'auto'
});

const HeroName = styled(Box)({
  textAlign: 'center',
  marginTop: '8px',
  color: '#fff'
});

function HeroPickerModal({ open, onClose, team }) {
  const { state, dispatch } = useDraftContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const data = await heroService.getAllHeroes();
        setHeroes(data);
      } catch (error) {
        console.error('Error fetching heroes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchHeroes();
    }
  }, [open]);

  const isHeroSelected = (hero) => {
    return state.allyTeam.some(h => h?.id === hero.id) ||
           state.enemyTeam.some(h => h?.id === hero.id);
  };

  const getHeroLocation = (hero) => {
    const allyIndex = state.allyTeam.findIndex(h => h?.id === hero.id);
    if (allyIndex !== -1) return 'Friendly team';
    
    const enemyIndex = state.enemyTeam.findIndex(h => h?.id === hero.id);
    if (enemyIndex !== -1) return 'Enemy team';
    
    return null;
  };

  const filteredHeroes = heroes.filter(hero =>
    hero.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleHeroSelect = (hero) => {
    // Check if hero is already selected in any team
    const isAlreadySelected = isHeroSelected(hero);
    
    if (isAlreadySelected) {
      return; // Do nothing if hero is already selected
    }

    // Check if the target team is full
    const targetTeam = team === 'ally' ? state.allyTeam : state.enemyTeam;
    const isTeamFull = targetTeam.every(slot => slot !== null);

    if (isTeamFull) {
      return; // Do nothing if team is full
    }

    // Find first empty slot
    const emptySlotIndex = targetTeam.findIndex(slot => slot === null);

    // Add hero to team
    dispatch({
      type: team === 'ally' ? 'SET_ALLY_HERO' : 'SET_ENEMY_HERO',
      payload: { 
        position: emptySlotIndex,
        hero 
      }
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: '#1a1a1a',
          color: '#fff'
        }
      }}
    >
      <DialogTitle>
        Select Hero
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#666'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <TextField
            fullWidth
            placeholder="Search heroes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredHeroes.map((hero) => {
              const isDisabled = isHeroSelected(hero);
              const location = getHeroLocation(hero);
              
              return (
                <Grid item xs={6} sm={4} md={3} key={hero.id}>
                  <Tooltip 
                    title={isDisabled ? `Hero is already picked in ${location}. Remove it first to pick again.` : ''}
                    arrow
                  >
                    <div>
                      <HeroCard
                        isDisabled={isDisabled}
                        onClick={isDisabled ? undefined : () => handleHeroSelect(hero)}
                        component={isDisabled ? 'div' : 'button'}
                      >
                        <HeroImage
                          src={hero.iconUrl}
                          alt={hero.name}
                          style={{
                            filter: isDisabled ? 'grayscale(100%)' : 'none'
                          }}
                        />
                        <HeroName>{hero.name}</HeroName>
                      </HeroCard>
                    </div>
                  </Tooltip>
                </Grid>
              );
            })}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default HeroPickerModal; 