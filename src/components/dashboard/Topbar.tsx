"use client";
import { Search } from "./icons";

export const Topbar = () => {
  return (
    <header className="flex items-center gap-4 px-8 py-4">
      <div className="flex-1 relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-unselected"
        />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-bg-soft text-[14px] font-[350] placeholder:text-unselected/50 outline-none focus:border-primary transition"
        />
      </div>
    </header>
  );
};
