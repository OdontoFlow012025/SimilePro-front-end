"use client";

import React, { useState } from "react";
import TeamList from "./TeamList";
import TeamFormModal from "./TeamFormModal";

export default function TeamDashboard({ dict }: { dict: any }) {
  const teamDict = dict.team;
  const [activeTab, setActiveTab] = useState<"dentistas" | "tecnicos" | "secretarias" | "recepcionistas" | "administradores">("dentistas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<any>(null);

  const handleOpenModal = (member?: any) => {
    setMemberToEdit(member || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMemberToEdit(null);
  };

  const tabs = [
    { id: "dentistas", label: teamDict.tabs.dentists },
    { id: "tecnicos", label: teamDict.tabs.technicians },
    { id: "recepcionistas", label: teamDict.tabs.receptionists },
    { id: "secretarias", label: teamDict.tabs.finance },
    { id: "administradores", label: teamDict.tabs.admins },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111518] dark:text-white mb-2">
            {teamDict.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {teamDict.subtitle}
          </p>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          {teamDict.addMemberBtn}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 overflow-x-auto overflow-y-hidden scrollbar-hide">
        <ul className="flex flex-nowrap -mb-px text-sm font-medium text-center whitespace-nowrap" role="tablist">
          {tabs.map(tab => (
            <li className="mr-2" role="presentation" key={tab.id}>
              <button
                className={`inline-block px-4 py-3 rounded-t-lg border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 dark:text-blue-500 dark:border-blue-500"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 dark:text-gray-400 text-gray-500"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden min-h-[400px]">
         <TeamList 
            type={activeTab} 
            onEdit={handleOpenModal} 
            dict={dict}
         />
      </div>

      {/* Unified Form Modal */}
      {isModalOpen && (
        <TeamFormModal 
           onClose={handleCloseModal} 
           initialData={memberToEdit} 
           defaultType={activeTab} 
           dict={dict}
        />
      )}
    </div>
  );
}
