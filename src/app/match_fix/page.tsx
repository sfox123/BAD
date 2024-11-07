"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";

import PlayerForm from "@/components/ui/PlayerForm";
import { RootState, AppDispatch } from "@/lib/store";
import {
  setSelectedUmpire,
  resetState,
  isMatchFixButtonVisible,
} from "@/lib/feature/teamSlice";
import { Button } from "@/components/ui/moving-border";
import { UmpireData } from "@/lib/data";
import { db } from "@/lib/firebaseConfig";

import LottieAnimation from "@/components/LottieAnimation";

const MatchFix = () => {
  const dispatch = useDispatch<AppDispatch>();
  const teamState = useSelector((state: RootState) => state.team);
  const isButtonVisible = useSelector(isMatchFixButtonVisible);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUmpireChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSelectedUmpire(e.target.value));
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      const matchData = {
        ...teamState,
        scores: [
          { teamA: 0, teamB: 0 }, // Round 1
          { teamA: 0, teamB: 0 }, // Round 2
          { teamA: 0, teamB: 0 }, // Round 3
        ],
        currentRound: 0,
        winner: null,
      };

      const docRef = await addDoc(collection(db, "matches"), matchData);
      console.log("Document written with ID: ", docRef.id);
      setMessage("Match successfully fixed!");
    } catch (e) {
      console.error("Error adding document: ", e);
      setMessage("Error fixing the match. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    dispatch(resetState());
  };

  return (
    <div className="relative h-screen bg-black flex flex-col justify-center items-center">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <LottieAnimation />
        </div>
      )}
      <h1 className="text-white mb-8">MATCH TYPE : {teamState.matchType}</h1>
      <div className="flex gap-3 flex-row w-full">
        <PlayerForm
          teamId="teamA"
          matchType={teamState.matchType}
          teamName={teamState.teamA}
          teamGroup={teamState.teamA_Group}
        />
        <PlayerForm
          teamId="teamB"
          matchType={teamState.matchType}
          teamName={teamState.teamB}
          teamGroup={teamState.teamB_Group}
        />
      </div>
      <div className="mt-6">
        <select
          id="umpire"
          value={teamState.selectedUmpire}
          onChange={handleUmpireChange}
          className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 text-white p-2 rounded-md shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] transition-colors duration-300"
        >
          <option value="" disabled className="custom-select-option">
            Court
          </option>
          {UmpireData.map((umpire, index) => (
            <option
              key={index}
              value={umpire.name}
              className="custom-select-option"
            >
              {umpire.name}
            </option>
          ))}
        </select>
      </div>
      {isButtonVisible && (
        <div className="mt-6">
          <Button
            borderRadius="1.75rem"
            className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
            onClick={handleClick}
          >
            Match Fix
          </Button>
        </div>
      )}
      {message && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center z-50">
          <LottieAnimation>
            <div className="mt-4">
              <p className="text-white mb-4">{message}</p>
              <Link href="/">
                <Button
                  borderRadius="1.75rem"
                  className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                  onClick={handleGoHome}
                >
                  Go to Home
                </Button>
              </Link>
            </div>
          </LottieAnimation>
        </div>
      )}
    </div>
  );
};

export default MatchFix;
