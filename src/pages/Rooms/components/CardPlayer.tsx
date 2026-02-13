import { Box, Grid, keyframes, Paper, Typography } from '@mui/material';
import type { Socket } from 'socket.io-client';
import type { ActiveReaction, Player, RoomData } from '../../../@types/general';

const CardPlayer = (data: {
  showVotes: boolean;
  socket: Socket;
  activeReactions: ActiveReaction[];
  player: Player;
  roomData: RoomData | null;
  handleCardClick: (event: React.MouseEvent<HTMLElement>, playerId: string) => void;
}) => {
  const { showVotes, socket, activeReactions, handleCardClick, player, roomData } = data;

  const { name, id, vote } = player;

  const fallAnimation = keyframes`
  0% { transform: translateY(-40px) scale(0.5); opacity: 0; }
  20% { transform: translateY(-10px) scale(1.5); opacity: 1; }
  80% { transform: translateY(20px) scale(1); opacity: 1; }
  100% { transform: translateY(40px) scale(0.5); opacity: 0; }
`;

  const getCardContent = (player: Player) => {
    if (!player.vote) return '?';

    if (showVotes) return player.vote;

    if (player.id === socket.id) return player.vote;

    return '✓';
  };

  const isAdmin = roomData?.adminId === id;
  const isMe = id === socket.id;

  return (
    <Grid key={id}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Typography variant="caption" display="block">
          {name} {isMe && '(Você)'}
          {isAdmin && ' 👑'}
        </Typography>

        <Paper
          elevation={3}
          onClick={(e) => handleCardClick(e, id)}
          sx={{
            width: 60,
            height: 90,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: vote ? (showVotes ? '#2196f3' : '#4caf50') : '#eee',
            color: vote ? 'white' : 'black',
            transition: 'all 0.3s ease',
            cursor: !isMe ? 'pointer' : 'default',
            '&:hover': !isMe ? { transform: 'scale(1.05)' } : {},
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            {getCardContent(player)}
          </Typography>
        </Paper>

        {/* Renderiza as animações de reações em cima deste card específico */}
        {activeReactions
          .filter((r) => r.playerId === id)
          .map((r) => (
            <Typography
              key={r.id}
              sx={{
                position: 'absolute',
                top: '10px',
                fontSize: '2rem',
                pointerEvents: 'none',
                zIndex: 10,
                animation: `${fallAnimation} 2s ease-in-out forwards`,
              }}
            >
              {r.emoji}
            </Typography>
          ))}
      </Box>
    </Grid>
  );
};

export default CardPlayer;
