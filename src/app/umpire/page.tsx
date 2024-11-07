"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Input } from "@/components/ui/Input";
import Loading from "@/components/ui/Loading";
import { UmpireData } from "@/lib/data";
import UmpireCard from "@/components/ui/UmpireCard";

export default function Page() {
  const [matches, setMatches] = useState<
    {
      id: string;
      matchType: string;
      selectedUmpire: string;
      teamA: string;
      teamAPlayers: string[];
      teamA_Group: string;
      teamB: string;
      teamBPlayers: string[];
      teamB_Group: string;
    }[]
  >([]);
  const [filteredMatches, setFilteredMatches] = useState<
    {
      id: string;
      matchType: string;
      selectedUmpire: string;
      teamA: string;
      teamAPlayers: string[];
      teamA_Group: string;
      teamB: string;
      teamBPlayers: string[];
      teamB_Group: string;
    }[]
  >([]);
  const [pin, setPin] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "matches"));
      const fetchedMatches = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          matchType: data.matchType || "",
          selectedUmpire: data.selectedUmpire || "",
          teamA: data.teamA || "",
          teamAPlayers: data.teamAPlayers || [],
          teamA_Group: data.teamA_Group || "",
          teamB: data.teamB || "",
          teamBPlayers: data.teamBPlayers || [],
          teamB_Group: data.teamB_Group || "",
        };
      });
      setMatches(fetchedMatches);

      // Retrieve PIN and filtered matches from local storage
      const storedPin = localStorage.getItem("pin");
      const storedFilteredMatches = localStorage.getItem("filteredMatches");

      if (storedPin) {
        setPin(storedPin);
      }

      if (storedFilteredMatches) {
        setFilteredMatches(JSON.parse(storedFilteredMatches));
      }
    };
    fetchData();
  }, []);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setPin(value);
      localStorage.setItem("pin", value); // Save PIN to local storage
      if (value.length === 4) {
        setLoading(true);
        setTimeout(() => {
          const umpire = UmpireData.find((umpire) => umpire.pin === value);
          if (umpire) {
            const filtered = matches.filter(
              (match) => match.selectedUmpire === umpire.name
            );
            setFilteredMatches(filtered);
            localStorage.setItem("filteredMatches", JSON.stringify(filtered)); // Save filtered matches to local storage
          } else {
            setFilteredMatches([]);
            localStorage.removeItem("filteredMatches"); // Remove filtered matches from local storage
          }
          setLoading(false);
        }, 500); // Simulate a delay for loading
      } else {
        setFilteredMatches([]);
        localStorage.removeItem("filteredMatches"); // Remove filtered matches from local storage
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Input
        id="pin"
        value={pin}
        onChange={handlePinChange}
        placeholder="PIN"
        type="password"
        maxLength={4}
        className="text-center w-24"
      />
      {loading && <Loading />}
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {filteredMatches.map((match) => (
          <UmpireCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
