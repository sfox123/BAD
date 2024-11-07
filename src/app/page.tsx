"use client";

import { useRouter } from "next/navigation";
import { buttonData } from "../lib/data";
import Card from "@/components/ui/Card";

export default function Home() {
  const router = useRouter();

  const handleButtonClick = (path: string) => {
    router.push(`/${path.toLowerCase()}`);
  };

  return (
    <main className="flex flex-col justify-center items-center h-screen p-4">
      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 w-full max-w-4xl">
        {buttonData.map((button) => (
          <div
            onClick={() => handleButtonClick(button.name)}
            key={button.name}
            className="w-full md:w-auto"
          >
            <Card
              name={button.name}
              Icon={button.icon}
              before={button.before}
              after={button.after}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
