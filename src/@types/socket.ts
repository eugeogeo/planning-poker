import type { RoomData } from './general';

export type CreateRoom = {
  playerName: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  navigate: (path: string) => void;
};

export type JoinRoom = {
  playerName: string;
  inputRoomId: string;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMsg?: React.Dispatch<React.SetStateAction<string>>;
  navigate?: (path: string) => void;
};

export type UpdateRoom = { handleRoomUpdate: (data: RoomData) => void };

export type ReceiveReaction = {
  handleReceiveReaction: (data: { targetPlayerId: string; emoji: string }) => void;
};

export type EmitVote = {
  roomId: string;
  vote: string;
};

export type SendReaction = { roomId: string; targetPlayerId: string; emoji: string };
