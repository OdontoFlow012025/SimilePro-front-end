"use client";

import { useState } from "react";
import SidebarFilters from "./SidebarFilters";
import CalendarWrapper from "./CalendarWrapper";

interface AgendaClientWrapperProps {
    dictionary: any;
    locale: string;
}

export default function AgendaClientWrapper({ dictionary, locale }: AgendaClientWrapperProps) {
    const [selectedProfessionalsIds, setSelectedProfessionalsIds] = useState<number[]>([]);

    return (
        <div className="p-6 h-[calc(100vh-64px)] overflow-hidden flex flex-col lg:flex-row gap-6">
            <SidebarFilters 
                dictionary={dictionary} 
                locale={locale} 
                onProfessionalsChange={setSelectedProfessionalsIds}
            />
            <div className="flex-1 h-full overflow-hidden">
                <CalendarWrapper 
                    locale={locale} 
                    dictionary={dictionary} 
                    selectedProfessionalsIds={selectedProfessionalsIds}
                />
            </div>
        </div>
    );
}
