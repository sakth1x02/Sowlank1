import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-gray-200",
      className
    )}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{
        transform: `translateX(-${100 - (value || 0)}%)`,
        rotate: className?.includes("h-24") ? "270deg" : "0deg", // Rotate for circular progress
      }}
    />
  </div>
));

Progress.displayName = "Progress";

export { Progress };

export default function CircularProgressDemo({ progressValue }) {
  const value = (progressValue / 12) * 100;

  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full border-8 border-gray-300 opacity-20" />

        {/* Progress circle */}
        <Progress
          value={value}
          className="h-24 w-24 [&>div]:bg-yellow-400 [&>div]:transition-all"
        />

        {/* Center text */}
        <span className="absolute text-xl font-medium">{progressValue}/12</span>
      </div>
    </div>
  );
}
