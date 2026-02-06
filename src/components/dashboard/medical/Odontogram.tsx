"use client";

import { useState } from "react";
import { Tooth } from "./Tooth";

// Standard ISO 3950 / FDI Notation
const UPPER_TEETH = [
    18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28
];
const LOWER_TEETH = [
    48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38
];

type ToolType = 'explorer' | 'cavity' | 'restoration' | 'extraction' | 'crown';

interface OdontogramProps {
  dictionary: any;
}

export default function Odontogram({ dictionary }: OdontogramProps) {
  // State: Record<ToothID, Record<FaceID, Status>>
  const [toothState, setToothState] = useState<Record<number, Record<string, string>>>({});
  const [selectedTool, setSelectedTool] = useState<ToolType>('explorer');
  
  const dict = dictionary?.dashboard?.medical?.odontogram;

  const handleFaceClick = (toothId: number, face: string) => {
      setToothState(prev => {
          const tooth = prev[toothId] || {};
          let newStatus = "";

          // Logic based on tool
          if (selectedTool === 'explorer') {
              // Just toggle selection or info (for now reset)
              newStatus = tooth[face] ? "" : "selected"; 
          } else if (selectedTool === 'extraction') {
             // Mark all faces
             newStatus = 'missing';
             return {
                 ...prev,
                 [toothId]: { O:'missing', V:'missing', L:'missing', M:'missing', D:'missing' }
             };
          } else {
              // Apply tool status
              newStatus = tooth[face] === selectedTool ? "" : selectedTool;
          }

          return {
              ...prev,
              [toothId]: {
                  ...tooth,
                  [face]: newStatus
              }
          };
      });
  };

  const tools = [
      { id: 'explorer', icon: 'dentistry', label: dict?.tools?.explorer || 'Explorador', color: 'bg-gray-200 text-gray-700' },
      { id: 'cavity', icon: 'coronavirus', label: dict?.tools?.cavity || 'Cárie', color: 'bg-red-100 text-red-700' },
      { id: 'restoration', icon: 'healing', label: dict?.tools?.restoration || 'Restauração', color: 'bg-blue-100 text-blue-700' },
      { id: 'crown', icon: 'diamond', label: dict?.tools?.crown || 'Coroa', color: 'bg-yellow-100 text-yellow-700' },
      { id: 'extraction', icon: 'close', label: dict?.tools?.extraction || 'Extraído', color: 'bg-gray-800 text-white' },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-wrap gap-2 justify-center">
            {tools.map(tool => (
                <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id as ToolType)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border-2 ${selectedTool === tool.id ? 'border-primary-500 ring-2 ring-primary-200 ' + tool.color : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}
                >
                    <span className="material-symbols-outlined text-[18px]">{tool.icon}</span>
                    {tool.label}
                </button>
            ))}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-950/50">
            <svg viewBox="0 0 800 400" className="w-full max-w-4xl select-none filter drop-shadow-sm">
                
                {/* Quadrant Separators (Cross) */}
                {/* Vertical Center - Exactly at 400 */}
                <line x1="400" y1="20" x2="400" y2="330" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
                
                {/* Horizontal Center - Separating Upper/Lower Arches */}
                <line x1="40" y1="175" x2="760" y2="175" stroke="#ef4444" strokeWidth="2" opacity="0.6" />

                {/* Upper Arch */}
                <g transform="translate(0, 50)">
                    {UPPER_TEETH.map((id, index) => (
                        <Tooth 
                            key={id} 
                            id={id} 
                            // Calculation for perfect centering at 400:
                            // StartX = 55, Step = 45, Gap at center = 15 (effectively pushes right side to match symmetry)
                            x={index * 45 + 55 + (index >= 8 ? 15 : 0)} 
                            y={50} 
                            label={id.toString()}
                            data={toothState[id] || {}}
                            dictionary={dictionary}
                            onFaceClick={(face) => handleFaceClick(id, face)}
                        />
                    ))}
                    <text x="400" y="0" textAnchor="middle" className="fill-gray-400 text-xs uppercase tracking-widest font-bold">{dict?.arches?.upper || "Arcada Superior"}</text>
                </g>

                {/* Lower Arch */}
                <g transform="translate(0, 250)">
                    {LOWER_TEETH.map((id, index) => (
                        <Tooth 
                            key={id} 
                            id={id} 
                            // Center aligned
                            x={index * 45 + 55 + (index >= 8 ? 15 : 0)} 
                            y={0} 
                            label={id.toString()}
                            data={toothState[id] || {}}
                            dictionary={dictionary}
                            onFaceClick={(face) => handleFaceClick(id, face)}
                        />
                    ))}
                    <text x="400" y="80" textAnchor="middle" className="fill-gray-400 text-xs uppercase tracking-widest font-bold">{dict?.arches?.lower || "Arcada Inferior"}</text>
                </g>

            </svg>
        </div>
        
        {/* Status Bar */}
        <div className="p-2 text-center text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800">
           {dict?.helpText || "Clique nas faces do dente para aplicar a ferramenta selecionada."}
        </div>
    </div>
  );
}

