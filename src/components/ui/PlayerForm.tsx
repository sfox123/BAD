"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import {
  addPlayerToTeamA,
  addPlayerToTeamB,
  removePlayerFromTeamA,
  removePlayerFromTeamB,
} from "@/lib/feature/teamSlice";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { Player } from "@/app/types";
import { teams, match } from "@/lib/data";
import { IconTrash } from "@tabler/icons-react";
import { matchSorter } from "match-sorter";

interface PlayerFormProps {
  teamId: string;
  teamName: string;
  matchType: string;
  teamGroup: string;
}

const PlayerForm = ({
  teamId,
  teamName,
  matchType,
  teamGroup,
}: PlayerFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const teamPlayers = useSelector((state: RootState) =>
    teamId === "teamA" ? state.team.teamAPlayers : state.team.teamBPlayers
  );

  const [playerCount, setPlayerCount] = useState(0);

  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Player[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load the players for the selected team and group
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);

  useEffect(() => {
    const matchTypeData = match.find((m) => m.name === matchType);
    if (matchTypeData) {
      setPlayerCount(matchTypeData.playerCount);
    }
  }, [matchType]);

  useEffect(() => {
    // Find the team in the teams array
    const teamData = teams.find((team) => team.name === teamName);
    if (teamData) {
      // Find the specific group (sub-team)
      const groupData = teamData.teams.find(
        (teamDetail) => teamDetail.teamName === teamGroup
      );
      if (groupData) {
        // Combine male and female players
        const combinedPlayers = [
          ...groupData.malePlayers,
          ...groupData.femalePlayers,
        ];
        setAvailablePlayers(combinedPlayers);
      }
    }
  }, [teamName, teamGroup]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const matchedPlayers = matchSorter(availablePlayers, value, {
        keys: ["FullName"],
      });
      // Exclude already added players
      const filteredPlayers = matchedPlayers.filter(
        (player) => !teamPlayers.some((p) => p.FullName === player.FullName)
      );
      setSuggestions(filteredPlayers);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectPlayer = (player: Player) => {
    if (teamPlayers.length >= playerCount) return;

    if (teamId === "teamA") {
      dispatch(addPlayerToTeamA(player));
    } else {
      dispatch(addPlayerToTeamB(player));
    }
    setInputValue("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleRemovePlayer = (index: number) => {
    if (teamId === "teamA") {
      dispatch(removePlayerFromTeamA(index));
    } else {
      dispatch(removePlayerFromTeamB(index));
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black relative">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Player`&apos;`s Arena
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Team : {teamName}
      </p>
      <p className="text-neutral-600 text-sm max-w-sm mt-1 dark:text-neutral-300">
        Group : {teamGroup}
      </p>

      <div className="mb-4 mt-5">
        {teamPlayers.map((player: Player, index: number) => (
          <div
            key={index}
            className="flex justify-between mb-4 items-center text-neutral-800 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 p-2 rounded"
          >
            <span>
              Player {index + 1}: {player.FullName}
            </span>
            <button
              onClick={() => handleRemovePlayer(index)}
              className="hover:text-red-600 transition-colors duration-300"
            >
              <IconTrash size={16} />
            </button>
          </div>
        ))}
      </div>

      {teamPlayers.length < playerCount && (
        <div className="my-8">
          <LabelInputContainer>
            <Label htmlFor="playerSearch">Search Player</Label>
            <Input
              id="playerSearch"
              placeholder="Type to search..."
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => {
                if (inputValue.length > 0) setShowSuggestions(true);
              }}
              onBlur={() => {
                // Delay to allow click on suggestion
                setTimeout(() => setShowSuggestions(false), 100);
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 mt-1 rounded max-h-40 overflow-y-auto absolute z-10 w-full">
                {suggestions.map((player, index) => (
                  <div
                    key={index}
                    onMouseDown={() => handleSelectPlayer(player)}
                    className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {player.FullName}
                  </div>
                ))}
              </div>
            )}
          </LabelInputContainer>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </div>
      )}
    </div>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full relative", className)}>
      {children}
    </div>
  );
};

export default PlayerForm;
