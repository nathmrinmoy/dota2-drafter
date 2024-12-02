import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const TreeContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '200px',
  backgroundColor: '#111111',
  padding: '8px'
});

const TreeLine = styled(Box)({
  position: 'absolute',
  left: '50%',
  width: '1px',
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  transform: 'translateX(-50%)'
});

const TalentNode = styled(Box)({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#666',
  fontSize: '14px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }
});

const TalentTooltipContent = styled(Box)({
  padding: '16px',
  backgroundColor: '#111111',
  border: '1px solid #333',
  borderRadius: '4px',
  width: '332px',
  height: '312px',
  position: 'relative'
});

const TalentChoice = styled(Typography)({
  color: '#999',
  fontSize: '13px',
  padding: '8px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  gap: '8px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  }
});

function TalentTree({ talents }) {
  const positions = {
    25: { top: '0px' },
    20: { top: '50px' },
    15: { top: '100px' },
    10: { top: '150px' }
  };

  const renderTooltipContent = (level) => {
    const talentKey = `level${level}`;
    const choices = talents[talentKey];
    
    return (
      <TalentTooltipContent>
        <Box sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%'
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '16px'
          }}>
            <TalentChoice>
              <span>← {choices[0]}</span>
              <span>{choices[1]} →</span>
            </TalentChoice>
          </Box>
        </Box>
      </TalentTooltipContent>
    );
  };

  return (
    <TreeContainer>
      <TreeLine />
      {Object.entries(positions).map(([level, position]) => (
        <Tooltip
          key={level}
          title={renderTooltipContent(level)}
          placement="right"
          arrow
          enterDelay={0}
          leaveDelay={0}
          PopperProps={{
            sx: {
              '& .MuiTooltip-tooltip': {
                backgroundColor: 'transparent',
                padding: 0
              },
              '& .MuiTooltip-arrow': {
                color: '#333'
              }
            }
          }}
        >
          <TalentNode style={position}>
            {level}
          </TalentNode>
        </Tooltip>
      ))}
    </TreeContainer>
  );
}

export default TalentTree; 