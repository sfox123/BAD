// src/components/UmpireCard.tsx
import React from "react";
import { BackgroundGradient } from "./background-gradient";
import Image from "next/image";
import { IconArrowsDiff } from "@tabler/icons-react";
import { teams } from "@/lib/data";
import Link from "next/link";

interface Match {
  id: string;
  teamA: string;
  teamB: string;
  matchType: string;
  // Add other properties if needed
}

const UmpireCard = ({ match }: { match: Match }) => {
  const teamALogo = teams.find((team) => team.name === match.teamA)?.logo || "";
  const teamBLogo = teams.find((team) => team.name === match.teamB)?.logo || "";

  return (
    <div>
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <div className="flex flex-row gap-2 items-center justify-center">
          <Image
            src={teamALogo}
            alt={match.teamA}
            height="50"
            width="50"
            className="object-contain"
          />
          <IconArrowsDiff size={24} stroke={1.5} />
          <Image
            src={teamBLogo}
            alt={match.teamB}
            height="50"
            width="50"
            className="object-contain"
          />
        </div>
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
          {match.teamA} vs {match.teamB}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Match Type: {match.matchType}
        </p>
        <Link
          href={`score/${match.id}`}
          className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800"
        >
          <span>Start </span>
          <span className="bg-green-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
            Now
          </span>
        </Link>
      </BackgroundGradient>
    </div>
  );
};

export default UmpireCard;
