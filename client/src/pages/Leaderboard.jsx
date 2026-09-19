import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiTrendingUp } from 'react-icons/fi';

const leaderboardData = [
  { rank: 1, name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60', trees: 148, points: 3700, badge: '👑 Master Forester' },
  { rank: 2, name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60', trees: 124, points: 3100, badge: '🥈 Oak Sentinel' },
  { rank: 3, name: 'Aaliyah Patel', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60', trees: 96, points: 2400, badge: '🥉 Pine Guardian' },
  { rank: 4, name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=60', trees: 82, points: 2050, badge: '🌿 Eco Pioneer' },
  { rank: 5, name: 'Kenji Sato', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60', trees: 71, points: 1775, badge: '🌿 Forest Steward' },
  { rank: 6, name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=60', trees: 64, points: 1600, badge: '🌱 Sapling Logger' },
];

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState('all');

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-4xl font-bold font-display text-gradient">Green Leaderboard</h1>
        <p className="text-gray-300 text-sm mt-2">
          Celebrating top tree planters and environmental stewards making global impact.
        </p>

        {/* Timeframe Buttons */}
        <div className="flex justify-center gap-2 mt-6">
          {['all', 'monthly', 'weekly'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider capitalize transition-all ${
                timeframe === t
                  ? 'bg-forest text-white shadow-lg shadow-forest/30'
                  : 'glass text-gray-300 hover:text-light-green'
              }`}
            >
              {t === 'all' ? 'All Time' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12 items-end">
        {/* 2nd Place */}
        <div className="card glass p-4 text-center border-t-4 border-slate-300 transform translate-y-2">
          <span className="text-3xl block mb-1">🥈</span>
          <img src={leaderboardData[1].avatar} alt={leaderboardData[1].name} className="w-14 h-14 rounded-full mx-auto border-2 border-slate-300 object-cover" />
          <h4 className="font-bold text-white text-sm mt-2">{leaderboardData[1].name}</h4>
          <span className="text-xs text-light-green font-semibold">{leaderboardData[1].trees} Trees</span>
        </div>

        {/* 1st Place */}
        <div className="card glass p-6 text-center border-t-4 border-amber-400 transform -translate-y-4 shadow-xl shadow-amber-500/10">
          <span className="text-4xl block mb-1">👑</span>
          <img src={leaderboardData[0].avatar} alt={leaderboardData[0].name} className="w-18 h-18 rounded-full mx-auto border-4 border-amber-400 object-cover" />
          <h4 className="font-bold text-white text-base mt-2">{leaderboardData[0].name}</h4>
          <span className="text-sm text-amber-400 font-extrabold">{leaderboardData[0].trees} Trees</span>
        </div>

        {/* 3rd Place */}
        <div className="card glass p-4 text-center border-t-4 border-amber-700 transform translate-y-4">
          <span className="text-3xl block mb-1">🥉</span>
          <img src={leaderboardData[2].avatar} alt={leaderboardData[2].name} className="w-14 h-14 rounded-full mx-auto border-2 border-amber-700 object-cover" />
          <h4 className="font-bold text-white text-sm mt-2">{leaderboardData[2].name}</h4>
          <span className="text-xs text-light-green font-semibold">{leaderboardData[2].trees} Trees</span>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="card glass border border-forest/30 overflow-hidden">
        <div className="p-4 bg-forest-dark/40 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider grid grid-cols-12">
          <span className="col-span-2 text-center">Rank</span>
          <span className="col-span-5">Planter</span>
          <span className="col-span-3 text-center">Trees Planted</span>
          <span className="col-span-2 text-right">Points</span>
        </div>

        <div className="divide-y divide-white/5">
          {leaderboardData.map((user) => (
            <div key={user.rank} className="p-4 hover:bg-white/5 transition-colors grid grid-cols-12 items-center">
              <span className="col-span-2 text-center font-bold text-sm text-light-green">#{user.rank}</span>
              <div className="col-span-5 flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <h5 className="font-semibold text-sm text-white">{user.name}</h5>
                  <span className="text-[10px] text-gray-400">{user.badge}</span>
                </div>
              </div>
              <span className="col-span-3 text-center font-bold text-white text-sm">{user.trees} 🌳</span>
              <span className="col-span-2 text-right font-semibold text-amber-400 text-sm">+{user.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
