"use client"

import { useTheme } from "next-themes"
import * as React from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Effectively force hydration to match client to avoid mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <button className="p-2 w-10 h-10" /> // Placeholder to avoid layout shift
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <span className="material-symbols-outlined text-[20px] text-yellow-400">
          light_mode
        </span>
      ) : (
        <span className="material-symbols-outlined text-[20px] text-slate-600 dark:text-slate-400">
          dark_mode
        </span>
      )}
    </button>
  )
}
