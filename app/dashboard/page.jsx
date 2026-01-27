import React from 'react'
import { DashboardProvider } from "./context/DashboardProvider";
import { GeneralHeader } from "./components/GeneralHeader.jsx";
import { GeneralTabList } from "./components/GeneralTabList";

export default function Dashboard() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <GeneralHeader />
        </header>

        <div className="flex flex-col items-center justify-center container px-4 py-6">
          <GeneralTabList />
        </div>
      </div>
    </DashboardProvider>
  );
}