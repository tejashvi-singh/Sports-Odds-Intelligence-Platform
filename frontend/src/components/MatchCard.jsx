import React from 'react';
import { Heart } from 'lucide-react';
import clsx from 'clsx';

const MatchCard = ({ match, isFavorite, onToggleFavorite }) => {
  const { team_a, team_b, start_time, odds } = match;
  
  const probA = odds?.prob_a ? odds.prob_a * 100 : 50;
  const probB = odds?.prob_b ? odds.prob_b * 100 : 50;
  const probDraw = odds?.prob_draw ? odds.prob_draw * 100 : 0;

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-primary/30 transition-colors">
      <button 
        onClick={() => onToggleFavorite(match.id)}
        className="absolute top-4 right-4 text-textMuted hover:text-primary transition-colors"
      >
        <Heart className={clsx("w-6 h-6", isFavorite ? "fill-primary text-primary" : "")} />
      </button>

      <div className="text-xs text-textMuted font-semibold tracking-wider mb-4 uppercase">
        {new Date(start_time).toLocaleString()}
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 text-center font-bold text-xl">{team_a}</div>
        <div className="px-4 text-textMuted font-medium text-sm">VS</div>
        <div className="flex-1 text-center font-bold text-xl">{team_b}</div>
      </div>

      {odds ? (
        <div className="space-y-4">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-primary">{probA.toFixed(1)}%</span>
            <span className="text-textMuted">Draw {probDraw.toFixed(1)}%</span>
            <span className="text-blue-400">{probB.toFixed(1)}%</span>
          </div>
          
          <div className="w-full h-3 rounded-full bg-border flex overflow-hidden">
            <div className="bg-primary h-full transition-all duration-500" style={{ width: `${probA}%` }}></div>
            <div className="bg-gray-600 h-full transition-all duration-500" style={{ width: `${probDraw}%` }}></div>
            <div className="bg-blue-400 h-full transition-all duration-500" style={{ width: `${probB}%` }}></div>
          </div>
          
          <div className="flex justify-between mt-4">
            <div className="text-center">
              <div className="text-xs text-textMuted mb-1">Odds A</div>
              <div className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-md">{odds.odds_a}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-textMuted mb-1">Draw</div>
              <div className="font-bold text-gray-400 bg-gray-800 px-3 py-1 rounded-md">{odds.odds_draw}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-textMuted mb-1">Odds B</div>
              <div className="font-bold text-blue-400 bg-blue-400/10 px-3 py-1 rounded-md">{odds.odds_b}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-24 text-textMuted text-sm animate-pulse">
          Generating math odds...
        </div>
      )}
    </div>
  );
};

export default MatchCard;
