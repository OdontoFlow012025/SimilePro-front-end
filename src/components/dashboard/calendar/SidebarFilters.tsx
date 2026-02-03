"use client";

import { useState } from "react";
import MiniCalendar from "./MiniCalendar";
import { RESOURCES } from "./mockData";

export default function SidebarFilters({ dictionary, locale }: { dictionary: any, locale: string }) {
    const [selectedResources, setSelectedResources] = useState<number[]>(RESOURCES.map(r => r.id));

    const toggleResource = (id: number) => {
        if (selectedResources.includes(id)) {
            setSelectedResources(selectedResources.filter(r => r !== id));
        } else {
            setSelectedResources([...selectedResources, id]);
        }
    };

    return (
        <div className="w-full lg:w-64 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 h-fit space-y-6">
            <div>
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider">
                    {dictionary?.dashboard?.sidebarFilters?.calendar || "Calendário"}
                </h3>
                <MiniCalendar locale={locale} />
            </div>

            <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                    {dictionary?.dashboard?.sidebarFilters?.professionals || "Profissionais"}
                </h3>
                <div className="space-y-2">
                    {RESOURCES.map(resource => (
                        <label key={resource.id} className="flex items-center gap-3 cursor-pointer group">
                             <div className={`size-5 rounded border flex items-center justify-center transition-colors ${selectedResources.includes(resource.id) ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600'}`}>
                                {selectedResources.includes(resource.id) && <span className="material-symbols-outlined text-white text-[16px]">check</span>}
                             </div>
                             <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={selectedResources.includes(resource.id)}
                                onChange={() => toggleResource(resource.id)}
                             />
                             <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">{resource.title}</span>
                        </label>
                    ))}
                </div>
            </div>

             <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                    {dictionary?.dashboard?.sidebarFilters?.rooms || "Salas"}
                </h3>
                <div className="space-y-2">
                     <label className="flex items-center gap-3 cursor-pointer">
                        <div className="size-5 rounded border bg-blue-500 border-blue-500 flex items-center justify-center text-white">
                             <span className="material-symbols-outlined text-[16px]">check</span>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            {dictionary?.dashboard?.sidebarFilters?.allRooms || "Todas as Salas"}
                        </span>
                     </label>
                </div>
            </div>
        </div>
    );
}
