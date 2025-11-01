
import React, { useRef } from 'react';

interface MenuProps {
  onClearFavorites: () => void;
  onExportFavorites: () => void;
  onImportFavorites: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  hasFavorites: boolean;
}

const Menu: React.FC<MenuProps> = ({ onClearFavorites, onExportFavorites, onImportFavorites, onClose, hasFavorites }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleItemClick = (action: () => void) => {
    action();
    onClose();
  };

  const handleImportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onImportFavorites(event);
    onClose();
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-56 bg-brand-secondary rounded-md shadow-lg border border-gray-700/50 z-50">
      <div className="py-1">
        <button
          onClick={() => handleItemClick(handleImportClick)}
          className="w-full text-left px-4 py-2 text-sm text-brand-text-primary hover:bg-brand-accent/20 transition-colors"
        >
          Import Favorites...
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportChange}
          className="hidden"
          accept="application/json"
        />
        <button
          onClick={() => handleItemClick(onExportFavorites)}
          disabled={!hasFavorites}
          className="w-full text-left px-4 py-2 text-sm text-brand-text-primary hover:bg-brand-accent/20 transition-colors disabled:text-brand-text-secondary disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          Export Favorites
        </button>
        <div className="border-t border-gray-700/50 my-1"></div>
        <button
          onClick={() => handleItemClick(onClearFavorites)}
          disabled={!hasFavorites}
          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/50 transition-colors disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          Clear All Favorites
        </button>
      </div>
    </div>
  );
};

export default Menu;
