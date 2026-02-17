import { Box, Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { sendRevealCards } from '../../../services/socket';

const AdminArea = (data: { showVotes: boolean; allVoted: boolean; roomId: string }) => {
  const { showVotes, allVoted, roomId } = data;

  if (showVotes) return null;

  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
      <Button
        variant="contained"
        disabled={!allVoted}
        onClick={() => sendRevealCards(roomId)}
        startIcon={<VisibilityIcon />}
        sx={{
          bgcolor: allVoted ? '#ff9800' : 'rgba(0,0,0,0.3)',
          color: allVoted ? 'black' : 'rgba(255,255,255,0.5)',
          fontWeight: 'bold',
          boxShadow: allVoted ? '0 4px 0 #b26a00' : 'none',
          border: allVoted ? 'none' : '1px solid rgba(255,255,255,0.2)',
          '&:hover': {
            bgcolor: allVoted ? '#ffb74d' : 'rgba(0,0,0,0.3)',
            transform: allVoted ? 'translateY(2px)' : 'none',
            boxShadow: allVoted ? '0 2px 0 #b26a00' : 'none',
          },
          '&.Mui-disabled': {
            bgcolor: 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.3)',
          },
        }}
      >
        {allVoted ? 'Revelar Cartas' : 'Aguardando Votos...'}
      </Button>
    </Box>
  );
};

export default AdminArea;
