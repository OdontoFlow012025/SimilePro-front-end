"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const INACTIVITY_LIMIT_MS = 60 * 60 * 1000; // 1 hour
const CHECK_INTERVAL_MS = 60 * 1000; // Check every minute

interface InactivityHandlerProps {
  locale: string;
}

export default function InactivityHandler({ locale }: InactivityHandlerProps) {
  const router = useRouter();
  const lastActivityRef = useRef<number>(Date.now());
  
  const logout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push(`/${locale}/login`);
    router.refresh();
  };

  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    
    // Updating a ref is cheap, so we can do it on every event without throttling
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    const intervalId = setInterval(() => {
      if (Date.now() - lastActivityRef.current > INACTIVITY_LIMIT_MS) {
        logout();
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(intervalId);
    };
  }, [locale, router]);

  return null;
}
