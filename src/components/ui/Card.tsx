"use client";
import { cn } from "@/lib/utils";

export default function Card({
  name,
  Icon,
  before,
  after,
}: {
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
  before?: string;
  after?: string;
}) {
  return (
    <div className="max-w-xs w-[20rem]">
      <div
        className={cn(
          "group w-full cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
          "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-50",
          "transition-all duration-500"
        )}
        style={{
          backgroundImage: `url(${before})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onMouseEnter={(e) => {
          (
            e.currentTarget as HTMLElement
          ).style.backgroundImage = `url(${after})`;
        }}
        onMouseLeave={(e) => {
          (
            e.currentTarget as HTMLElement
          ).style.backgroundImage = `url(${before})`;
        }}
      >
        <div className="text relative z-50 bg-black bg-opacity-50 backdrop-blur-md p-4 rounded-md shadow-lg">
          <Icon className="w-12 h-12 mb-2 text-white" />
          <h1 className="font-bold text-xl md:text-3xl text-white relative">
            {name}
          </h1>
        </div>
      </div>
    </div>
  );
}
