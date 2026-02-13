import { Box, Button, Typography } from '@mui/material';
import type { Player } from '../../../@types/general';

const ContainerVotacao = (data: { sendVote: (size: string) => void; myPlayer: Player }) => {
  const TSHIRT_SIZES = ['PP', 'P', 'M', 'G', 'GG', '?'];

  const { sendVote, myPlayer } = data;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Escolha o tamanho:
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
        {TSHIRT_SIZES.map((size) => (
          <Button
            key={size}
            variant="contained"
            onClick={() => sendVote(size)}
            sx={{ width: 60, height: 80 }}
            color={myPlayer.vote === size ? 'secondary' : 'primary'}
          >
            {size}
          </Button>
        ))}
      </Box>
    </>
  );
};

export default ContainerVotacao;
