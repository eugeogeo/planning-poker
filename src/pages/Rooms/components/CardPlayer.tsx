import { Box, keyframes, Paper, Typography } from '@mui/material';
import type { Socket } from 'socket.io-client';
import type { ActiveReaction, Player, RoomData } from '../../../@types/general';
import { CARD_COLORS } from '../../../@types/enum';

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

  const isAdmin = roomData?.adminId === id;
  const isMe = id === socket.id;
  const hasVoted = !!vote;

  const getCardBackground = () => {
    if (showVotes && hasVoted) {
      return CARD_COLORS[vote as keyof typeof CARD_COLORS] || '#eceff1';
    }

    if (hasVoted) return '#1565c0';
    return 'rgba(255, 255, 255, 0.05)';
  };

  const getTextColor = () => {
    if (showVotes && hasVoted) return '#000';
    return '#fff';
  };

  const cardBg = getCardBackground();
  const textColor = getTextColor();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        mx: 1,
      }}
    >
      <Box
        sx={{
          bgcolor: 'rgba(0,0,0,0.7)',
          px: 1.5,
          py: 0.5,
          borderRadius: 4,
          mb: 1,
          border: isAdmin ? '1px solid #ffd700' : '1px solid transparent',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
          {isAdmin && '👑'} {name} {isMe && '(Você)'}
        </Typography>
      </Box>

      {/* A CARTA */}
      <Paper
        elevation={hasVoted ? 8 : 0}
        onClick={(e) => handleCardClick(e, id)}
        sx={{
          width: 60,
          height: 90,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: cardBg,
          color: textColor,
          borderRadius: 2,
          border: hasVoted ? '2px solid white' : '2px dashed rgba(255,255,255,0.2)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          cursor: !isMe ? 'pointer' : 'default',
          transform: isMe ? 'scale(1.1)' : 'scale(1)',

          '&:hover': !isMe ? { transform: 'translateY(-8px) scale(1.05)' } : {},
        }}
      >
        <Typography variant="h5" fontWeight="900">
          {showVotes && vote}
          {!showVotes && hasVoted && (isMe ? vote : '♠')}{' '}
        </Typography>
      </Paper>

      {activeReactions
        .filter((r) => r.playerId === id)
        .map((r) => (
          <Typography
            key={r.id}
            sx={{
              position: 'absolute',
              top: '-30px',
              fontSize: '2.5rem',
              pointerEvents: 'none',
              zIndex: 20,
              textShadow: '0 4px 10px rgba(0,0,0,0.5)',
              animation: `${fallAnimation} 2s ease-in-out forwards`,
            }}
          >
            {r.emoji}
          </Typography>
        ))}
    </Box>
  );
};

export default CardPlayer;
