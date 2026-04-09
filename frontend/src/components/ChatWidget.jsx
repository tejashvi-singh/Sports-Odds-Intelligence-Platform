import React, { useState } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send } from 'lucide-react';

const ChatWidget = ({ currentMatch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! Ask me who will win or about the odds for this match.' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setMessages((prev) => [...prev, { type: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    try {
      if (!currentMatch) {
         setMessages((prev) => [...prev, { type: 'bot', text: 'Please select a match to analyze first!' }]);
         setLoading(false);
         return;
      }

      // Build payload for backend agent
      const payload = {
        query: userMsg,
        teamA: currentMatch.team_a,
        teamB: currentMatch.team_b,
        probabilities: currentMatch.odds
      };

      const res = await axios.post('http://localhost:5001/api/agent/query', payload);
      setMessages((prev) => [...prev, { type: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { type: 'bot', text: 'Error connecting to intelligence system.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 sm:w-96 bg-surface border border-primary/50 shadow-[0_0_15px_rgba(57,255,20,0.2)] rounded-2xl overflow-hidden flex flex-col h-96">
          <div className="bg-background border-b border-border p-4 flex justify-between items-center text-primary">
            <div className="flex items-center gap-2 font-bold tracking-wide">
              <MessageSquare className="w-5 h-5" />
              INTELLIGENCE AGENT
            </div>
            <button onClick={() => setIsOpen(false)} className="text-textMuted hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.type === 'user' ? 'bg-primary/20 border border-primary/30 text-white rounded-br-none' : 'bg-background border border-border text-textMuted rounded-bl-none'}`}>
                  {m.text.split('\n').map((line, j) => <p key={j} className={line.startsWith('🤖') ? 'text-primary font-mono mt-1' : ''}>{line}</p>)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-background border border-border text-primary p-3 rounded-lg text-sm animate-pulse rounded-bl-none">
                  Analyzing odds...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-background border-t border-border flex items-center gap-2">
            <input 
              type="text" 
              className="flex-1 bg-surface border border-border text-white px-4 py-2 rounded-full focus:outline-none focus:border-primary text-sm"
              placeholder="Ask about the odds..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="bg-primary hover:bg-primaryHover text-black p-2 rounded-full transition shadow-[0_0_10px_rgba(57,255,20,0.4)]">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primaryHover hover:scale-105 transition-all text-black p-4 rounded-full shadow-[0_0_20px_rgba(57,255,20,0.5)] flex items-center gap-2 font-bold"
        >
          <MessageSquare className="w-6 h-6" />
          Ask AI
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
