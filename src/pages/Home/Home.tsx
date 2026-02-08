import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import GridOnIcon from '@mui/icons-material/GridOn';
import { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { Style } from '@mui/icons-material';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Home = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [inputRoomId, setInputRoomId] = useState(''); // Para o campo de texto "Entrar na Sala"
  const [playerNames, setPlayerNames] = useState({ A: 'Jogador A', B: 'Jogador B' });

  const handleCreateRoom = (size: string) => {};
  const handleJoinRoom = () => {};

  // --- EFEITO: CONEXÃO COM SOCKET ---
  useEffect(() => {
    //  Criar a conexão
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    setSocket(newSocket);

    //  Configurar ouvintes
    newSocket.on('connect', () => {
      console.log('Conectado com ID:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado');
      setIsConnected(false);
    });

    //  FUNÇÃO DE LIMPEZA
    return () => {
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.disconnect();
    };
  }, []);

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
          Planning poker
        </Typography>

        <Typography
          color={isConnected ? 'success.main' : 'error.main'}
          sx={{ mb: 3, fontWeight: 'bold' }}
        >
          {isConnected ? '🟢 Conectado ao Servidor' : '🔴 Desconectado...'}
        </Typography>

        {/* Formulário de Criação / Entrada */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* CRIAR SALA */}
          <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Criar Nova Sala
            </Typography>
            <TextField
              label="Seu Nome"
              size="small"
              fullWidth
              sx={{ mb: 2 }}
              value={playerNames.A}
              onChange={(e) => setPlayerNames((prev) => ({ ...prev, A: e.target.value }))}
            />
            <Typography variant="body2" sx={{ mb: 1 }}>
              Escolha o tipo de sala:
            </Typography>
            <Grid container spacing={1} justifyContent="center">
              {['Tshird size'].map((size) => (
                <Grid key={size}>
                  <Button variant="outlined" onClick={() => handleCreateRoom(size)}>
                    {size}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Typography variant="body1" color="text.secondary">
            - OU -
          </Typography>

          {/* ENTRAR EM SALA */}
          <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 2, bgcolor: '#fafafa' }}>
            <Typography variant="h6" gutterBottom>
              Entrar em Sala
            </Typography>
            <TextField
              label="Seu Nome"
              size="small"
              fullWidth
              sx={{ mb: 2 }}
              value={playerNames.B}
              onChange={(e) => setPlayerNames((prev) => ({ ...prev, B: e.target.value }))}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="ID da Sala (ex: A1B2)"
                size="small"
                fullWidth
                value={inputRoomId}
                onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
              />
              <Button variant="contained" onClick={handleJoinRoom} disabled={!inputRoomId}>
                Entrar
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;
