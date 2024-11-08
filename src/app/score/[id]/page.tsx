"use client";
import React, { useEffect, useState } from "react";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Loading from "@/components/ui/Loading";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { updateScore, setWinner, setForfeit } from "@/lib/feature/teamSlice";

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
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const dispatch = useDispatch();
  const { score, points } = useSelector((state: RootState) => state.team);

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
    const newScore = {
      teamA: team === "teamA" ? score.teamA + delta : score.teamA,
      teamB: team === "teamB" ? score.teamB + delta : score.teamB,
    };

    dispatch(updateScore({ team, delta }));

    // Update Firestore
    if (matchId) {
      const matchRef = doc(db, "matches", matchId);
      await updateDoc(matchRef, {
        scores: newScore,
      });
    }
  };

  const handleWinner = async (team: "teamA" | "teamB") => {
    dispatch(setWinner(team));

    if (matchId) {
      const matchRef = doc(db, "matches", matchId);
      await updateDoc(matchRef, {
        winner: team,
        active: false, // Update active to false
        points: {
          teamA: points.teamA,
          teamB: points.teamB,
        },
      });
    }

    // Clear local storage
    localStorage.removeItem("courtNumber");
    localStorage.removeItem("filteredMatches");

    router.push("/umpire");
  };

  const handleForfeit = async (team: "teamA" | "teamB") => {
    dispatch(setForfeit(team));

    if (matchId) {
      const matchRef = doc(db, "matches", matchId);
      await updateDoc(matchRef, {
        forfeit: team,
        active: false, // Update active to false
        points: {
          teamA: points.teamA,
          teamB: points.teamB,
        },
      });
    }

    // Clear local storage
    localStorage.removeItem("courtNumber");
    localStorage.removeItem("filteredMatches");

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

  if (!match) {
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
              `Are you sure you want to declare ${match.teamA} as the winner?`,
              () => handleWinner("teamA")
            )
          }
        >
          <span className="transform -rotate-90 whitespace-nowrap">Winner</span>
        </button>

        <div className="flex-1 flex flex-col justify-center items-center bg-red-500">
          <h2 className="text-white text-2xl">{match.teamA}</h2>
          <div className="flex items-center space-x-4 mt-5">
            <button
              className="bg-white text-black p-4 rounded-full hover:bg-gray-200 active:bg-gray-300"
              onClick={() => handleScoreChange("teamA", 1)}
            >
              <IconPlus size={24} />
            </button>
            <h1 className="text-4xl text-white">{score.teamA}</h1>
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
              `Are you sure ${match.teamA} wants to forfeit?`,
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
        <h1>Match Type: {match.matchType}</h1>
      </div>

      {/* Team B Section */}
      <div className="relative flex flex-1">
        {/* Winner Button */}
        <button
          className="w-12 flex items-center justify-center bg-green-500 hover:bg-green-600 active:bg-green-700 text-white"
          onClick={() =>
            confirmActionWithMessage(
              `Are you sure you want to declare ${match.teamB} as the winner?`,
              () => handleWinner("teamB")
            )
          }
        >
          <span className="transform -rotate-90 whitespace-nowrap">Winner</span>
        </button>

        <div className="flex-1 flex flex-col justify-center items-center bg-blue-500">
          <h2 className="text-white text-2xl">{match.teamB}</h2>
          <div className="flex items-center space-x-4 mt-5">
            <button
              className="bg-white text-black p-4 rounded-full hover:bg-gray-200 active:bg-gray-300"
              onClick={() => handleScoreChange("teamB", 1)}
            >
              <IconPlus size={24} />
            </button>
            <h1 className="text-4xl text-white">{score.teamB}</h1>
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
              `Are you sure ${match.teamB} wants to forfeit?`,
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
