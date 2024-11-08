// components/ui/TeamDisplay.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { teams } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import BallCanvas from "./BallCanvas";
import { useDrag } from "@use-gesture/react";

interface TeamDisplayProps {
  initialTeamIndex: number;
  teamType: "A" | "B";
  onTeamChange: (teamName: string, group: string, subTeamName: string) => void;
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({
  initialTeamIndex,
  onTeamChange,
}) => {
  const [teamIndex, setTeamIndex] = useState(initialTeamIndex);
  const [selectedSubTeam, setSelectedSubTeam] = useState(
    teams[initialTeamIndex].teams[0]?.teamName || ""
  );

  useEffect(() => {
    const team = teams[teamIndex];
    const teamName = team.name;
    const group =
      team.teams.find((t) => t.teamName === selectedSubTeam)?.Group || "";
    onTeamChange(teamName, group, selectedSubTeam);
  }, [teamIndex, selectedSubTeam, onTeamChange]);

  const handlePrev = () => {
    const newIndex = teamIndex === 0 ? teams.length - 1 : teamIndex - 1;
    setTeamIndex(newIndex);
    const newSubTeamName = teams[newIndex].teams[0]?.teamName || "";
    setSelectedSubTeam(newSubTeamName);
  };

  const handleNext = () => {
    const newIndex = teamIndex === teams.length - 1 ? 0 : teamIndex + 1;
    setTeamIndex(newIndex);
    const newSubTeamName = teams[newIndex].teams[0]?.teamName || "";
    setSelectedSubTeam(newSubTeamName);
  };

  const handleSubTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubTeam(event.target.value);
  };

  const divRef = useRef<HTMLDivElement>(null);

  useDrag(
    ({ swipe }) => {
      const swipeX = swipe[0];
      if (swipeX === -1) handleNext();
      if (swipeX === 1) handlePrev();
    },
    {
      target: divRef,
      eventOptions: { passive: false },
    }
  );

  return (
    <div ref={divRef} className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={teamIndex}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5 }}
          className="w-64 h-64 flex justify-center items-center"
        >
          <BallCanvas icon={teams[teamIndex].logo} />
        </motion.div>
      </AnimatePresence>
      <div className="flex flex-col items-center mt-4">
        <div className="text-white text-lg mb-2">{teams[teamIndex].name}</div>
        <div className="flex items-center">
          <div
            onClick={handlePrev}
            className="p-3 cursor-pointer hover:bg-gray-700 rounded-full"
          >
            <IconArrowLeft size={32} />
          </div>
          <div className="mx-4 text-white">
            {teams[teamIndex].teams.length > 1 ? (
              <select
                value={selectedSubTeam}
                onChange={handleSubTeamChange}
                className="cool-dropdown bg-transparent border border-white rounded p-2"
              >
                {teams[teamIndex].teams.map((teamDetail, index) => (
                  <option
                    key={index}
                    value={teamDetail.teamName}
                    className="bg-dark text-white"
                  >
                    {teamDetail.teamName}
                  </option>
                ))}
              </select>
            ) : (
              <span>{teams[teamIndex].teams[0].teamName}</span>
            )}
          </div>
          <div
            onClick={handleNext}
            className="p-3 cursor-pointer hover:bg-gray-700 rounded-full"
          >
            <IconArrowRight size={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDisplay;
