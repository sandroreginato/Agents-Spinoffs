
import React, { useState, useRef, useEffect } from 'react';
import Menu from './Menu';

interface HeaderProps {
  onClearFavorites: () => void;
  onExportFavorites: () => void;
  onImportFavorites: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hasFavorites: boolean;
}

const Header: React.FC<HeaderProps> = ({ onClearFavorites, onExportFavorites, onImportFavorites, hasFavorites }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="py-6 border-b border-brand-secondary">
      <div className="container mx-auto px-4 flex justify-center items-center relative">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text-primary">
            <span className="text-brand-accent">AI</span> Agent Spinoff
          </h1>
          <p className="text-brand-text-secondary mt-1">
            Create AI Personas from YouTube Transcripts
          </p>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="p-2 rounded-full hover:bg-brand-secondary transition-colors"
              aria-label="Open menu"
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
            </button>
            {isMenuOpen && (
                <Menu
                    onClearFavorites={onClearFavorites}
                    onExportFavorites={onExportFavorites}
                    onImportFavorites={onImportFavorites}
                    onClose={() => setIsMenuOpen(false)}
                    hasFavorites={hasFavorites}
                />
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
