import { Box, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import AdminArea from './components/AdminArea';
import ContainerVotacao from './components/ContainerVotacao';
import MenuEmoji from './components/MenuEmoji';
import CardPlayer from './components/CardPlayer';
import ServerConnect from '../../components/ServerConnect';
import type { Player, RoomData, ActiveReaction } from '../../@types/general';

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
      socket.emit('join_room', {
        playerName,
        roomId: roomId.toUpperCase(),
      });
    }
  }, [isConnected, roomId, socket]);

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

    socket.on('room_updated', handleRoomUpdate);
    socket.on('receive_reaction', handleReceiveReaction);

    return () => {
      socket.off('room_updated', handleRoomUpdate);
      socket.off('receive_reaction', handleReceiveReaction);
    };
  }, [socket]);

  const sendVote = (vote: string) => {
    if (!roomData?.showVotes) {
      socket.emit('vote', { roomId, vote });
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
    if (selectedPlayerId) {
      socket.emit('send_reaction', { roomId, targetPlayerId: selectedPlayerId, emoji });
    }

    handleClosePopover();
  };

  const isAdmin = roomData?.adminId === socket.id;
  const showVotes = roomData?.showVotes || false;
  const allVoted = players.length > 0 && players.every((p) => p.vote !== null);

  const isPopoverOpen = Boolean(anchorEl);

  const myPlayer = players.find((p) => p.id === socket.id);

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Sala: {roomId} {isAdmin && '👑'}
      </Typography>

      <ServerConnect isConnected={isConnected} />

      {/* Grid de Jogadores */}
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 6 }}>
        {players.map((p) => (
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
      </Grid>

      {/* Popover (Menu de Emojis) */}
      <MenuEmoji
        handleClosePopover={handleClosePopover}
        handleSendReaction={handleSendReaction}
        isPopoverOpen={isPopoverOpen}
        anchorEl={anchorEl}
      />

      {!showVotes && !!myPlayer && <ContainerVotacao sendVote={sendVote} myPlayer={myPlayer} />}

      {isAdmin && roomId && (
        <AdminArea showVotes={showVotes} allVoted={allVoted} socket={socket} roomId={roomId} />
      )}
    </Box>
  );
};

export default Room;
