"use client";
import { match } from "@/lib/data";
import { IconArrowForward } from "@tabler/icons-react";
import { useRouter, notFound } from "next/navigation";
import TeamDisplay from "@/components/ui/TeamDisplay";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

interface Params {
  propName: string;
}

const getMatchedItem = (propName: string) => {
  return match.find((m) => m.name === propName);
};

const DynamicPage = ({ params }: { params: Params }) => {
  const matchedItem = getMatchedItem(params.propName);
  const router = useRouter();
  const teamState = useSelector((state: RootState) => state.team);

  if (!matchedItem) {
    notFound();
    return null; // Ensure the component returns null if notFound is called
  }

  const handleNextClick = async () => {
    console.log("Team State:", teamState);

    // Save the team state to Firebase
    try {
      await addDoc(collection(db, "teamState"), teamState);
      console.log("Document successfully written!");
    } catch (error) {
      console.error("Error writing wtf document: ", error);
    }

    router.push("/match_fix");
  };

  const isNextButtonDisabled = teamState.teamA === teamState.teamB;

  return (
    <div className="h-screen bg-black flex flex-col justify-center items-center">
      <h1 className="text-white mb-8">MATCH TYPE : {matchedItem.name}</h1>

      <div className="flex justify-around w-full">
        {/* Left Team Display */}
        <div className="w-64 h-64">
          <TeamDisplay initialTeamIndex={0} teamType="A" />
        </div>

        {/* VS Text */}
        <div className="text-white self-center text-2xl">VS</div>

        {/* Right Team Display */}
        <div className="w-64 h-64">
          <TeamDisplay initialTeamIndex={1} teamType="B" />
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-center w-full mt-8">
        <button
          onClick={handleNextClick}
          className={`px-6 py-3 rounded-full flex items-center shadow-lg transition-all duration-200 ${
            isNextButtonDisabled
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-700 hover:shadow-xl active:bg-gray-600 active:shadow-md"
          }`}
          disabled={isNextButtonDisabled}
        >
          Next
          <IconArrowForward className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default DynamicPage;
