"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/moving-border";
import { match } from "@/lib/data";

import { setMatchType } from "@/lib/feature/teamSlice";
import { useDispatch } from "react-redux";

const Page = () => {
  const [isClicked, setIsClicked] = useState(false);
  const controls = useAnimation();
  const router = useRouter();
  const dispatch = useDispatch();
  const handleClick = () => {
    controls.start({
      opacity: 0,
      x: -200,
      transition: { duration: 0.5 },
    });
    setIsClicked(true);
  };

  const handleButtonClick = (name: string) => {
    router.push(`/${name}`);
    dispatch(setMatchType(name));
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        {!isClicked && (
          <motion.div initial={{ x: 0, opacity: 1 }} animate={controls}>
            <Button
              borderRadius="1.75rem"
              className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
              onClick={handleClick}
            >
              Start the game
            </Button>
          </motion.div>
        )}
        {isClicked &&
          match.map((m, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 200, y: 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
              className="w-full md:w-auto"
            >
              <Button
                borderRadius="1.75rem"
                className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                onClick={() => handleButtonClick(m.name)}
              >
                {m.name}
              </Button>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default Page;
