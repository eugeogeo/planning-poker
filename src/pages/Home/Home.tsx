import { Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';
import { Style } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';

const Home = () => {
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();

  // Estados do formulário
  const [playerName, setPlayerName] = useState('Jogador');
  const [inputRoomId, setInputRoomId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // EVENTO: Quando a sala é criada com sucesso (para o Criador)
    socket.on('room_created', ({ roomId }) => {
      setIsLoading(false);
      navigate(`/room/${roomId}?type=T-shirt`);
    });

    // EVENTO: Quando o jogador entra com sucesso numa sala existente (para o Convidado)
    socket.on('room_joined', ({ roomId }) => {
      setIsLoading(false);
      navigate(`/room/${roomId}?type=T-shirt`);
    });

    // EVENTO: Trata erros (ex: sala não existe)
    socket.on('error', (message: string) => {
      setIsLoading(false);
      alert(message);
    });

    // Limpeza dos ouvintes ao desmontar o componente
    return () => {
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('error');
    };
  }, [socket, navigate]);

  const handleCreateRoom = () => {
    if (socket && isConnected) {
      setIsLoading(true);
      localStorage.setItem('playerName', playerName);
      socket.emit('create_room', { playerName, roomType: 'T-shirt' });
    }
  };

  const handleJoinRoom = () => {
    if (socket && isConnected && inputRoomId.trim()) {
      setIsLoading(true);
      localStorage.setItem('playerName', playerName);
      socket.emit('join_room', {
        playerName,
        roomId: inputRoomId.toUpperCase(),
      });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        gap: 4,
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{ p: 5, borderRadius: 3, textAlign: 'center', maxWidth: 500, width: '100%' }}
      >
        <Typography
          display="flex"
          variant="h4"
          fontWeight="bold"
          gutterBottom
          alignItems="center"
          justifyContent="center"
          gap={1}
        >
          <Style sx={{ fontSize: 40, color: 'black' }} />
          Planning Poker
        </Typography>

        <Typography
          color={isConnected ? 'success.main' : 'error.main'}
          sx={{ mb: 3, fontWeight: 'bold' }}
        >
          {isConnected ? '🟢 Ligado ao Servidor' : '🔴 Desligado...'}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* SECÇÃO: CRIAR SALA */}
          <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Criar Nova Sala
            </Typography>
            <TextField
              label="Teu Nome"
              size="small"
              fullWidth
              sx={{ mb: 2 }}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              disabled={isLoading}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleCreateRoom}
              disabled={isLoading || !isConnected}
              startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
            >
              {isLoading ? 'A criar...' : 'Criar Sala T-Shirt'}
            </Button>
          </Box>

          <Typography variant="body1" color="text.secondary">
            - OU -
          </Typography>

          {/* SECÇÃO: ENTRAR EM SALA */}
          <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 2, bgcolor: '#fafafa' }}>
            <Typography variant="h6" gutterBottom>
              Entrar em Sala
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="ID da Sala (ex: A1B2)"
                size="small"
                fullWidth
                value={inputRoomId}
                onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
                disabled={isLoading}
              />
              <Button
                variant="contained"
                onClick={handleJoinRoom}
                disabled={!inputRoomId || isLoading || !isConnected}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;
