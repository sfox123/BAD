"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Loading from "@/components/ui/Loading";
import UmpireCard from "@/components/ui/UmpireCard";

export interface Player {
  FullName: string;
}

export interface Match {
  id: string;
  matchType: string;
  teamA: string;
  teamAPlayers: Player[];
  teamA_Group: string;
  teamASubTeam: string;
  teamB: string;
  teamBPlayers: Player[];
  teamB_Group: string;
  teamBSubTeam: string;
  courtNumber: number;
  winner: string | null;
  active: boolean;
  scores: { teamA: number; teamB: number }[];
}

export default function Page() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [courtNumber, setCourtNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Define the range of valid court numbers
  const VALID_COURTS = [1, 2, 3, 4, 5]; // Adjust as per your actual court numbers

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "matches"));
        const fetchedMatches: Match[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            matchType: data.matchType || "",
            teamA: data.teamA || "",
            teamAPlayers: data.teamAPlayers || [],
            teamA_Group: data.teamA_Group || "",
            teamASubTeam: data.teamASubTeam || "",
            teamB: data.teamB || "",
            teamBPlayers: data.teamBPlayers || [],
            teamB_Group: data.teamB_Group || "",
            teamBSubTeam: data.teamBSubTeam || "",
            courtNumber: data.courtNumber || 0,
            winner: data.winner || null,
            active: data.active || false,
            scores: data.scores || [],
          };
        });
        setMatches(fetchedMatches);

        // Retrieve court number and filtered matches from local storage
        const storedCourtNumber = localStorage.getItem("courtNumber");
        const storedFilteredMatches = localStorage.getItem("filteredMatches");

        if (storedCourtNumber) {
          setCourtNumber(storedCourtNumber);
        }

        if (storedFilteredMatches) {
          const parsedMatches = JSON.parse(storedFilteredMatches);
          const filtered = parsedMatches.filter(
            (match: Match) => !match.winner
          );
          setFilteredMatches(filtered);
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
        setError("Failed to fetch matches. Please try again later.");
      }
    };
    fetchData();
  }, []);

  const handleCourtNumberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCourtNumber(value);
    localStorage.setItem("courtNumber", value); // Save court number to local storage

    if (value) {
      const courtNum = Number(value);
      if (VALID_COURTS.includes(courtNum)) {
        setLoading(true);
        setError("");
        // Simulate a delay for loading (optional)
        setTimeout(() => {
          const filtered = matches.filter(
            (match) => match.courtNumber === courtNum && !match.winner
          );
          setFilteredMatches(filtered);
          localStorage.setItem("filteredMatches", JSON.stringify(filtered)); // Save filtered matches to local storage
          setLoading(false);
        }, 500); // Adjust or remove the delay as needed
      } else {
        setFilteredMatches([]);
        localStorage.removeItem("filteredMatches"); // Remove filtered matches from local storage
        setError("Invalid Court Number. Please select a valid court.");
      }
    } else {
      setFilteredMatches([]);
      localStorage.removeItem("filteredMatches"); // Remove filtered matches from local storage
      setError("");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black p-4">
      <h1 className="text-2xl font-bold mb-6 text-white">
        Select Court Number
      </h1>

      {/* Court Number Selection Dropdown */}
      <div className="mt-6">
        <label htmlFor="courtNumber" className="text-white mr-2">
          Court Number:
        </label>
        <select
          id="courtNumber"
          value={courtNumber}
          onChange={handleCourtNumberChange}
          className="p-2 rounded border bg-gray-800 text-white"
        >
          <option value="">-- Select Court --</option>
          {VALID_COURTS.map((court) => (
            <option key={court} value={court}>
              Court {court}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {loading && <Loading />}

      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <UmpireCard key={match.id} match={match} />
          ))
        ) : courtNumber && !loading ? (
          <p className="text-gray-500 mt-4">No matches found for this court.</p>
        ) : null}
      </div>
    </div>
  );
}
