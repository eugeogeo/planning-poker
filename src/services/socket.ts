import { io } from 'socket.io-client';
import type { RoomResponse } from '../@types/general';
import type {
  CreateRoom,
  JoinRoom,
  ReceiveReaction,
  EmitVote,
  UpdateRoom,
  SendReaction,
} from '../@types/socket';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const socket = io(SOCKET_URL, { transports: ['websocket'] });

export function createRoom(data: CreateRoom) {
  const { playerName, setIsLoading, setErrorMsg, navigate, isSpectator } = data;

  return socket.emit(
    'create_room',
    { playerName: playerName.trim(), roomType: 'T-shirt', isSpectator },
    (response?: RoomResponse) => {
      setIsLoading(false);
      if (response?.success) {
        navigate(`/room/${response.roomId}?type=T-shirt`);
      } else {
        setErrorMsg('Erro ao criar sala. Tente novamente.');
      }
    },
  );
}

export function joinRoom(data: JoinRoom) {
  const { playerName, inputRoomId, setIsLoading, setErrorMsg, navigate, isSpectator } = data;

  socket.emit(
    'join_room',
    {
      playerName: playerName.trim(),
      roomId: inputRoomId.trim().toUpperCase(),
      isSpectator,
    },
    (response: RoomResponse) => {
      setIsLoading?.(false);
      if (setErrorMsg && navigate) {
        if (response.error) {
          setErrorMsg(response.error);
        } else if (response.success) {
          navigate(`/room/${response.roomId}?type=${response.roomType || 'T-shirt'}`);
        }
      }
    },
  );
}

export function updateRoom(data: UpdateRoom) {
  const { handleRoomUpdate } = data;

  socket.on('room_updated', handleRoomUpdate);
}

export function receiveReaction(data: ReceiveReaction) {
  const { handleReceiveReaction } = data;

  socket.on('receive_reaction', handleReceiveReaction);
}

export function emitVote(data: EmitVote) {
  const { roomId, vote } = data;

  socket.emit('vote', { roomId, vote });
}

export function sendReaction(data: SendReaction) {
  const { roomId, targetPlayerId, emoji } = data;

  socket.emit('send_reaction', { roomId, targetPlayerId, emoji });
}

export function sendRevealCards(roomId: string) {
  socket.emit('reveal_cards', { roomId });
}

export function sendStartNewRound(roomId: string) {
  socket.emit('start_new_round', { roomId });
}
