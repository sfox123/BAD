"use client";
import React, { useState, useEffect } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { teams } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import BallCanvas from "./BallCanvas";
import { useDrag } from "@use-gesture/react";
import { useDispatch } from "react-redux";
import { setTeamA, setTeamB } from "@/lib/feature/teamSlice";

interface TeamDisplayProps {
  initialTeamIndex: number;
  teamType: "A" | "B";
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({
  initialTeamIndex,
  teamType,
}) => {
  const [teamIndex, setTeamIndex] = useState(initialTeamIndex);

  const [selectedSubTeam, setSelectedSubTeam] = useState(
    teams[teamIndex].teams[0]?.teamName || ""
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const teamName = teams[teamIndex].name;
    if (teamType === "A") {
      dispatch(setTeamA({ team: teamName, group: selectedSubTeam }));
    } else {
      dispatch(setTeamB({ team: teamName, group: selectedSubTeam }));
    }
  }, [teamIndex, selectedSubTeam, teamType, dispatch]);

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

  const bind = useDrag(({ swipe: [swipeX] }) => {
    if (swipeX === -1) handleNext();
    if (swipeX === 1) handlePrev();
  });

  return (
    <div className="flex flex-col items-center" {...bind()}>
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
          {/* Updated arrow buttons */}
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
