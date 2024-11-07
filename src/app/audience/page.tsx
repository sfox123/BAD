"use client";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { teams } from "@/lib/data";
import { MatchLive, Score } from "@/app/types";

export default function Page() {
  const [matches, setMatches] = useState<MatchLive[]>([]);
  const ref = useRef<HTMLDivElement>(null);
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

  return (
    <div>
      {matches.length > 0 ? (
        <AnimatePresence>
          <div className="fixed inset-0 grid grid-cols-2 grid-rows-2 gap-4 p-4 z-[100]">
            {matches.map((match) => (
              <motion.div
                key={`card-${match.teamA}-${match.teamB}-${id}`}
                layoutId={`card-${match.teamA}-${match.teamB}-${id}`}
                ref={ref}
                className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-neutral-900 overflow-hidden"
              >
                <div className="p-8 flex flex-col items-center space-y-8 md:space-y-12 lg:space-y-16">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-neutral-200">
                    Live
                  </h2>
                  <div className="flex justify-center items-center space-x-4 md:space-x-8 lg:space-x-12">
                    <div className="flex flex-col items-center">
                      <Image
                        src={getTeamLogo(match.teamA)}
                        alt={`${match.teamA} logo`}
                        width={100}
                        height={100}
                        className="md:w-36 md:h-36 lg:w-48 lg:h-48"
                      />
                      <span className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-700 dark:text-neutral-200 mt-2 md:mt-4">
                        {match.teamA}
                      </span>
                    </div>
                    <span className="text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-neutral-200">
                      {match.scores[match.currentRound]?.teamA ?? 0}
                    </span>
                    <span className="text-xl md:text-3xl lg:text-4xl font-bold text-neutral-700 dark:text-neutral-200 mx-2 md:mx-4">
                      VS
                    </span>
                    <span className="text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-neutral-200">
                      {match.scores[match.currentRound]?.teamB ?? 0}
                    </span>
                    <div className="flex flex-col items-center">
                      <Image
                        src={getTeamLogo(match.teamB)}
                        alt={`${match.teamB} logo`}
                        width={100}
                        height={100}
                        className="md:w-36 md:h-36 lg:w-48 lg:h-48"
                      />
                      <span className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-700 dark:text-neutral-200 mt-2 md:mt-4">
                        {match.teamB}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-xl md:text-3xl lg:text-4xl font-bold text-neutral-700 dark:text-neutral-200">
                    SCORES
                  </h4>
                  <div className="text-neutral-600 text-lg md:text-xl lg:text-2xl dark:text-neutral-400 flex flex-wrap justify-center gap-4 md:gap-8">
                    {match.scores.map((score: Score, roundIndex: number) => (
                      <p className="mt-2 md:mt-4" key={roundIndex}>
                        Round {roundIndex + 1}: {score.teamA} - {score.teamB}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      ) : (
        <div>No active matches found</div>
      )}
    </div>
  );
}
