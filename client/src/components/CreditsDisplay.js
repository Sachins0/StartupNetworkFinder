import React from 'react';

const CreditsDisplay = ({ credits }) => {
  return (
    <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full flex items-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
      </svg>
      <span className="font-medium">{credits} Credits</span>
    </div>
  );
};

export default CreditsDisplay;