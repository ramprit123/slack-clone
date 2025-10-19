import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import React from "react";
import CreateWorkspace from "./CreateWorkspace";
import { UserMenu } from "./UserProfile";
const organizations = [
  {
    id: "1",
    name: "Workspace",
    initial: "W",
    color: "bg-purple-600",
    hoverColor: "hover:bg-purple-700",
    isActive: true,
  },
  {
    id: "2",
    name: "Team Alpha",
    initial: "T",
    color: "bg-gray-700",
    hoverColor: "hover:bg-gray-600",
    isActive: false,
  },
  {
    id: "3",
    name: "Design Hub",
    initial: "D",
    color: "bg-gray-700",
    hoverColor: "hover:bg-gray-600",
    isActive: false,
  },
  {
    id: "4",
    name: "Marketing",
    initial: "M",
    color: "bg-gray-700",
    hoverColor: "hover:bg-gray-600",
    isActive: false,
  },
];

const getWorkspaceColor = (id: string) => {
  const org = organizations.find((org) => org.id === id);
  return org ? org.color : "bg-gray-700";
};

export const WorkspaceSidebar = () => {
  return (
    <TooltipProvider>
      <div className="w-16 bg-gray-800 flex flex-col items-center justify-between py-4 space-y-4">
        <div className="flex-col gap-3 flex">
          {organizations.map((org) => (
            <Tooltip key={org.id}>
              <TooltipTrigger asChild>
                <div
                  className={`w-10 h-10 ${getWorkspaceColor(
                    org.id
                  )} rounded-lg flex items-center justify-center ${
                    org.isActive ? "text-white" : "text-gray-400"
                  } font-bold text-lg cursor-pointer ${org.hoverColor}`}
                >
                  {org.initial}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{org.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          <CreateWorkspace />
        </div>
        <UserMenu />
      </div>
    </TooltipProvider>
  );
};
