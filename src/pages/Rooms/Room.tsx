import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';

const TSHIRT_SIZES = ['PP', 'P', 'M', 'G', 'GG', '?'];

const Room = () => {
  const { roomId } = useParams();
  const { socket, isConnected } = useSocket();

  const [players, setPlayers] = useState<any[]>([]);
  const [roomData, setRoomData] = useState<any>(null);

  // Efeito para entrar na sala ao carregar (em caso de refresh)
  useEffect(() => {
    if (isConnected && roomId) {
      const playerName = localStorage.getItem('playerName') || 'Jogador Anônimo';

      socket.emit('join_room', {
        playerName,
        roomId: roomId.toUpperCase(),
      });
    }
  }, [isConnected, roomId, socket]);

  // Ouvir atualizações da sala
  useEffect(() => {
    const handleRoomUpdate = (data: any) => {
      setPlayers(data.players);
      setRoomData(data);
    };

    socket.on('room_updated', handleRoomUpdate);

    return () => {
      socket.off('room_updated', handleRoomUpdate);
    };
  }, [socket]);

  const sendVote = (vote: string) => {
    if (!roomData?.showVotes) {
      socket.emit('vote', { roomId, vote });
    }
  };

  // --- LÓGICA DE VISUALIZAÇÃO ---
  const isAdmin = roomData?.adminId === socket.id;
  const showVotes = roomData?.showVotes || false;

  // Verifica se todos os jogadores na sala já votaram
  const allVoted = players.length > 0 && players.every((p) => p.vote !== null);

  const getCardContent = (player: any) => {
    if (!player.vote) return '?';

    if (showVotes) return player.vote;

    if (player.id === socket.id) return player.vote;

    return '✓';
  };

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Sala: {roomId} {isAdmin && '👑'}
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
            <Typography variant="caption" display="block">
              {p.name} {p.id === socket.id ? '(Você)' : ''}
              {roomData?.adminId === p.id && ' 👑'}
            </Typography>
            <Paper
              elevation={3}
              sx={{
                width: 60,
                height: 90,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: p.vote ? (showVotes ? '#2196f3' : '#4caf50') : '#eee',
                color: p.vote ? 'white' : 'black',
                transition: 'all 0.3s ease',
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                {getCardContent(p)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {!showVotes && (
        <>
          <Typography variant="h6" gutterBottom>
            Escolha o tamanho:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
            {TSHIRT_SIZES.map((size) => (
              <Button
                key={size}
                variant="contained"
                onClick={() => sendVote(size)}
                sx={{ width: 60, height: 80 }}
                color={
                  players.find((p) => p.id === socket.id)?.vote === size ? 'secondary' : 'primary'
                }
              >
                {size}
              </Button>
            ))}
          </Box>
        </>
      )}

      {/* --- ÁREA DO ADMIN --- */}
      {isAdmin && (
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
            {/* Botão Revelar: Só aparece se todos votaram e ainda está escondido */}
            {!showVotes && (
              <Button
                variant="contained"
                color="warning"
                disabled={!allVoted}
                onClick={() => socket.emit('reveal_cards', { roomId })}
              >
                {allVoted ? '👁️ Revelar Cartas' : 'Aguardando Votos...'}
              </Button>
            )}

            {/* Botão Nova Rodada: Só aparece quando está revelado */}
            {showVotes && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => socket.emit('start_new_round', { roomId })}
              >
                🔄 Nova Rodada
              </Button>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Room;
