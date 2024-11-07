export interface Match {
  name: string;
  values: number[];
  playerCount: number;
}

export interface Player {
  FullName: string;
  gender?: string;
}

export interface TeamDetail {
  teamName: string;
  malePlayers: Player[];
  femalePlayers: Player[];
}

export interface Team {
  name: string;
  logo: string;
  teams: TeamDetail[];
}
export interface Umpire {
  name: string;
  pin: string;
}

export type Score = {
  teamA: number;
  teamB: number;
};

export type MatchLive = {
  id: string;
  scores: Score[];
  currentRound: number;
  selectedUmpire: string;
  teamBPlayers: Player[];
  teamA_Group: string;
  teamAPlayers: Player[];
  matchType: string;
  teamB: string;
  active: boolean;
  winner: string | null;
  teamA: string;
  teamB_Group: string;
};

export type ExpandableCardDemoProps = {
  matches: MatchLive[];
};
