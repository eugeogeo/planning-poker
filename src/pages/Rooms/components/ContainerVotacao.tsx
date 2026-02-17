import { Box, Button, Typography } from '@mui/material';
import type { Player } from '../../../@types/general';
import { CARD_COLORS } from '../../../@types/enum';

const ContainerVotacao = (data: { sendVote: (size: string) => void; myPlayer: Player }) => {
  const TSHIRT_SIZES = ['PP', 'P', 'M', 'G', 'GG', '?'];

  const { sendVote, myPlayer } = data;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography
        variant="caption"
        sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, letterSpacing: 1 }}
      >
        ESCOLHA SUA CARTA
      </Typography>

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
        {TSHIRT_SIZES.map((size) => {
          const isSelected = myPlayer.vote === size;
          return (
            <Button
              key={size}
              onClick={() => sendVote(size)}
              variant={isSelected ? 'contained' : 'outlined'}
              sx={{
                minWidth: 45,
                height: 65,
                borderRadius: 1.5,
                bgcolor: isSelected
                  ? CARD_COLORS[size as keyof typeof CARD_COLORS] || '#ffffff'
                  : 'rgba(255,255,255,0.05)',
                color: isSelected ? '#000' : '#fff',
                boxShadow: isSelected
                  ? `0 0 20px ${CARD_COLORS[size as keyof typeof CARD_COLORS] || '#fff'}`
                  : 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                border: isSelected ? '2px solid #fff' : '1px solid rgba(255,255,255,0.3)',
                transform: isSelected ? 'translateY(-15px)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                '&:hover': {
                  bgcolor: isSelected ? '#f5f5f5' : 'rgba(255,255,255,0.15)',
                  border: '1px solid #fff',
                  transform: 'translateY(-10px)',
                },
              }}
            >
              {size}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};

export default ContainerVotacao;
