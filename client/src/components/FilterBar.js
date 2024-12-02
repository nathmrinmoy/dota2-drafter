import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDraftContext } from '../context/DraftContext';
import { StrengthIcon, AgilityIcon, IntelligenceIcon, UniversalIcon } from '../assets/icons/AttributeIcons';

const Container = styled(Box)({
  display: 'flex',
  gap: '8px',
  marginBottom: '24px'
});

const FilterChip = styled(Box)(({ active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  backgroundColor: active ? '#2a2a2a' : '#1a1a1a',
  color: active ? '#fff' : '#666',
  border: '1px solid #333',
  borderRadius: '4px',
  fontSize: '13px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: active ? '#333' : '#222'
  }
}));

const IconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    width: '12px',
    height: '12px'
  }
});

function FilterBar() {
  const { state, dispatch } = useDraftContext();
  const filters = state?.filters || {
    strength: true,
    agility: true,
    intelligence: true,
    universal: true
  };

  const handleAttributeToggle = (attribute) => {
    dispatch({ type: 'TOGGLE_ATTRIBUTE_FILTER', payload: attribute });
  };

  const attributes = [
    { key: 'strength', label: 'Strength', icon: <StrengthIcon /> },
    { key: 'agility', label: 'Agility', icon: <AgilityIcon /> },
    { key: 'intelligence', label: 'Intelligence', icon: <IntelligenceIcon /> },
    { key: 'universal', label: 'Universal', icon: <UniversalIcon /> }
  ];

  return (
    <Container>
      {attributes.map(({ key, label, icon }) => (
        <FilterChip
          key={key}
          active={filters[key]}
          onClick={() => handleAttributeToggle(key)}
        >
          <IconWrapper>{icon}</IconWrapper>
          {label}
        </FilterChip>
      ))}
    </Container>
  );
}

export default FilterBar; 