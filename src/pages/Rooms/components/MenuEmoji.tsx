import { Box, IconButton, Popover, Typography } from '@mui/material';

const MenuEmoji = (data: {
  isPopoverOpen: boolean;
  anchorEl: HTMLElement | null;
  handleClosePopover: () => void;
  handleSendReaction: (emoji: string) => void;
}) => {
  const EMOJIS = ['👍', '💩', '😂', '🚀'];

  const { isPopoverOpen, anchorEl, handleClosePopover, handleSendReaction } = data;

  return (
    <Popover
      open={isPopoverOpen}
      anchorEl={anchorEl}
      onClose={handleClosePopover}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      slotProps={{ paper: { sx: { borderRadius: 4, px: 1, py: 0.5, mb: 1 } } }}
    >
      <Box sx={{ display: 'flex', gap: 1 }}>
        {EMOJIS.map((emoji) => (
          <IconButton key={emoji} onClick={() => handleSendReaction(emoji)} size="small">
            <Typography variant="h6">{emoji}</Typography>
          </IconButton>
        ))}
      </Box>
    </Popover>
  );
};

export default MenuEmoji;
