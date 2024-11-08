"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { teams } from "@/lib/data"; // Import the teams array

interface Match {
  teamA: string;
  teamB: string;
  teamA_Group: string;
  teamB_Group: string;
  points: {
    teamA: number;
    teamB: number;
  };
  winner?: "teamA" | "teamB" | null;
  forfeit?: "teamA" | "teamB" | null;
}

interface TeamPoints {
  [teamName: string]: {
    matchesPlayed: number;
    matchesWon: number;
    matchesLost: number;
    points: number;
  };
}

export default function PointsTable() {
  const [groupAPoints, setGroupAPoints] = useState<TeamPoints>({});
  const [groupBPoints, setGroupBPoints] = useState<TeamPoints>({});

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "matches"));
        const groupAPointsAccumulator: TeamPoints = {};
        const groupBPointsAccumulator: TeamPoints = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data() as Match;

          // Use teamA_Group and teamB_Group for sub-team names
          const teamA = data.teamA_Group;
          const teamB = data.teamB_Group;

          // Determine the group for teamA and teamB
          const teamAGroup = teams
            .flatMap((team) => team.teams)
            .find((subTeam) => subTeam.teamName === teamA)?.Group;

          const teamBGroup = teams
            .flatMap((team) => team.teams)
            .find((subTeam) => subTeam.teamName === teamB)?.Group;

          // Initialize teams in the appropriate accumulator
          const addTeamToAccumulator = (
            accumulator: TeamPoints,
            teamName: string
          ) => {
            if (!accumulator[teamName]) {
              accumulator[teamName] = {
                matchesPlayed: 0,
                matchesWon: 0,
                matchesLost: 0,
                points: 0,
              };
            }
          };

          if (teamAGroup === "A") {
            addTeamToAccumulator(groupAPointsAccumulator, teamA);
          } else if (teamAGroup === "B") {
            addTeamToAccumulator(groupBPointsAccumulator, teamA);
          }

          if (teamBGroup === "A") {
            addTeamToAccumulator(groupAPointsAccumulator, teamB);
          } else if (teamBGroup === "B") {
            addTeamToAccumulator(groupBPointsAccumulator, teamB);
          }

          // Update matches played
          const updateMatchesPlayed = (
            accumulator: TeamPoints,
            teamName: string
          ) => {
            accumulator[teamName].matchesPlayed += 1;
          };

          if (teamAGroup === "A") {
            updateMatchesPlayed(groupAPointsAccumulator, teamA);
          } else if (teamAGroup === "B") {
            updateMatchesPlayed(groupBPointsAccumulator, teamA);
          }

          if (teamBGroup === "A") {
            updateMatchesPlayed(groupAPointsAccumulator, teamB);
          } else if (teamBGroup === "B") {
            updateMatchesPlayed(groupBPointsAccumulator, teamB);
          }

          // Determine match outcome and update statistics
          if (data.winner) {
            if (data.winner === "teamA") {
              // Update Group A for teamA
              if (teamAGroup === "A") {
                groupAPointsAccumulator[teamA].matchesWon += 1;
                groupAPointsAccumulator[teamA].points += data.points.teamA || 0;
              } else if (teamAGroup === "B") {
                groupBPointsAccumulator[teamA].matchesWon += 1;
                groupBPointsAccumulator[teamA].points += data.points.teamA || 0;
              }

              // Update Group B for teamB (loss)
              if (teamBGroup === "A") {
                groupAPointsAccumulator[teamB].matchesLost += 1;
                groupAPointsAccumulator[teamB].points += data.points.teamB || 0;
              } else if (teamBGroup === "B") {
                groupBPointsAccumulator[teamB].matchesLost += 1;
                groupBPointsAccumulator[teamB].points += data.points.teamB || 0;
              }
            } else if (data.winner === "teamB") {
              // Update Group B for teamB
              if (teamBGroup === "A") {
                groupAPointsAccumulator[teamB].matchesWon += 1;
                groupAPointsAccumulator[teamB].points += data.points.teamB || 0;
              } else if (teamBGroup === "B") {
                groupBPointsAccumulator[teamB].matchesWon += 1;
                groupBPointsAccumulator[teamB].points += data.points.teamB || 0;
              }

              // Update Group A for teamA (loss)
              if (teamAGroup === "A") {
                groupAPointsAccumulator[teamA].matchesLost += 1;
                groupAPointsAccumulator[teamA].points += data.points.teamA || 0;
              } else if (teamAGroup === "B") {
                groupBPointsAccumulator[teamA].matchesLost += 1;
                groupBPointsAccumulator[teamA].points += data.points.teamA || 0;
              }
            }
          } else if (data.forfeit) {
            if (data.forfeit === "teamA") {
              // Team A forfeited, Team B wins
              if (teamBGroup === "A") {
                groupAPointsAccumulator[teamB].matchesWon += 1;
                groupAPointsAccumulator[teamB].points += 2; // Assuming 2 points for a win
                groupAPointsAccumulator[teamA].matchesLost += 1;
              } else if (teamBGroup === "B") {
                groupBPointsAccumulator[teamB].matchesWon += 1;
                groupBPointsAccumulator[teamB].points += 2;
                groupBPointsAccumulator[teamA].matchesLost += 1;
              }
            } else if (data.forfeit === "teamB") {
              // Team B forfeited, Team A wins
              if (teamAGroup === "A") {
                groupAPointsAccumulator[teamA].matchesWon += 1;
                groupAPointsAccumulator[teamA].points += 2;
                groupAPointsAccumulator[teamB].matchesLost += 1;
              } else if (teamAGroup === "B") {
                groupBPointsAccumulator[teamA].matchesWon += 1;
                groupBPointsAccumulator[teamA].points += 2;
                groupBPointsAccumulator[teamB].matchesLost += 1;
              }
            }
          }
        });

        setGroupAPoints(groupAPointsAccumulator);
        setGroupBPoints(groupBPointsAccumulator);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, []);

  // Sort teams by points
  const sortedGroupATeams = Object.entries(groupAPoints).sort(
    ([, aStats], [, bStats]) => bStats.points - aStats.points
  );

  const sortedGroupBTeams = Object.entries(groupBPoints).sort(
    ([, aStats], [, bStats]) => bStats.points - aStats.points
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Points Table</h1>
      <div className="flex flex-col md:flex-row">
        {/* Group A Table */}
        <div className="w-full md:w-1/2 p-2">
          <h2 className="text-xl font-bold mb-2">Group A</h2>
          <table className="min-w-full text-black bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Team</th>
                <th className="py-2 px-4 border-b">Played</th>
                <th className="py-2 px-4 border-b">Won</th>
                <th className="py-2 px-4 border-b">Lost</th>
                <th className="py-2 px-4 border-b">Points</th>
              </tr>
            </thead>
            <tbody>
              {sortedGroupATeams.map(([teamName, stats]) => (
                <tr key={teamName}>
                  <td className="py-2 px-4 border-b">{teamName}</td>
                  <td className="py-2 px-4 border-b text-center">
                    {stats.matchesPlayed}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {stats.matchesWon}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {stats.matchesLost}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {stats.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Group B Table */}
        <div className="w-full md:w-1/2 p-2">
          <h2 className="text-xl font-bold mb-2">Group B</h2>
          <table className="min-w-full text-black bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Team</th>
                <th className="py-2 px-4 border-b">Played</th>
                <th className="py-2 px-4 border-b">Won</th>
                <th className="py-2 px-4 border-b">Lost</th>
                <th className="py-2 px-4 border-b">Points</th>
              </tr>
            </thead>
            <tbody>
              {sortedGroupBTeams.map(([teamName, stats]) => (
                <tr key={teamName}>
                  <td className="py-2 px-4 border-b">{teamName}</td>
                  <td className="py-2 px-4 border-b text-center">
                    {stats.matchesPlayed}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {stats.matchesWon}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {stats.matchesLost}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {stats.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
