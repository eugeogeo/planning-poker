import { Style, AddCircleOutline, Login } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  Divider,
  Alert,
  Collapse,
} from '@mui/material';
import { useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import ServerConnect from '../../components/ServerConnect';
import { createRoom, joinRoom } from '../../services/socket';

const Home = () => {
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();

  const [playerName, setPlayerName] = useState(() => localStorage.getItem('playerName') || '');
  const [inputRoomId, setInputRoomId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setErrorMsg('Por favor, introduz o teu nome antes de criar a sala.');
      return;
    }

    if (socket && isConnected) {
      setErrorMsg('');
      setIsLoading(true);
      localStorage.setItem('playerName', playerName.trim());

      createRoom({ playerName, setIsLoading, setErrorMsg, navigate });
    }
  };

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      setErrorMsg('Por favor, introduz o teu nome antes de entrar na sala.');
      return;
    }

    if (socket && isConnected && inputRoomId.trim()) {
      setErrorMsg('');
      setIsLoading(true);
      localStorage.setItem('playerName', playerName.trim());

      joinRoom({ playerName, inputRoomId, setIsLoading, setErrorMsg, navigate });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && inputRoomId.trim() && playerName.trim()) {
      handleJoinRoom();
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
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          textAlign: 'center',
          maxWidth: 450,
          width: '100%',
        }}
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
          <Style sx={{ fontSize: 40, color: 'text.primary' }} />
          Planning Poker
        </Typography>

        <ServerConnect isConnected={isConnected} />

        {/* Mensagem de Erro UI Friendly */}
        <Collapse in={!!errorMsg}>
          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }} onClose={() => setErrorMsg('')}>
            {errorMsg}
          </Alert>
        </Collapse>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ ml: 1 }}>
              Nome{' '}
            </Typography>
            <TextField
              placeholder="O teu nome..."
              size="medium"
              fullWidth
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              disabled={isLoading}
            />
          </Box>

          {/* SECÇÃO: ENTRAR EM SALA */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="ID da Sala (ex: A1B2)"
              size="medium"
              fullWidth
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleJoinRoom}
              disabled={!inputRoomId.trim() || isLoading || !isConnected || !playerName.trim()}
              sx={{ px: { xs: 2, sm: 4 }, fontWeight: 'bold' }}
              endIcon={!isLoading && <Login />}
            >
              {isLoading && inputRoomId ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
            </Button>
          </Box>

          {/* DIVISOR */}
          <Divider sx={{ color: 'text.secondary', fontSize: '0.875rem', fontWeight: 500 }}>
            OU CRIAR UMA SALA
          </Divider>

          {/* SECÇÃO: CRIAR SALA */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleCreateRoom}
            disabled={isLoading || !isConnected || !playerName.trim()}
            startIcon={
              isLoading ? <CircularProgress size={20} color="inherit" /> : <AddCircleOutline />
            }
            sx={{ py: 1.5, fontWeight: 'bold' }}
          >
            {isLoading && !inputRoomId ? 'Criando...' : 'Criar Nova Sala'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;
