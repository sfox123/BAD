// src/features/matchSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MatchState {
  teamA: string;
  teamB: string;
  startTime: string;
  date: string;
  scores: {
    teamA: number[][];
    teamB: number[][];
  };
  currentRound: number;
  winner: string | null;
}

const initialState: MatchState = {
  teamA: "",
  teamB: "",
  startTime: "",
  date: new Date().toISOString(),
  scores: {
    teamA: [[], [], []], // 3 rounds
    teamB: [[], [], []], // 3 rounds
  },
  currentRound: 0,
  winner: null,
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setTeams: (
      state,
      action: PayloadAction<{ teamA: string; teamB: string }>
    ) => {
      state.teamA = action.payload.teamA;
      state.teamB = action.payload.teamB;
    },
    setStartTime: (state, action: PayloadAction<string>) => {
      state.startTime = action.payload;
    },
    updateScore: (
      state,
      action: PayloadAction<{
        team: "teamA" | "teamB";
        score: number;
      }>
    ) => {
      const { team, score } = action.payload;
      const round = state.currentRound;
      if (round >= 0 && round < 3) {
        state.scores[team][round].push(score);
        const totalScore = state.scores[team][round].reduce((a, b) => a + b, 0);
        if (totalScore >= 21) {
          state.winner = team;
        }
      }
    },
    nextRound: (state) => {
      if (state.currentRound < 2) {
        state.currentRound += 1;
      }
    },
    resetMatch: (state) => {
      state.currentRound = 0;
      state.winner = null;
      state.scores = {
        teamA: [[], [], []],
        teamB: [[], [], []],
      };
    },
  },
});

export const { setTeams, setStartTime, updateScore, nextRound, resetMatch } =
  matchSlice.actions;

export default matchSlice.reducer;
