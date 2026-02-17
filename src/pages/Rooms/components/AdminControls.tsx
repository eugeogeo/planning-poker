import { Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { sendStartNewRound } from '../../../services/socket';

interface AdminControlsProps {
  roomId: string;
}

const AdminControls = ({ roomId }: AdminControlsProps) => {
  return (
    <Button
      variant="contained"
      onClick={() => sendStartNewRound(roomId)}
      startIcon={<RefreshIcon />}
      sx={{
        bgcolor: 'rgba(156, 39, 176, 0.8)',
        backdropFilter: 'blur(5px)',
        color: 'white',
        fontWeight: 'bold',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)',
        '&:hover': {
          bgcolor: '#ab47bc',
          transform: 'translateY(2px)',
        },
      }}
    >
      Nova Rodada
    </Button>
  );
};

export default AdminControls;
