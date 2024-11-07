"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions
import { db } from "@/lib/firebaseConfig"; // Import your Firestore configuration

interface Match {
  teamA: string;
  teamB: string;
  scores: RoundScore[];
  currentRound: number;
  winner?: "teamA" | "teamB" | null;
  forfeit?: "teamA" | "teamB" | null;
  points: {
    teamA: number;
    teamB: number;
  };
  matchType?: string;
  // Add any other properties that exist in your match documents
}

interface RoundScore {
  teamA: number;
  teamB: number;
}

export default function Page() {
  const [matches, setMatches] = useState<Match[]>([]); // State to hold fetched data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "matches"));
        const fetchedMatches = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            teamA: data.teamA,
            teamB: data.teamB,
            scores: data.scores,
            currentRound: data.currentRound,
            winner: data.winner,
            forfeit: data.forfeit,
            points: data.points,
            matchType: data.matchType,
          } as Match;
        });
        setMatches(fetchedMatches); // Set data to state
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };
    fetchData();
  }, []);
  console.log(matches);

  return <div>points</div>;
}
