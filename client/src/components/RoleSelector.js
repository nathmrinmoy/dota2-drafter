import React from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDraftContext } from '../context/DraftContext';
import { RoleSelector as awsServices } from '../../../backend/config/aws-services';

const Container = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '60px'
});

const Section = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
});

const Label = styled(Typography)({
  color: '#666',
  fontSize: '12px',
  letterSpacing: '1px',
  textTransform: 'uppercase'
});

const StyledSelect = styled(Select)({
  backgroundColor: '#1a1a1a',
  color: '#fff',
  width: '160px',
  height: '40px',
  '& .MuiSelect-select': {
    padding: '8px 16px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#333',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#444',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#555',
  },
  '& .MuiSvgIcon-root': {
    color: '#666',
  }
});

const StyledMenuItem = styled(MenuItem)({
  color: '#fff',
  backgroundColor: '#1a1a1a',
  '&:hover': {
    backgroundColor: '#222',
  },
  '&.Mui-selected': {
    backgroundColor: '#2a2a2a',
    '&:hover': {
      backgroundColor: '#2a2a2a',
    }
  }
});

function RoleSelector() {
  const { state, dispatch } = useDraftContext();

  const roles = [
    { value: '', label: 'ALL LANES' },
    { value: 'mid', label: 'MID LANE' },
    { value: 'safe', label: 'SAFE LANE' },
    { value: 'off', label: 'OFF LANE' },
    { value: 'roam', label: 'ROAMING' },
    { value: 'support', label: 'SUPPORT' }
  ];

  const handleChange = (event) => {
    dispatch({ type: 'SET_LANE', payload: event.target.value });
  };

  const fetchHeroesByRole = async (role) => {
    try {
      const heroes = await awsServices.methods.getHeroesByRole(role);
      setFilteredHeroes(heroes);
    } catch (error) {
      console.error('Error fetching heroes:', error);
    }
  };

  return (
    <Container>
      <StyledSelect
        value={state.selectedLane || ''}
        onChange={handleChange}
        displayEmpty
      >
        <StyledMenuItem value="" disabled>
          Select Role
        </StyledMenuItem>
        {roles.map((role) => (
          <StyledMenuItem key={role.value} value={role.value}>
            {role.label}
          </StyledMenuItem>
        ))}
      </StyledSelect>
    </Container>
  );
}

export default RoleSelector; 