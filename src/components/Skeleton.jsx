import React from "react";

export default function Skeleton({ className = "w-full h-4", circle = false }) {
  return (
    <div className={`bg-gray-200 animate-pulse ${circle ? "rounded-full" : "rounded-lg"} ${className}`}></div>
  );
}
