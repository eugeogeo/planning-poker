import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Typography, Paper, Grid } from '@mui/material';
import { useSocket } from '../../context/SocketContext';

const TSHIRT_SIZES = ['PP', 'P', 'M', 'G', 'GG', '?'];

const Room = () => {
  const { roomId } = useParams();
  const [players, setPlayers] = useState<any[]>([]);
  const { socket, isConnected } = useSocket();

  // NOVO: Efeito para entrar na sala ao carregar a página
  useEffect(() => {
    if (isConnected && roomId) {
      const playerName = localStorage.getItem('playerName') || 'Jogador Anônimo';

      // Avisa o servidor que você está entrando nesta sala específica
      socket.emit('join_room', {
        playerName,
        roomId: roomId.toUpperCase(),
      });
    }
  }, [isConnected, roomId, socket]);

  // Seu efeito existente para ouvir atualizações
  useEffect(() => {
    socket.on('room_updated', (data) => {
      setPlayers(data.players);
    });

    return () => {
      socket.off('room_updated');
    };
  }, [socket]);

  const sendVote = (vote: string) => socket.emit('vote', { roomId, vote });

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Sala: {roomId}
      </Typography>

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

      {/* Grid de Jogadores */}
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 6 }}>
        {players.map((p) => (
          <Grid key={p.id}>
            {' '}
            {/* Adicionado 'item' aqui para o Grid do MUI funcionar corretamente */}
            <Typography variant="caption" display="block">
              {p.name} {p.id === socket.id ? '(Você)' : ''}
            </Typography>
            <Paper
              sx={{
                width: 60,
                height: 90,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: p.vote ? '#4caf50' : '#eee',
                color: 'white',
              }}
            >
              <Typography variant="h6">
                {/* Lógica: Se votou, mostra o valor se for eu, ou um check se for outro. Se não votou, mostra '?' */}
                {p.vote ? (p.id === socket.id ? p.vote : '✓') : '?'}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Botões de Tamanho */}
      <Typography variant="h6" gutterBottom>
        Escolha o tamanho:
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
        {TSHIRT_SIZES.map((size) => (
          <Button
            key={size}
            variant="contained"
            onClick={() => sendVote(size)}
            sx={{ width: 60, height: 80 }}
          >
            {size}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default Room;
