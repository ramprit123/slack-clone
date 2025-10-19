import { Input } from "@/components/ui/input";
import { Edit3, Search } from "lucide-react";
import React from "react";

export const ChannelSidebar = () => {
  return (
    <div className="w-64 bg-gray-900 flex flex-col border-r border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-white font-bold text-lg cursor-pointer hover:bg-gray-800 px-2 py-1 rounded">
            WorkSpace
          </h1>
          <button className="text-gray-400 hover:text-white">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search WorkSpace"
            className="w-full bg-gray-800 text-gray-300 text-sm pl-9 pr-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
