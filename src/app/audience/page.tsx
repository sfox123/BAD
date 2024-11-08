// Page.tsx
"use client";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useId, useState } from "react";
import Image from "next/image";
import { teams } from "@/lib/data";
import { MatchLive } from "@/app/types";
import PointsTable from "../points/page";

// Mapping of Match Type abbreviations to full names
const matchTypeMap: { [key: string]: string } = {
  MS: "Men Singles",
  WS: "Women Singles",
  MD: "Men Doubles",
  WD: "Women Doubles",
  XD: "Mixed Doubles",
};

export default function Page() {
  const [matches, setMatches] = useState<MatchLive[]>([]);
  const id = useId();

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "matches"));
      const fetchedMatches = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as MatchLive)
      );
      const activeMatches = fetchedMatches.filter((match) => match.active);
      setMatches(activeMatches.slice(0, 4)); // Limit to 4 matches
    } catch (error) {
      console.error("Error fetching matches: ", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // Fetch every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const getTeamLogo = (teamName: string) => {
    const team = teams.find((t) => t.name === teamName);
    return team ? team.logo : "";
  };

  // Function to extract court number from 'selectedUmpire' (e.g., "Court 2" => 2)
  const getCourtNumber = (selectedUmpire: string): number | null => {
    const match = selectedUmpire.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Live Matches</h1>
      {matches.length > 0 ? (
        <table className="min-w-full bg-white dark:bg-neutral-900 border border-gray-200 mb-8">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Court</th>
              <th className="py-2 px-4 border-b">Match Type</th>
              <th className="py-2 px-4 border-b">Team</th>
              <th className="py-2 px-4 border-b">Score</th>
              <th className="py-2 px-4 border-b"></th>
              <th className="py-2 px-4 border-b">Score</th>
              <th className="py-2 px-4 border-b">Team</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => {
              const courtNumber = getCourtNumber(match.selectedUmpire);
              // Get full match type name from the mapping
              const fullMatchType =
                matchTypeMap[match.matchType] || match.matchType;

              return (
                <tr
                  key={`match-${match.teamA}-${match.teamB}-${id}`}
                  className="text-center"
                >
                  <td className="py-2 px-4 border-b">
                    {courtNumber !== null ? courtNumber : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">{fullMatchType}</td>
                  <td className="py-2 px-4 border-b flex items-center justify-center space-x-2">
                    <Image
                      src={getTeamLogo(match.teamA)}
                      alt={`${match.teamA} logo`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span>{match.teamA}</span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {match.scores[match.currentRound]?.teamA ?? 0}
                  </td>
                  <td className="py-2 px-4 border-b">VS</td>
                  <td className="py-2 px-4 border-b">
                    {match.scores[match.currentRound]?.teamB ?? 0}
                  </td>
                  <td className="py-2 px-4 border-b flex items-center justify-center space-x-2">
                    <Image
                      src={getTeamLogo(match.teamB)}
                      alt={`${match.teamB} logo`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span>{match.teamB}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-500">No active matches found</div>
      )}

      {/* Points Table */}
      <PointsTable />
    </div>
  );
}
