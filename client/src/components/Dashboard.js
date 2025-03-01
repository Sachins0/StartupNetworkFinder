import React, { useState } from 'react';
import SearchBox from './SearchBox';
import CreditsDisplay from './CreditsDisplay';
import AllInvestors from './AllInvestors';

const Dashboard = ({ onLogout, userData }) => {
  const [credits, setCredits] = useState(userData?.credits || localStorage.getItem('credits') || 0);
  localStorage.setItem('credits',credits)

  const handleCreditUpdate = (newCredits) => {
    setCredits(newCredits);
    localStorage.setItem('credits',newCredits)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">Startup Network Finder</h1>
            <div className="flex items-center gap-4">
              <CreditsDisplay credits={credits} />
              <button
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <SearchBox onCreditUpdate={handleCreditUpdate} />
        <AllInvestors/>
      </main>
      
    </div>
  );
};

export default Dashboard;