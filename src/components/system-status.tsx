"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function SystemStatus() {
  const [status, setStatus] = useState<number | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get("/api/health");
        setStatus(response.data.status);
      } catch (error) {
        console.error("Health check failed:", error);
        setStatus(500);
      }
    };

    checkHealth();
  }, []);

  if (status === null) {
    return (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-muted animate-pulse"></span>
        <span className="text-muted-foreground">Checking status...</span>
      </div>
    );
  }

  return (
    <p className={`font-medium flex items-center gap-2 ${status === 200 ? 'text-emerald-500' : 'text-red-500'}`}>
      {status === 200 ? (
        <>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          All systems operational
        </>
      ) : (
        <>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          We&apos;ll be back soon
        </>
      )}
    </p>
  );
}
