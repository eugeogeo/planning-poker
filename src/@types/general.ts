// --- INTERFACES (Substitutos dos 'any') ---
export interface Player {
  id: string;
  name: string;
  vote?: string;
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
