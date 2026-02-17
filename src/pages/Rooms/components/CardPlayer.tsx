import { Box, Typography, IconButton } from '@mui/material';
import { Visibility, AddReaction } from '@mui/icons-material';
import type { ActiveReaction, Player } from '../../../@types/general';
import { CARD_COLORS } from '../../../@types/enum';

interface CardPlayerProps {
  player: Player;
  showVotes: boolean;
  activeReactions: ActiveReaction[];
  handleCardClick: (event: React.MouseEvent<HTMLElement>, playerId: string) => void;
  isMe?: boolean;
}

const CardPlayer = ({
  player,
  showVotes,
  activeReactions,
  handleCardClick,
  isMe = false,
}: CardPlayerProps) => {
  const currentReactions = activeReactions.filter((r) => r.playerId === player.id);

  const hasVoted = player.vote !== null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        gap: 1,
      }}
    >
      {currentReactions.map((reaction) => (
        <Typography
          key={reaction.id}
          sx={{
            position: 'absolute',
            top: -40,
            fontSize: '2rem',
            animation: 'floatUp 2s ease-out forwards',
            zIndex: 10,
            '@keyframes floatUp': {
              '0%': { transform: 'translateY(0) scale(1)', opacity: 1 },
              '100%': { transform: 'translateY(-100px) scale(1.5)', opacity: 0 },
            },
          }}
        >
          {reaction.emoji}
        </Typography>
      ))}

      <Box
        onClick={(e) => !isMe && handleCardClick(e, player.id)}
        sx={{
          width: 80,
          height: 110,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isMe ? 'default' : 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          bgcolor: player.isSpectator
            ? 'rgba(255,255,255,0.1)'
            : showVotes && hasVoted
              ? CARD_COLORS[player.vote as keyof typeof CARD_COLORS]
              : '#2c3e50',
          border: `2px solid ${isMe ? '#3498db' : 'rgba(255,255,255,0.2)'}`,
          boxShadow: hasVoted && !showVotes ? '0 0 15px #2ecc71' : 'none',
          '&:hover': {
            transform: !isMe ? 'translateY(-5px)' : 'none',
            borderColor: !isMe ? '#f1c40f' : '',
          },
        }}
      >
        {player.isSpectator ? (
          <Visibility sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 30 }} />
        ) : (
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>
            {showVotes ? player.vote || '?' : hasVoted ? '✓' : ''}
          </Typography>
        )}

        {!isMe && (
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              bottom: -10,
              right: -10,
              bgcolor: '#f1c40f',
              '&:hover': { bgcolor: '#d4ac0d' },
            }}
          >
            <AddReaction sx={{ fontSize: 16, color: '#000' }} />
          </IconButton>
        )}
      </Box>

      <Typography
        variant="caption"
        sx={{
          color: isMe ? '#3498db' : 'white',
          fontWeight: isMe ? 'bold' : 'normal',
          textAlign: 'center',
          maxWidth: 90,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {player.name} {isMe && '(Eu)'}
      </Typography>
    </Box>
  );
};

export default CardPlayer;
