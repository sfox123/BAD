// src/lib/feature/teamSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Score {
  teamA: number;
  teamB: number;
}

interface Points {
  teamA: number;
  teamB: number;
}

interface TeamState {
  teamA: string;
  teamA_Group: string;
  teamASubTeam: string;
  teamB: string;
  teamB_Group: string;
  teamBSubTeam: string;
  courtName: string;
  activeMatches: { [matchId: string]: boolean };
  score: Score;
  winner: "teamA" | "teamB" | null;
  points: Points;
}

const initialState: TeamState = {
  teamA: "",
  teamA_Group: "",
  teamASubTeam: "",
  teamB: "",
  teamB_Group: "",
  teamBSubTeam: "",
  courtName: "",
  activeMatches: {},
  score: { teamA: 0, teamB: 0 },
  winner: null,
  points: { teamA: 0, teamB: 0 },
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeamA(state, action: PayloadAction<string>) {
      state.teamA = action.payload;
    },
    setTeamAGroup(state, action: PayloadAction<string>) {
      state.teamA_Group = action.payload;
    },
    setTeamASubTeam(state, action: PayloadAction<string>) {
      state.teamASubTeam = action.payload;
    },
    setTeamB(state, action: PayloadAction<string>) {
      state.teamB = action.payload;
    },
    setTeamBGroup(state, action: PayloadAction<string>) {
      state.teamB_Group = action.payload;
    },
    setTeamBSubTeam(state, action: PayloadAction<string>) {
      state.teamBSubTeam = action.payload;
    },
    setCourtName(state, action: PayloadAction<string>) {
      state.courtName = action.payload;
    },
    setMatchActive(
      state,
      action: PayloadAction<{ matchId: string; active: boolean }>
    ) {
      const { matchId, active } = action.payload;
      state.activeMatches[matchId] = active;
    },
    resetState(state) {
      Object.assign(state, initialState);
    },
    updateScore(
      state,
      action: PayloadAction<{ team: "teamA" | "teamB"; delta: number }>
    ) {
      const { team, delta } = action.payload;
      if (team === "teamA") {
        state.score.teamA = Math.max(0, state.score.teamA + delta);
      } else {
        state.score.teamB = Math.max(0, state.score.teamB + delta);
      }
    },
    setWinner(state, action: PayloadAction<"teamA" | "teamB">) {
      const winner = action.payload;
      const loser = winner === "teamA" ? "teamB" : "teamA";
      state.winner = winner;
      state.points[winner] = 2;
      state.points[loser] = 1;
    },
    setForfeit(state, action: PayloadAction<"teamA" | "teamB">) {
      const forfeit = action.payload;
      const otherTeam = forfeit === "teamA" ? "teamB" : "teamA";
      state.winner = null;
      state.points[forfeit] = 0;
      state.points[otherTeam] = 2;
    },
    resetScore(state) {
      state.score = { teamA: 0, teamB: 0 };
    },
  },
});

export const {
  setTeamA,
  setTeamAGroup,
  setTeamASubTeam,
  setTeamB,
  setTeamBGroup,
  setTeamBSubTeam,
  setCourtName,
  setMatchActive,
  resetState,
  updateScore,
  setWinner,
  setForfeit,
  resetScore,
} = teamSlice.actions;

export default teamSlice.reducer;
