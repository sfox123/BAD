"use client";
import React, { useEffect, useState } from "react";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Loading from "@/components/ui/Loading";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

import { useRouter } from "next/navigation";

export default function Page() {
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
  const [match, setMatch] = useState<Match | null>(null);
  const [teamA, setTeamA] = useState<string>("");
  const [teamB, setTeamB] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  // New state variables for the confirmation modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  const matchId =
    typeof window !== "undefined"
      ? new URL(window.location.href).pathname.split("/score/")[1]
      : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (matchId) {
          const matchRef = doc(db, "matches", matchId);
          const matchDoc = await getDoc(matchRef);
          if (matchDoc.exists()) {
            const matchData = matchDoc.data();

            // Initialize points if not present
            if (!matchData.points) {
              matchData.points = {
                teamA: 0,
                teamB: 0,
              };
            }

            setMatch(matchData as Match);
            setTeamA(matchData.teamA);
            setTeamB(matchData.teamB);
          } else {
            console.error("No such document!");
          }
        } else {
          console.error("Invalid match ID");
        }
      } catch (error) {
        console.error("Error fetching match data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [matchId]);

  const handleScoreChange = async (team: "teamA" | "teamB", delta: number) => {
    if (!match || !match.scores || match.currentRound === undefined) return;

    const currentRound = match.currentRound;
    const newScores = [...match.scores];

    if (team === "teamA") {
      newScores[currentRound].teamA = Math.max(
        0,
        newScores[currentRound].teamA + delta
      );
    } else {
      newScores[currentRound].teamB = Math.max(
        0,
        newScores[currentRound].teamB + delta
      );
    }

    const updatedMatch = {
      ...match,
      scores: newScores,
    };

    setMatch(updatedMatch);

    // Update Firestore
    if (matchId) {
      const matchRef = doc(db, "matches", matchId);
      await updateDoc(matchRef, updatedMatch);
    }
  };

  const handleWinner = async (team: "teamA" | "teamB") => {
    if (!match) return;

    // Determine the other team
    const otherTeam = team === "teamA" ? "teamB" : "teamA";

    // Assign points
    const updatedMatch = {
      ...match,
      winner: team,
      points: {
        ...match.points,
        [team]: 2,
        [otherTeam]: 1,
      },
    };

    // Update state
    setMatch(updatedMatch);

    // Update Firestore
    if (matchId) {
      const matchRef = doc(db, "matches", matchId);
      await updateDoc(matchRef, {
        winner: team,
        points: updatedMatch.points,
      });
    }
    router.push("/umpire");
  };

  const handleForfeit = async (team: "teamA" | "teamB") => {
    if (!match) return;

    // Determine the other team
    const otherTeam = team === "teamA" ? "teamB" : "teamA";

    // Assign points
    const updatedMatch = {
      ...match,
      forfeit: team,
      points: {
        ...match.points,
        [team]: 0,
        [otherTeam]: 2,
      },
    };

    // Update state
    setMatch(updatedMatch);

    // Update Firestore
    if (matchId) {
      const matchRef = doc(db, "matches", matchId);
      await updateDoc(matchRef, {
        forfeit: team,
        points: updatedMatch.points,
      });
    }
    router.push("/umpire");
  };
  // Function to open the confirmation modal
  const confirmActionWithMessage = (message: string, action: () => void) => {
    setModalMessage(message);
    setConfirmAction(() => action);
    setIsModalOpen(true);
  };

  if (loading) {
    return <Loading />;
  }

  if (!match || !match.scores || match.currentRound === undefined) {
    return <div>Error: Match data is not available.</div>;
  }

  return (
    <div className="relative flex flex-col h-screen">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        message={modalMessage}
        onConfirm={() => {
          confirmAction();
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
      />

      {/* Team A Section */}
      <div className="relative flex flex-1">
        {/* Winner Button */}
        <button
          className="w-12 flex items-center justify-center bg-green-500 hover:bg-green-600 active:bg-green-700 text-white"
          onClick={() =>
            confirmActionWithMessage(
              `Are you sure you want to declare ${teamA} as the winner?`,
              () => handleWinner("teamA")
            )
          }
        >
          <span className="transform -rotate-90 whitespace-nowrap">Winner</span>
        </button>

        <div className="flex-1 flex flex-col justify-center items-center bg-red-500">
          <h2 className="text-white text-2xl">{teamA}</h2>
          <div className="flex items-center space-x-4 mt-5">
            <button
              className="bg-white text-black p-4 rounded-full hover:bg-gray-200 active:bg-gray-300"
              onClick={() => handleScoreChange("teamA", 1)}
            >
              <IconPlus size={24} />
            </button>
            <h1 className="text-4xl text-white">
              {match.scores[match.currentRound]?.teamA || 0}
            </h1>
            <button
              className="bg-white text-black p-4 rounded-full hover:bg-gray-200 active:bg-gray-300"
              onClick={() => handleScoreChange("teamA", -1)}
            >
              <IconMinus size={24} />
            </button>
          </div>
        </div>

        {/* Forfeit Button */}
        <button
          className="w-12 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white"
          onClick={() =>
            confirmActionWithMessage(
              `Are you sure ${teamA} wants to forfeit?`,
              () => handleForfeit("teamA")
            )
          }
        >
          <span className="transform -rotate-90 whitespace-nowrap">
            Forfeit
          </span>
        </button>
      </div>

      {/* Round Info */}
      <div className="text-black font-bold text-center p-2 bg-gray-300">
        <h1>
          Match Type: {match.matchType} | Round {match.currentRound + 1}
        </h1>
      </div>

      {/* Team B Section */}
      <div className="relative flex flex-1">
        {/* Winner Button */}
        <button
          className="w-12 flex items-center justify-center bg-green-500 hover:bg-green-600 active:bg-green-700 text-white"
          onClick={() =>
            confirmActionWithMessage(
              `Are you sure you want to declare ${teamB} as the winner?`,
              () => handleWinner("teamB")
            )
          }
        >
          <span className="transform -rotate-90 whitespace-nowrap">Winner</span>
        </button>

        <div className="flex-1 flex flex-col justify-center items-center bg-blue-500">
          <h2 className="text-white text-2xl">{teamB}</h2>
          <div className="flex items-center space-x-4 mt-5">
            <button
              className="bg-white text-black p-4 rounded-full hover:bg-gray-200 active:bg-gray-300"
              onClick={() => handleScoreChange("teamB", 1)}
            >
              <IconPlus size={24} />
            </button>
            <h1 className="text-4xl text-white">
              {match.scores[match.currentRound]?.teamB || 0}
            </h1>
            <button
              className="bg-white text-black p-4 rounded-full hover:bg-gray-200 active:bg-gray-300"
              onClick={() => handleScoreChange("teamB", -1)}
            >
              <IconMinus size={24} />
            </button>
          </div>
        </div>

        {/* Forfeit Button */}
        <button
          className="w-12 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white"
          onClick={() =>
            confirmActionWithMessage(
              `Are you sure ${teamB} wants to forfeit?`,
              () => handleForfeit("teamB")
            )
          }
        >
          <span className="transform -rotate-90 whitespace-nowrap">
            Forfeit
          </span>
        </button>
      </div>
    </div>
  );
}