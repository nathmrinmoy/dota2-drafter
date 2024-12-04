import React from 'react';
import { Box, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDraftContext } from '../context/DraftContext';

const Container = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginTop: 'auto',
  padding: '12px 0',
  userSelect: 'none'
});

const StyledSelect = styled(Select)({
  '& .MuiSelect-select': {
    color: '#fff',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    minWidth: '100px',
    textAlign: 'center',
    padding: '0 16px 0 0 !important'
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  '& .MuiSelect-icon': {
    color: '#fff',
    right: '4px'
  },
  '&:hover': {
    backgroundColor: '#262626'
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

function RoleSelector() {
  const { state, dispatch } = useDraftContext();

  const roles = [
    { value: 'ALL', label: 'ALL ROLES' },
    { value: 'CARRY', label: 'CARRY' },
    { value: 'SUPPORT', label: 'SUPPORT' },
    { value: 'INITIATOR', label: 'INITIATOR' },
    { value: 'DURABLE', label: 'DURABLE' },
    { value: 'NUKER', label: 'NUKER' }
  ];

  return (
    <Container>
      <StyledSelect
        value={state.selectedRole}
        onChange={(e) => dispatch({ type: 'SET_ROLE', payload: e.target.value })}
        displayEmpty
        defaultValue="ALL"
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
        {roles.map(role => (
          <StyledMenuItem key={role.value} value={role.value}>
            {role.label}
          </StyledMenuItem>
        ))}
      </StyledSelect>
    </Container>
  );
}

export default RoleSelector; 