import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import AdminArea from './components/AdminArea';
import ContainerVotacao from './components/ContainerVotacao';
import MenuEmoji from './components/MenuEmoji';
import CardPlayer from './components/CardPlayer';
import ServerConnect from '../../components/ServerConnect';
import type { Player, RoomData, ActiveReaction } from '../../@types/general';
import VotesPieChart from './components/VotesPieChart';
import {
  emitVote,
  joinRoom,
  receiveReaction,
  sendReaction,
  updateRoom,
} from '../../services/socket';

const Room = () => {
  const { roomId } = useParams();
  const { socket, isConnected } = useSocket();

  const [players, setPlayers] = useState<Player[]>([]);
  const [roomData, setRoomData] = useState<RoomData | null>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  // Estado para armazenar as reações que estão acontecendo na tela
  const [activeReactions, setActiveReactions] = useState<ActiveReaction[]>([]);

  useEffect(() => {
    if (isConnected && roomId) {
      const playerName = localStorage.getItem('playerName') || 'Jogador Anônimo';
      joinRoom({ inputRoomId: roomId, playerName });
    }
  }, [isConnected, roomId]);

  useEffect(() => {
    const handleRoomUpdate = (data: RoomData) => {
      setPlayers(data.players);
      setRoomData(data);
    };

    // Escuta quando alguém envia uma reação
    const handleReceiveReaction = (data: { targetPlayerId: string; emoji: string }) => {
      const reactionId = Math.random().toString(36).substring(7); // ID único para a animação

      setActiveReactions((prev) => [
        ...prev,
        { id: reactionId, playerId: data.targetPlayerId, emoji: data.emoji },
      ]);

      // Remove a reação do estado após a animação terminar (2 segundos)
      setTimeout(() => {
        setActiveReactions((prev) => prev.filter((r) => r.id !== reactionId));
      }, 2000);
    };

    updateRoom({ handleRoomUpdate });
    receiveReaction({ handleReceiveReaction });

    return () => {
      updateRoom({ handleRoomUpdate });
      receiveReaction({ handleReceiveReaction });
    };
  }, []);

  const sendVote = (vote: string) => {
    if (!roomData?.showVotes && roomId) {
      emitVote({ roomId: roomId, vote });
    }
  };

  // --- LÓGICA DE REAÇÃO (EMOJIS) ---
  const handleCardClick = (event: React.MouseEvent<HTMLElement>, playerId: string) => {
    // Só abre o popover se o card não for do próprio usuário logado
    if (playerId !== socket.id) {
      setAnchorEl(event.currentTarget);
      setSelectedPlayerId(playerId);
    }
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedPlayerId(null);
  };

  const handleSendReaction = (emoji: string) => {
    if (selectedPlayerId && roomId) {
      sendReaction({ roomId, targetPlayerId: selectedPlayerId, emoji });
    }

    handleClosePopover();
  };

  const isAdmin = roomData?.adminId === socket.id;
  const showVotes = roomData?.showVotes || false;
  const allVoted = players.length > 0 && players.every((p) => p.vote !== null);

  const isPopoverOpen = Boolean(anchorEl);

  const myPlayer = players.find((p) => p.id === socket.id);
  const otherPlayers = players.filter((p) => p.id !== socket.id);

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        bgcolor: '#121212',
        backgroundImage: 'radial-gradient(circle at center, #2c3e50 0%, #000000 100%)', // Gradiente ambiente
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        color: 'white',
      }}
    >
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', opacity: 0.8 }}>
          Sala: {roomId}
        </Typography>
        <ServerConnect isConnected={isConnected} />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          perspective: '1000px',
          pb: 12,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: -3,
            zIndex: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '90%',
          }}
        >
          {otherPlayers.map((p) => (
            <CardPlayer
              key={p.id}
              showVotes={showVotes}
              socket={socket}
              activeReactions={activeReactions}
              handleCardClick={handleCardClick}
              player={p}
              roomData={roomData}
            />
          ))}
        </Box>

        <Box
          sx={{
            width: 'min(95%, 900px)',
            height: '350px',
            bgcolor: '#2e7d32',
            borderRadius: '200px',
            border: '12px solid #5d4037',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6), 0 20px 50px rgba(0,0,0,0.5)', // Sombras internas e externas
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            zIndex: 1,
          }}
        >
          <Box sx={{ textAlign: 'center', opacity: showVotes ? 1 : 0.6 }}>
            {showVotes ? (
              <VotesPieChart votes={players.map((p) => p.vote).filter((v) => !!v) as string[]} />
            ) : (
              <Typography
                variant="h3"
                sx={{
                  color: 'rgba(0,0,0,0.2)',
                  fontWeight: 'bold',
                  userSelect: 'none',
                  fontFamily: 'serif',
                  letterSpacing: 6,
                }}
              >
                PLANNING
              </Typography>
            )}

            {isAdmin && roomId && (
              <Box sx={{ mt: showVotes ? 1 : 3, transform: 'scale(1.2)' }}>
                <AdminArea showVotes={showVotes} allVoted={allVoted} roomId={roomId} />
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: -5, zIndex: 3 }}>
          {myPlayer && (
            <CardPlayer
              key={myPlayer.id}
              showVotes={showVotes}
              socket={socket}
              activeReactions={activeReactions}
              handleCardClick={() => {}}
              player={myPlayer}
              roomData={roomData}
            />
          )}
        </Box>
      </Box>

      <Box
        sx={{
          width: '100%',
          p: 2,
          bgcolor: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'center',
          position: 'fixed',
          bottom: 0,
          zIndex: 20,
          boxShadow: '0 -5px 20px rgba(0,0,0,0.5)',
        }}
      >
        {!showVotes && !!myPlayer && <ContainerVotacao sendVote={sendVote} myPlayer={myPlayer} />}
        {showVotes && (
          <Typography color="white" variant="h5" sx={{ fontWeight: 'light' }}>
            Votação Encerrada
          </Typography>
        )}
      </Box>

      <MenuEmoji
        handleClosePopover={handleClosePopover}
        handleSendReaction={handleSendReaction}
        isPopoverOpen={isPopoverOpen}
        anchorEl={anchorEl}
      />
    </Box>
  );
};

export default Room;
