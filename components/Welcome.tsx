
import React from 'react';

const Welcome: React.FC = () => {
  return (
    <div className="text-center py-10 px-6 bg-brand-secondary border border-gray-700/50 rounded-lg max-w-2xl mx-auto">
      <div className="flex justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-brand-text-primary mb-2">Welcome to AI Agent Spinoff</h2>
      <p className="text-brand-text-secondary">
        Your generated AI agent personas will appear here. To get started, simply paste a YouTube video URL into the field above and click "Generate Agents".
      </p>
    </div>
  );
};

export default Welcome;
