"use client";
import React, { useEffect, useState } from "react";
import { teams } from "@/lib/data";

interface Match {
  id: string;
  matchType: string;
  active: boolean;
  teamA: string;
  teamB: string;
  teamA_Group: string;
  teamB_Group: string;
  teamASubTeam: string;
  teamBSubTeam: string;
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

// Accept matches as a prop
export default function PointsTable({ matches }: { matches: Match[] }) {
  const [groupAPoints, setGroupAPoints] = useState<TeamPoints>({});
  const [groupBPoints, setGroupBPoints] = useState<TeamPoints>({});

  useEffect(() => {
    if (!matches || matches.length === 0) return;

    const groupAPointsAccumulator: TeamPoints = {};
    const groupBPointsAccumulator: TeamPoints = {};

    matches.forEach((data) => {
      // Exclude live matches and matches without a winner or forfeit
      if (data.active || (!data.winner && !data.forfeit)) {
        return;
      }

      // Determine the group for teamA and teamB
      const teamAGroup = teams
        .flatMap((team) => team.teams)
        .find((subTeam) => subTeam.teamName === data.teamASubTeam)?.Group;

      const teamBGroup = teams
        .flatMap((team) => team.teams)
        .find((subTeam) => subTeam.teamName === data.teamBSubTeam)?.Group;

      // Initialize teams in the appropriate accumulator
      const initializeTeam = (accumulator: TeamPoints, teamName: string) => {
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
        initializeTeam(groupAPointsAccumulator, data.teamASubTeam);
      } else if (teamAGroup === "B") {
        initializeTeam(groupBPointsAccumulator, data.teamASubTeam);
      }

      if (teamBGroup === "A") {
        initializeTeam(groupAPointsAccumulator, data.teamBSubTeam);
      } else if (teamBGroup === "B") {
        initializeTeam(groupBPointsAccumulator, data.teamBSubTeam);
      }

      // Update matches played
      const updateMatchesPlayed = (
        accumulator: TeamPoints,
        teamName: string
      ) => {
        accumulator[teamName].matchesPlayed += 1;
      };

      if (teamAGroup === "A") {
        updateMatchesPlayed(groupAPointsAccumulator, data.teamASubTeam);
      } else if (teamAGroup === "B") {
        updateMatchesPlayed(groupBPointsAccumulator, data.teamASubTeam);
      }

      if (teamBGroup === "A") {
        updateMatchesPlayed(groupAPointsAccumulator, data.teamBSubTeam);
      } else if (teamBGroup === "B") {
        updateMatchesPlayed(groupBPointsAccumulator, data.teamBSubTeam);
      }

      // Update match outcomes
      if (data.winner) {
        if (data.winner === "teamA") {
          // Update Group A/B for teamA
          if (teamAGroup === "A") {
            groupAPointsAccumulator[data.teamASubTeam].matchesWon += 1;
            groupAPointsAccumulator[data.teamASubTeam].points += 2; // Assuming 2 points for a win
          } else if (teamAGroup === "B") {
            groupBPointsAccumulator[data.teamASubTeam].matchesWon += 1;
            groupBPointsAccumulator[data.teamASubTeam].points += 2;
          }

          // Update Group A/B for teamB (loss)
          if (teamBGroup === "A") {
            groupAPointsAccumulator[data.teamBSubTeam].matchesLost += 1;
            groupAPointsAccumulator[data.teamBSubTeam].points += 1; // Assuming 1 point for a loss
          } else if (teamBGroup === "B") {
            groupBPointsAccumulator[data.teamBSubTeam].matchesLost += 1;
            groupBPointsAccumulator[data.teamBSubTeam].points += 1;
          }
        } else if (data.winner === "teamB") {
          // Update Group A/B for teamB
          if (teamBGroup === "A") {
            groupAPointsAccumulator[data.teamBSubTeam].matchesWon += 1;
            groupAPointsAccumulator[data.teamBSubTeam].points += 2;
          } else if (teamBGroup === "B") {
            groupBPointsAccumulator[data.teamBSubTeam].matchesWon += 1;
            groupBPointsAccumulator[data.teamBSubTeam].points += 2;
          }

          // Update Group A/B for teamA (loss)
          if (teamAGroup === "A") {
            groupAPointsAccumulator[data.teamASubTeam].matchesLost += 1;
            groupAPointsAccumulator[data.teamASubTeam].points += 1;
          } else if (teamAGroup === "B") {
            groupBPointsAccumulator[data.teamASubTeam].matchesLost += 1;
            groupBPointsAccumulator[data.teamASubTeam].points += 1;
          }
        }
      } else if (data.forfeit) {
        if (data.forfeit === "teamA") {
          // Team A forfeited, Team B wins
          if (teamBGroup === "A") {
            groupAPointsAccumulator[data.teamBSubTeam].matchesWon += 1;
            groupAPointsAccumulator[data.teamBSubTeam].points += 2; // Assuming 2 points for a win
            groupAPointsAccumulator[data.teamASubTeam].matchesLost += 1;
          } else if (teamBGroup === "B") {
            groupBPointsAccumulator[data.teamBSubTeam].matchesWon += 1;
            groupBPointsAccumulator[data.teamBSubTeam].points += 2;
            groupBPointsAccumulator[data.teamASubTeam].matchesLost += 1;
          }
        } else if (data.forfeit === "teamB") {
          // Team B forfeited, Team A wins
          if (teamAGroup === "A") {
            groupAPointsAccumulator[data.teamASubTeam].matchesWon += 1;
            groupAPointsAccumulator[data.teamASubTeam].points += 2;
            groupAPointsAccumulator[data.teamBSubTeam].matchesLost += 1;
          } else if (teamAGroup === "B") {
            groupBPointsAccumulator[data.teamASubTeam].matchesWon += 1;
            groupBPointsAccumulator[data.teamASubTeam].points += 2;
            groupBPointsAccumulator[data.teamBSubTeam].matchesLost += 1;
          }
        }
      }
    });

    setGroupAPoints(groupAPointsAccumulator);
    setGroupBPoints(groupBPointsAccumulator);
  }, [matches]);

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
                <th className="py-2 px-4 border-b">Rank</th>
                <th className="py-2 px-4 border-b">Team</th>
                <th className="py-2 px-4 border-b">Played</th>
                <th className="py-2 px-4 border-b">Won</th>
                <th className="py-2 px-4 border-b">Lost</th>
                <th className="py-2 px-4 border-b">Points</th>
              </tr>
            </thead>
            <tbody>
              {sortedGroupATeams.map(([teamName, stats], index) => (
                <tr key={teamName}>
                  <td className="py-2 px-4 border-b">{index + 1}</td>
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
                <th className="py-2 px-4 border-b">Rank</th>
                <th className="py-2 px-4 border-b">Team</th>
                <th className="py-2 px-4 border-b">Played</th>
                <th className="py-2 px-4 border-b">Won</th>
                <th className="py-2 px-4 border-b">Lost</th>
                <th className="py-2 px-4 border-b">Points</th>
              </tr>
            </thead>
            <tbody>
              {sortedGroupBTeams.map(([teamName, stats], index) => (
                <tr key={teamName}>
                  <td className="py-2 px-4 border-b">{index + 1}</td>
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
