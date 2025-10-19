"use client";

import { useOrganizations } from "@/hooks/useOrganizations";
import { Button } from "@/components/ui/button";
import { Loader2, Building2 } from "lucide-react";
import CreateWorkspace from "./CreateWorkspace";

export default function WorkspaceList() {
  const { organizations, isLoading, error, refetch } = useOrganizations();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading workspaces...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">Error loading workspaces: {error}</p>
        <Button onClick={refetch} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Workspaces</h2>
        <CreateWorkspace onWorkspaceCreated={refetch} />
      </div>

      {organizations.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No workspaces yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first workspace to get started with organizing your
            projects.
          </p>
          <CreateWorkspace onWorkspaceCreated={refetch} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.map((org) => (
            <div
              key={org.code}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                // Navigate to workspace
                window.location.href = `/workspace/${org.code}`;
              }}
            >
              <div className="flex items-center mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold mr-3"
                  style={{ backgroundColor: org.background_color || "#1f2937" }}
                >
                  {org.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium">{org.name}</h3>
                  <p className="text-sm text-gray-500">{org.code}</p>
                </div>
              </div>
              {org.created_on && (
                <p className="text-xs text-gray-400">
                  Created {new Date(org.created_on).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
