export interface Player {
  id: string;
  name: string;
  vote?: string | null;
  isSpectator: boolean;
}

export interface RoomData {
  type: string;
  adminId: string;
  showVotes: boolean;
  players: Player[];
}

export interface ActiveReaction {
  id: string;
  playerId: string;
  emoji: string;
}

export interface RoomResponse {
  success?: boolean;
  roomId?: string;
  roomType?: string;
  error?: string;
}
