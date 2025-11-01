import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { AgentPersona, ChatMessage } from '../types';

interface ChatModalProps {
  agent: AgentPersona;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ agent, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        const systemInstruction = `You are an AI assistant embodying the persona of ${agent.name}.
        Your background: ${agent.description}.
        Your expertise lies in: ${agent.expertise.join(', ')}.
        Your personality is: ${agent.personalityTraits.join(', ')}.
        Converse with the user strictly according to this persona. Do not break character. Start the conversation by greeting the user and introducing yourself.`;

        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: { systemInstruction },
        });

        // Generate the initial greeting message from the agent
        setIsLoading(true);
        const initialResponse = await chatRef.current.sendMessageStream({ message: "Hello" });
        
        let initialContent = '';
        setMessages([{ role: 'model', content: '' }]);
        for await (const chunk of initialResponse) {
          initialContent += chunk.text;
          setMessages([{ role: 'model', content: initialContent }]);
        }

      } catch (err) {
        console.error("Failed to initialize chat:", err);
        setMessages([{ role: 'model', content: 'Sorry, I am unable to start a chat right now.' }]);
      } finally {
        setIsLoading(false);
      }
    };
    initChat();
  }, [agent]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage, { role: 'model', content: '' }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessageStream({ message: input });
      let currentContent = '';
      for await (const chunk of response) {
        currentContent += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', content: currentContent };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { role: 'model', content: "I'm sorry, I encountered an error." };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-primary bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-brand-secondary rounded-lg shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col border border-gray-700">
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-brand-text-primary">Chat with <span className="text-brand-accent">{agent.name}</span></h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors" aria-label="Close chat">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <main className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-brand-accent text-white' : 'bg-gray-700 text-brand-text-primary'}`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.role === 'model' && isLoading && index === messages.length -1 && <span className="inline-block w-2 h-4 bg-white animate-pulse ml-1"></span>}
              </div>
            </div>
          ))}
           <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 border-t border-gray-700">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-brand-accent text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default ChatModal;
