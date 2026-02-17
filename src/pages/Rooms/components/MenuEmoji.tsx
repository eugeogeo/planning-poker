import { Box, IconButton, Popover, Typography } from '@mui/material';

interface MenuEmojiProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
}

const MenuEmoji = ({ anchorEl, onClose, onSelectEmoji }: MenuEmojiProps) => {
  const EMOJIS = ['👍', '💩', '😂', '🚀'];

  const isOpen = Boolean(anchorEl);

  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      slotProps={{
        paper: {
          sx: { borderRadius: 4, px: 1, py: 0.5, mb: 1, bgcolor: 'rgba(255,255,255,0.9)' },
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: 1 }}>
        {EMOJIS.map((emoji) => (
          <IconButton key={emoji} onClick={() => onSelectEmoji(emoji)} size="small">
            <Typography variant="h6">{emoji}</Typography>
          </IconButton>
        ))}
      </Box>
    </Popover>
  );
};

export default MenuEmoji;
