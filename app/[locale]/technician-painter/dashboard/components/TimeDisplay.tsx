"use client";
import React from "react";

export function TimeDisplay() {
  const [time, setTime] = React.useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 10000); // update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="ml-4 text-xl font-bold text-gray-700 select-none" style={{ letterSpacing: 2 }}>
      {time}
    </span>
  );
}
