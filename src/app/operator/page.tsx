// components/ui/Operator.tsx
"use client";

import React, { useState } from "react";
import TeamDisplay from "@/components/ui/TeamDisplay";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

const Operator: React.FC = () => {
  const [teamA, setTeamA] = useState<string>("");
  const [teamAGroup, setTeamAGroup] = useState<string>("");
  const [teamASubTeam, setTeamASubTeam] = useState<string>("");

  const [teamB, setTeamB] = useState<string>("");
  const [teamBGroup, setTeamBGroup] = useState<string>("");
  const [teamBSubTeam, setTeamBSubTeam] = useState<string>("");

  const [courtNumber, setCourtNumber] = useState<string>("");

  const handleTeamAChange = (
    teamName: string,
    group: string,
    subTeamName: string
  ) => {
    setTeamA(teamName);
    setTeamAGroup(group);
    setTeamASubTeam(subTeamName);
  };

  const handleTeamBChange = (
    teamName: string,
    group: string,
    subTeamName: string
  ) => {
    setTeamB(teamName);
    setTeamBGroup(group);
    setTeamBSubTeam(subTeamName);
  };

  const handleCourtNumberChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCourtNumber(event.target.value);
  };

  const registerMatch = async () => {
    if (
      !teamA ||
      !teamAGroup ||
      !teamASubTeam ||
      !teamB ||
      !teamBGroup ||
      !teamBSubTeam ||
      !courtNumber
    ) {
      alert(
        "Please select both teams, their sub-teams, and select the court number."
      );
      return;
    }

    // Define the match types
    const matchTypes = [
      "Men's Singles",
      "Women's Singles",
      "Men's Doubles",
      "Women's Doubles",
      "Mixed Doubles",
    ];

    try {
      // Loop through each match type and save a document
      for (const matchType of matchTypes) {
        const newMatch = {
          teamA,
          teamAGroup,
          teamASubTeam,
          teamB,
          teamBGroup,
          teamBSubTeam,
          courtNumber: Number(courtNumber),
          matchType,
          timestamp: new Date(),
          active: false,
          winner: null,
          scores: [],
        };

        const docRef = await addDoc(collection(db, "matches"), newMatch);
        console.log(`Match ${matchType} registered with ID: `, docRef.id);
      }

      alert("All matches registered successfully!");

      // Reset the form
      setTeamA("");
      setTeamAGroup("");
      setTeamASubTeam("");
      setTeamB("");
      setTeamBGroup("");
      setTeamBSubTeam("");
      setCourtNumber("");
    } catch (error) {
      console.error("Error registering matches:", error);
      alert("Failed to register matches. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4">Register New Match</h2>
      <div className="flex space-x-8">
        {/* Team A Selection */}
        <TeamDisplay
          initialTeamIndex={0}
          teamType="A"
          onTeamChange={handleTeamAChange}
        />

        {/* Team B Selection */}
        <TeamDisplay
          initialTeamIndex={1}
          teamType="B"
          onTeamChange={handleTeamBChange}
        />
      </div>

      {/* Court Number Selection */}
      <div className="mt-6">
        <label htmlFor="courtNumber" className="text-white mr-2">
          Court Number:
        </label>
        <select
          id="courtNumber"
          value={courtNumber}
          onChange={handleCourtNumberChange}
          className="p-2 text-black rounded border"
        >
          <option value="">-- Select Court --</option>
          {[1, 2, 3, 4, 5].map((court) => (
            <option key={court} value={court}>
              Court {court}
            </option>
          ))}
        </select>
      </div>

      {/* Register Button */}
      <button
        onClick={registerMatch}
        className="mt-8 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Register Matches
      </button>
    </div>
  );
};

export default Operator;
