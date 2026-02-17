import { Box, Button } from '@mui/material';
import type { Player } from '../../../@types/general';
import { CARD_VALUES } from '../../../@types/enum';

interface ContainerVotacaoProps {
  myPlayer: Player;
  sendVote: (vote: string) => void;
}

const ContainerVotacao = ({ myPlayer, sendVote }: ContainerVotacaoProps) => {
  // Se for espectador, não renderiza nada ou mostra apenas uma mensagem
  if (myPlayer.isSpectator) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
      {CARD_VALUES.map((value) => (
        <Button
          key={value}
          variant={myPlayer.vote === value ? 'contained' : 'outlined'}
          onClick={() => sendVote(value)}
          sx={{
            minWidth: 45,
            height: 60,
            fontWeight: 'bold',
            bgcolor: myPlayer.vote === value ? 'primary.main' : 'transparent',
            color: 'white',
            borderColor: 'rgba(255,255,255,0.5)',
          }}
        >
          {value}
        </Button>
      ))}
    </Box>
  );
};

export default ContainerVotacao;
