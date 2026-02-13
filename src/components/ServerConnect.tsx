import { Typography } from '@mui/material';

const ServerConnect = (data: { isConnected: boolean }) => {
  const { isConnected } = data;

  return (
    <Typography
      color={isConnected ? 'success.main' : 'error.main'}
      sx={{
        mb: 2,
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
      }}
    >
      {isConnected ? '🟢 Ligado ao Servidor' : '🔴 Desligado...'}
    </Typography>
  );
};

export default ServerConnect;
