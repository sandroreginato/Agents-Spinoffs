import React, { useState } from 'react';
import { AgentPersona } from '../types';

interface AgentCardProps {
  agent: AgentPersona;
  isFavorite: boolean;
  onToggleFavorite: (agent: AgentPersona) => void;
  onStartChat: (agent: AgentPersona) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, isFavorite, onToggleFavorite, onStartChat }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleShare = () => {
    const toBase64 = (str: string) =>
      window.btoa(unescape(encodeURIComponent(str)));
    
    try {
      const agentJson = JSON.stringify(agent);
      const encodedAgent = toBase64(agentJson);
      const baseUrl = window.location.href.split('?')[0];
      const shareUrl = `${baseUrl}?agent=${encodedAgent}`;

      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2500);
      });
    } catch (error) {
      console.error("Failed to create share link:", error);
      alert("Could not create a shareable link.");
    }
  };


  const placeholderImageUrl = `https://picsum.photos/seed/${encodeURIComponent(agent.name)}/400/300`;

  return (
    <div className="bg-brand-secondary rounded-xl overflow-hidden shadow-lg border border-gray-700/50 flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-brand-accent/20">
      <img className="w-full h-48 object-cover" src={placeholderImageUrl} alt={`Avatar for ${agent.name}`} />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-brand-accent mb-2">{agent.name}</h3>
        <p className="text-brand-text-secondary text-sm mb-4 flex-grow">{agent.description}</p>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-brand-text-primary mb-2">Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {agent.expertise.map((item) => (
                <span key={item} className="bg-blue-900/50 text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-brand-text-primary mb-2">Personality Traits</h4>
            <div className="flex flex-wrap gap-2">
              {agent.personalityTraits.map((trait) => (
                <span key={trait} className="bg-green-900/50 text-green-300 text-xs font-medium px-2.5 py-1 rounded-full">
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
       <div className="px-6 pb-4 pt-2 border-t border-gray-700/50 flex justify-between items-center gap-2">
         <button
          onClick={() => onStartChat(agent)}
          className="flex items-center gap-2 text-sm font-semibold bg-brand-accent/20 text-brand-accent px-4 py-2 rounded-md hover:bg-brand-accent/40 transition-colors"
          aria-label="Chat with agent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm1.5 0a.5.5 0 00-.5.5v6a.5.5 0 00.5.5h12a.5.5 0 00.5-.5V5.5a.5.5 0 00-.5-.5H3.5zM5 7a1 1 0 100 2h1a1 1 0 100-2H5zm3 0a1 1 0 100 2h1a1 1 0 100-2H8zm3 0a1 1 0 100 2h1a1 1 0 100-2h-1z" />
          </svg>
          Chat
        </button>
        <div className="flex items-center">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-brand-text-secondary hover:text-brand-text-primary transition-colors duration-200 p-2 rounded-md"
            aria-label="Share agent"
            title="Share agent"
          >
            {copyStatus === 'copied' ? (
              <span className="text-sm text-brand-accent font-semibold">Copied!</span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => onToggleFavorite(agent)}
            className="p-2 rounded-full text-brand-text-secondary hover:text-yellow-400 transition-colors duration-200"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5}>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
