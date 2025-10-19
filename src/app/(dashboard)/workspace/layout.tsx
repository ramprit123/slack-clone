import React, { PropsWithChildren } from "react";
import { WorkspaceSidebar } from "./_components/WorkspaceSidebar";
import { ChannelSidebar } from "./_components/ChannelSidebar";

const WorkspaceLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <WorkspaceSidebar />
      <ChannelSidebar />
      {children}
    </div>
  );
};

export default WorkspaceLayout;
