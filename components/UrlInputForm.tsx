import React, { useState } from 'react';

interface UrlInputFormProps {
  onSubmit: (url: string, options: { count: number; temperature: number }) => void;
  isLoading: boolean;
}

const UrlInputForm: React.FC<UrlInputFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [agentCount, setAgentCount] = useState(3);
  const [temperature, setTemperature] = useState(0.8);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url, { count: agentCount, temperature });
  };

  return (
    <div className="bg-brand-secondary/50 p-4 rounded-lg border border-gray-700/50">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="flex-grow bg-brand-secondary border border-gray-600 text-brand-text-primary placeholder-brand-text-secondary rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all duration-200"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-brand-accent text-white font-bold py-3 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Agents'
          )}
        </button>
      </form>
      <div className="mt-4">
        <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm text-brand-text-secondary hover:text-brand-text-primary transition-colors">
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>
        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-brand-secondary rounded-md">
            <div>
              <label htmlFor="agent-count" className="block text-sm font-medium text-brand-text-primary mb-2">
                Number of Agents ({agentCount})
              </label>
              <input
                id="agent-count"
                type="range"
                min="1"
                max="5"
                step="1"
                value={agentCount}
                onChange={(e) => setAgentCount(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="temperature" className="block text-sm font-medium text-brand-text-primary mb-2">
                Creativity ({temperature.toFixed(1)})
              </label>
              <input
                id="temperature"
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                disabled={isLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlInputForm;
