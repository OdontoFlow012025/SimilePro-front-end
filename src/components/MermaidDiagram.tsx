"use client";
import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidDiagram({ chart }: { chart: string }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true, theme: "default" });
    if (chartRef.current) {
      chartRef.current.innerHTML = "";
      mermaid.render("mermaid-" + Math.random().toString(36).substring(7), chart).then((res) => {
        if (chartRef.current) {
          chartRef.current.innerHTML = res.svg;
        }
      }).catch(err => {
        console.error("Mermaid error", err);
      });
    }
  }, [chart]);

  return <div ref={chartRef} className="my-8 w-full overflow-x-auto flex justify-center bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800" />;
}
