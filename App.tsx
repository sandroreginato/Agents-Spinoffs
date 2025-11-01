import React, { useState, useCallback, useEffect } from 'react';
import { AgentPersona } from './types';
import { mockFetchTranscript } from './services/youtubeService';
import { generateAgentPersonas } from './services/geminiService';
import Header from './components/Header';
import UrlInputForm from './components/UrlInputForm';
import AgentCard from './components/AgentCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Welcome from './components/Welcome';
import ChatModal from './components/ChatModal';

const App: React.FC = () => {
  const [agentPersonas, setAgentPersonas] = useState<AgentPersona[]>([]);
  const [favorites, setFavorites] = useState<AgentPersona[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSharedView, setIsSharedView] = useState<boolean>(false);

  const [chattingAgent, setChattingAgent] = useState<AgentPersona | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);


  useEffect(() => {
    // Check for shared agent in URL on mount
    const urlParams = new URLSearchParams(window.location.search);
    const agentData = urlParams.get('agent');
    if (agentData) {
      try {
        const fromBase64 = (str: string) =>
          decodeURIComponent(escape(window.atob(str)));
        const decodedAgent = JSON.parse(fromBase64(agentData));
        if (decodedAgent.name && decodedAgent.description) {
          setAgentPersonas([decodedAgent]);
          setIsSharedView(true);
        }
      } catch (e) {
        console.error("Failed to parse shared agent data", e);
        const cleanUrl = window.location.href.split('?')[0];
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }

    // Load favorites from localStorage on mount
    try {
      const storedFavorites = localStorage.getItem('favoriteAgents');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (e) {
      console.error("Failed to parse favorites from localStorage", e);
      localStorage.removeItem('favoriteAgents');
    }
  }, []);
  
  const handleStartChat = useCallback((agent: AgentPersona) => {
    setChattingAgent(agent);
    setIsChatOpen(true);
  }, []);

  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false);
    setChattingAgent(null);
  }, []);


  const toggleFavorite = useCallback((agent: AgentPersona) => {
    setFavorites(prevFavorites => {
      const isAlreadyFavorited = prevFavorites.some(fav => fav.name === agent.name);
      let newFavorites;
      if (isAlreadyFavorited) {
        newFavorites = prevFavorites.filter(fav => fav.name !== agent.name);
      } else {
        newFavorites = [...prevFavorites, agent];
      }
      localStorage.setItem('favoriteAgents', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const handleGenerate = useCallback(async (url: string, options: { count: number; temperature: number }) => {
    if (!url) {
      setError('Please enter a YouTube URL.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAgentPersonas([]);
    setIsSharedView(false);
    const cleanUrl = window.location.href.split('?')[0];
    window.history.replaceState({}, document.title, cleanUrl);


    try {
      const transcript = await mockFetchTranscript(url);
      if (!transcript) {
        throw new Error('Could not retrieve transcript for this video.');
      }
      const personas = await generateAgentPersonas(transcript, options.count, options.temperature);
      setAgentPersonas(personas);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error('Generation failed:', errorMessage);
      setError(`Failed to generate agents. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleClearFavorites = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all your favorite agents? This action cannot be undone.')) {
      setFavorites([]);
      localStorage.removeItem('favoriteAgents');
    }
  }, []);

  const handleExportFavorites = useCallback(() => {
    if (favorites.length === 0) {
      alert("You have no favorites to export.");
      return;
    }
    const blob = new Blob([JSON.stringify(favorites, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agent-personas-favorites.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [favorites]);

  const handleImportFavorites = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File could not be read.");
        const imported = JSON.parse(text);

        if (Array.isArray(imported) && (imported.length === 0 || imported[0].name)) {
          const existingNames = new Set(favorites.map(f => f.name));
          const newFavorites = imported.filter((agent: AgentPersona) => !existingNames.has(agent.name));
          
          const updatedFavorites = [...favorites, ...newFavorites];
          setFavorites(updatedFavorites);
          localStorage.setItem('favoriteAgents', JSON.stringify(updatedFavorites));
          alert(`Successfully imported ${newFavorites.length} new agents.`);
        } else {
          throw new Error("Invalid file format.");
        }
      } catch (error) {
        console.error("Failed to import favorites:", error);
        alert("Failed to import favorites. Please make sure it's a valid JSON file.");
      } finally {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  }, [favorites]);


  const hasContent = agentPersonas.length > 0 || favorites.length > 0;

  return (
    <div className="min-h-screen bg-brand-primary font-sans">
      <Header 
        onClearFavorites={handleClearFavorites}
        onExportFavorites={handleExportFavorites}
        onImportFavorites={handleImportFavorites}
        hasFavorites={favorites.length > 0}
      />
      <main className="container mx-auto p-4 md:p-8">
        {isSharedView ? (
          <div className="text-center mb-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-brand-text-primary mb-2">Shared Agent Persona</h2>
            <p className="text-brand-text-secondary">This agent was shared with you.</p>
            <a href={window.location.href.split('?')[0]} className="mt-4 inline-block bg-brand-accent text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
              ← Create Your Own Agents
            </a>
          </div>
        ) : (
          <>
            <div className="max-w-3xl mx-auto">
              <p className="text-center text-brand-text-secondary mb-8">
                Enter a YouTube video URL to analyze its transcript and generate specialized AI agent personas based on the content.
              </p>
              <UrlInputForm onSubmit={handleGenerate} isLoading={isLoading} />
            </div>
            {favorites.length > 0 && !isLoading && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-center mb-6 text-brand-text-primary border-b border-brand-secondary pb-4">Your Favorite Agents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                  {favorites.map((agent) => (
                    <AgentCard
                      key={`fav-${agent.name}`}
                      agent={agent}
                      isFavorite={true}
                      onToggleFavorite={toggleFavorite}
                      onStartChat={handleStartChat}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="mt-12">
          {isLoading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          
          {!isLoading && !error && !hasContent && !isSharedView && <Welcome />}

          {agentPersonas.length > 0 && (
             <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isSharedView ? 'max-w-xl mx-auto' : ''}`}>
              {agentPersonas.map((agent) => (
                <AgentCard
                  key={agent.name}
                  agent={agent}
                  isFavorite={favorites.some(fav => fav.name === agent.name)}
                  onToggleFavorite={toggleFavorite}
                  onStartChat={handleStartChat}
                />
              ))}
            </div>
          )}
        </div>
      </main>
       <footer className="text-center py-6 text-brand-text-secondary text-sm">
        <p>Powered by Gemini API</p>
      </footer>
      {isChatOpen && chattingAgent && (
        <ChatModal agent={chattingAgent} onClose={handleCloseChat} />
      )}
    </div>
  );
};

export default App;
