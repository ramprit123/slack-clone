"use client";

import { useState, useEffect } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

interface Organization {
  code: string;
  name: string;
  external_id?: string;
  background_color?: string;
  button_color?: string;
  created_on?: string;
}

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useKindeBrowserClient();

  const fetchOrganizations = async () => {
    if (!isAuthenticated || authLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/organizations");
      
      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }

      const data = await response.json();
      setOrganizations(data.organizations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching organizations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [isAuthenticated, authLoading]);

  const refetch = () => {
    fetchOrganizations();
  };

  return {
    organizations,
    isLoading,
    error,
    refetch,
  };
}