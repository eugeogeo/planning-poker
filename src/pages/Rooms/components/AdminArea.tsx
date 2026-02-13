import { Box, Button, Paper, Typography } from '@mui/material';
import { sendRevealCards, sendStartNewRound } from '../../../services/socket';

const AdminArea = (data: { showVotes: boolean; allVoted: boolean; roomId: string }) => {
  const { showVotes, allVoted, roomId } = data;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        mt: 4,
        maxWidth: 400,
        mx: 'auto',
        bgcolor: '#fff3e0',
        borderColor: '#ffb74d',
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: '#e65100' }}>
        Painel do Admin
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        {!showVotes && (
          <Button
            variant="contained"
            color="warning"
            disabled={!allVoted}
            onClick={() => sendRevealCards(roomId)}
          >
            {allVoted ? '👁️ Revelar Cartas' : 'Aguardando Votos...'}
          </Button>
        )}

        {showVotes && (
          <Button variant="contained" color="primary" onClick={() => sendStartNewRound(roomId)}>
            🔄 Nova Rodada
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default AdminArea;
