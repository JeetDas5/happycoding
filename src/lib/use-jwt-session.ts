"use client";

import { useEffect, useState, useCallback } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface SessionData {
  user: User | null;
}

export function useJwtSession() {
  const [state, setState] = useState<{
    data: SessionData | null;
    isPending: boolean;
    isRefetching: boolean;
  }>({
    data: null,
    isPending: true,
    isRefetching: false,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        });
        const sessionData = await response.json();
        if (isMounted) {
          setState({
            data: sessionData,
            isPending: false,
            isRefetching: false,
          });
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
        if (isMounted) {
          setState({
            data: { user: null },
            isPending: false,
            isRefetching: false,
          });
        }
      }
    };

    fetchSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, isRefetching: true }));
    try {
      const response = await fetch("/api/auth/session", {
        cache: "no-store",
      });
      const sessionData = await response.json();
      setState({
        data: sessionData,
        isPending: false,
        isRefetching: false,
      });
    } catch (error) {
      console.error("Failed to fetch session:", error);
      setState({
        data: { user: null },
        isPending: false,
        isRefetching: false,
      });
    }
  }, []);

  return {
    data: state.data,
    isPending: state.isPending,
    isRefetching: state.isRefetching,
    refetch,
  };
}
