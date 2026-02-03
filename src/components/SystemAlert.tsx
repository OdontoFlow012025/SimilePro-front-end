"use client";

import { useEffect, useState } from "react";

type AlertDictionary = {
  title: string;
  message: string;
  close: string;
  closeTimer: string;
};

export default function SystemAlert({ dict }: { dict: AlertDictionary }) {
  // Always visible on mount for testing as requested
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (!isVisible) return;
    
    // Timer countdown
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [isVisible, timeLeft]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-yellow-400 px-6 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.15)]">
      <div className="flex w-full max-w-5xl flex-col items-center gap-2 text-center">
        
        {/* Warning Icon (Top) */}
        <div className="flex h-10 w-10 shrink-0 animate-pulse items-center justify-center rounded-full bg-red-100">
           <span className="material-symbols-outlined text-2xl font-bold text-red-600">warning</span>
        </div>

        {/* Title (Middle) */}
        <h3 className="text-lg font-bold text-red-900 leading-tight">
            {dict?.title}
        </h3>

        {/* Message (Bottom) */}
        <p className="text-sm font-medium text-yellow-900 max-w-2xl leading-relaxed">
            {dict?.message}
        </p>

        {/* Close Button (Absolute on Right) */}
        <button
          onClick={handleClose}
          disabled={timeLeft > 0}
          className={`absolute right-6 top-1/2 -translate-y-1/2 rounded-lg px-6 py-2.5 text-sm font-bold shadow-sm transition-all
            ${timeLeft > 0 
              ? 'cursor-not-allowed bg-yellow-600 text-yellow-200 opacity-80' 
              : 'cursor-pointer bg-red-600 text-white hover:bg-red-700 hover:shadow-md'
            }`}
        >
          {timeLeft > 0 ? `${dict?.closeTimer} (${timeLeft}s)` : dict?.close}
        </button>
      </div>
    </div>
  );
}
