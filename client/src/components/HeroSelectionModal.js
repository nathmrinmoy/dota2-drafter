import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Box,
  IconButton,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useDraftContext } from '../context/DraftContext';
import heroService from '../services/heroService';

const HeroCard = styled(Box)(({ theme, selected }) => ({
  padding: theme.spacing(1),
  backgroundColor: '#2a2a2a',
  border: '1px solid #333',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: '#333',
    transform: 'translateY(-2px)'
  }
}));

const SearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    backgroundColor: '#2a2a2a',
    '& fieldset': {
      borderColor: '#333',
    },
    '&:hover fieldset': {
      borderColor: '#444',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#666',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666',
  }
});

function HeroSelectionModal({ open, onClose, team }) {
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

  const filteredHeroes = heroes.filter(hero =>
    hero.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleHeroSelect = (hero) => {
    dispatch({
      type: team === 'ally' ? 'SET_ALLY_HERO' : 'SET_ENEMY_HERO',
      payload: { position: state.selectedPosition, hero }
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
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: '#666' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <SearchField
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
            {filteredHeroes.map((hero) => (
              <Grid item xs={6} sm={4} md={3} key={hero.id}>
                <HeroCard onClick={() => handleHeroSelect(hero)}>
                  <img
                    src={hero.iconUrl}
                    alt={hero.name}
                    style={{ width: '100%', height: 'auto' }}
                  />
                  <Box textAlign="center" mt={1} color="#fff">
                    {hero.name}
                  </Box>
                </HeroCard>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default HeroSelectionModal; 