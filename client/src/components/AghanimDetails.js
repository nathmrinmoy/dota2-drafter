import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Container = styled(Box)({
  padding: '16px',
  backgroundColor: '#111111',
  border: '1px solid #333',
  borderRadius: '4px',
  width: '332px',
  height: '312px',
  position: 'relative'
});

const Title = styled(Typography)({
  color: '#999',
  fontSize: '14px',
  marginBottom: '24px',
  textTransform: 'uppercase',
  letterSpacing: '1px'
});

const UpgradeSection = styled(Box)({
  marginBottom: '24px',
  position: 'relative',
  padding: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  borderRadius: '4px',
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '2px',
    backgroundColor: '#666'
  }
});

const UpgradeTitle = styled(Typography)({
  color: '#666',
  fontSize: '12px',
  marginBottom: '12px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '&:before': {
    content: '""',
    width: '8px',
    height: '8px',
    backgroundColor: '#666',
    borderRadius: '50%'
  }
});

const UpgradeDescription = styled(Typography)({
  color: '#999',
  fontSize: '13px',
  lineHeight: '1.6',
  paddingLeft: '16px'
});

const CostInfo = styled(Box)({
  position: 'absolute',
  right: '16px',
  top: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
});

const GoldCost = styled(Typography)({
  color: '#FFD700',
  fontSize: '12px'
});

function AghanimDetails({ aghanims }) {
  return (
    <Container>
      <Title>Aghanim's Upgrades</Title>
      
      <UpgradeSection>
        <CostInfo>
          <GoldCost>4200</GoldCost>
        </CostInfo>
        <UpgradeTitle>Scepter Upgrade</UpgradeTitle>
        <UpgradeDescription>
          {aghanims?.scepter || 'No Scepter upgrade available'}
        </UpgradeDescription>
      </UpgradeSection>

      <UpgradeSection>
        <CostInfo>
          <GoldCost>1400</GoldCost>
        </CostInfo>
        <UpgradeTitle>Shard Upgrade</UpgradeTitle>
        <UpgradeDescription>
          {aghanims?.shard || 'No Shard upgrade available'}
        </UpgradeDescription>
      </UpgradeSection>
    </Container>
  );
}

export default AghanimDetails; 