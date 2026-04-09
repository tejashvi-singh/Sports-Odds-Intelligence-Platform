import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MatchCard from '../components/MatchCard';
import ChatWidget from '../components/ChatWidget';
import { Activity } from 'lucide-react';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  // Using pseudo-auth for favorites in this demo
  const [favorites, setFavorites] = useState([]);
  const [selectedMatchForChat, setSelectedMatchForChat] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/matches');
        setMatches(res.data);
        if (res.data.length > 0) {
          setSelectedMatchForChat(res.data[0]); // default
        }
      } catch (err) {
        console.error('Failed to fetch matches', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const handleToggleFavorite = (matchId) => {
    setFavorites((prev) => 
      prev.includes(matchId) ? prev.filter(id => id !== matchId) : [...prev, matchId]
    );
  };

  return (
    <div className="min-h-screen bg-background text-text p-6 md:p-12 relative overflow-hidden">
      {/* Background neon glow */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <header className="mb-12 flex items-center justify-between z-10 relative">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-3">
            <Activity className="text-primary w-10 h-10" />
            ODDS<span className="text-primary">INTELLIGENCE</span>
          </h1>
          <p className="text-textMuted mt-2 text-sm md:text-base">Advanced Rating-Based Probability Models.</p>
        </div>
        
        {/* Simple mock login indicator */}
        <div className="bg-surface border border-border px-4 py-2 rounded-full text-sm text-textMuted tracking-wider hidden md:block">
          GUEST_SESSION // ACTIVE
        </div>
      </header>

      <main className="z-10 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-12 h-12 border-4 border-surface border-t-primary rounded-full animate-spin"></div>
            <p className="text-textMuted tracking-widest uppercase text-sm">Initializing Models...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {matches.map(match => (
              <div key={match.id} onClick={() => setSelectedMatchForChat(match)} className={selectedMatchForChat?.id === match.id ? "ring-2 ring-primary ring-offset-4 ring-offset-background rounded-xl transition" : ""}>
                 <MatchCard 
                  match={match} 
                  isFavorite={favorites.includes(match.id)}
                  onToggleFavorite={handleToggleFavorite}
                 />
              </div>
            ))}
          </div>
        )}
      </main>

      <ChatWidget currentMatch={selectedMatchForChat} />
    </div>
  );
};

export default MatchesPage;
