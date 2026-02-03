"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";

type TransitionContextType = {
  isLoading: boolean;
  startLoginTransition: () => void;
};

const TransitionContext = createContext<TransitionContextType>({
  isLoading: false,
  startLoginTransition: () => {},
});

export const useTransition = () => useContext(TransitionContext);

export default function TransitionProvider({
  children,
  locale,
  dict
}: {
  children: React.ReactNode;
  locale: string;
  dict: any;
}) {
  const router = useRouter();
  // Stages:
  // 1. starting: Initial Frame (Circle 0%)
  // 2. expanding: Animation to Full Screen (Circle 150%)
  // 3. loading: Progress bar runs
  // 4. focusing: Shrinks to center (Circle 18%)
  // 5. finishing: Fades out
  const [stage, setStage] = useState<'idle' | 'starting' | 'expanding' | 'loading' | 'focusing' | 'finishing'>('idle');
  const [progress, setProgress] = useState(0);

  const startLoginTransition = () => {
    // 1. Mount with 0% circle
    setStage('starting');

    // 2. Trigger Expansion (next tick)
    setTimeout(() => {
        setStage('expanding');
        
        // 3. Start Loading after expansion finishes
        setTimeout(() => {
            setStage('loading');
            
            // Loading Simulation
            let p = 0;
            const interval = setInterval(() => {
                p += Math.random() * 8; 
                if (p > 100) p = 100;
                setProgress(p);

                if (p === 100) {
                    clearInterval(interval);
                    
                    // Shrink to Center (Focusing)
                    setTimeout(() => {
                        setStage('focusing'); 
                        
                        router.push(`/${locale}/dashboard`);
                        
                        setTimeout(() => {
                            setStage('finishing');
                            
                            setTimeout(() => {
                                setStage('idle');
                                setProgress(0);
                            }, 500);
                            
                        }, 800); 
                        
                    }, 400); 
                }
            }, 100); // Slightly faster updates for smoothness
        }, 800); // Match CSS transition duration
    }, 50); // Small delay to ensure 'starting' state renders
  };

  return (
    <TransitionContext.Provider value={{ isLoading: stage !== 'idle', startLoginTransition }}>
      {children}
      
      {/* OVERLAY */}
      {stage !== 'idle' && (
          <div 
            className={`fixed inset-0 z-[200] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out
                ${(stage === 'starting' || stage === 'expanding' || stage === 'loading') ? 'opacity-100' : ''}
                ${stage === 'finishing' ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}
            `}
            style={{
                // Clip Path Animation Logic
                clipPath: (stage === 'starting') 
                    ? 'circle(0% at 50% 50%)' // Start point
                    : (stage === 'expanding' || stage === 'loading') 
                        ? 'circle(150% at 50% 50%)' // Target: Full Screen
                        : (stage === 'focusing' || stage === 'finishing')
                            ? 'circle(18% at 50% 50%)' // Shrink Target
                            : 'circle(0% at 50% 50%)', // Fallback
            }}
          >
             {/* Background - Slate 900 for Dark (Match Login), White for Light */}
             <div className="absolute inset-0 bg-white dark:bg-[#0f172a] transition-colors duration-300"></div>

             {/* Content Container */}
             <div className={`relative z-10 flex flex-col items-center w-64 transition-all duration-500
                 ${stage === 'starting' ? 'opacity-0 scale-50' : ''}
                 ${stage === 'expanding' ? 'opacity-100 scale-100 delay-200' : ''}
                 ${(stage === 'loading' || stage === 'focusing') ? 'opacity-100 scale-100' : ''}
                 ${stage === 'finishing' ? 'scale-90 opacity-0' : ''}
             `}>
                 <div className="text-slate-900 dark:text-white text-5xl font-extrabold mb-8">{Math.round(progress)}%</div>
                 
                 <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden shadow-inner">
                     <div 
                        className="bg-slate-900 dark:bg-white h-full transition-all duration-200 ease-linear"
                        style={{ width: `${progress}%` }}
                     />
                 </div>
                 
                 <p className="text-gray-500 dark:text-gray-400 text-xs mt-4 font-semibold uppercase tracking-widest animate-pulse">
                     {progress < 100 ? (dict?.loadingStart || 'Loading...') : (dict?.loadingEnd || 'Done')}
                 </p>
             </div>
          </div>
      )}
    </TransitionContext.Provider>
  );
}
