import React from 'react';
import { styled } from '@mui/material/styles';

const VSContainer = styled('div')({
  width: '60px',
  height: '60px',
  position: 'relative',
  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const VSText = styled('div')({
  color: '#666',
  fontSize: '24px',
  fontWeight: 'bold',
  textShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
  fontFamily: 'Reaver, serif'
});

function VSImage() {
  return (
    <VSContainer>
      <VSText>VS</VSText>
    </VSContainer>
  );
}

export default VSImage; 