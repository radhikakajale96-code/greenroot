import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiCheckCircle, FiAward, FiPlus, FiBookOpen, FiCalendar } from 'react-icons/fi';

export default function Dashboard() {
  const { user } = useAuth();

  const userStats = {
    treesPlanted: user?.treesPlanted || 12,
    co2Offset: ((user?.treesPlanted || 12) * 22).toFixed(0), // kg
    oxygenProduced: ((user?.treesPlanted || 12) * 118).toFixed(0), // kg
    challengesCompleted: 4,
    rank: '#14 Global Planter',
  };

  const myRecentTrees = [
    { id: 't1', species: 'Red Maple', plantedDate: '2024-03-15', height: '1.2 m', status: 'Healthy Sapling', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&auto=format&fit=crop&q=60' },
    { id: 't2', species: 'White Oak', plantedDate: '2024-01-10', height: '2.4 m', status: 'Established Tree', img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300&auto=format&fit=crop&q=60' },
    { id: 't3', species: 'Eastern Redbud', plantedDate: '2024-05-02', height: '0.8 m', status: 'Flowering', img: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=300&auto=format&fit=crop&q=60' },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="card glass p-8 mb-8 border border-forest/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=2E7D32&color=fff`}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-forest-light"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Welcome back, <span className="text-gradient">{user?.name || 'Green Champion'}</span>!
              </h1>
              <p className="text-gray-300 text-sm mt-1">Here is your real-time environmental impact overview.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link to="/diary" className="btn-primary flex items-center gap-2 text-sm !py-2.5 !px-5">
              <FiPlus /> Log New Tree
            </Link>
            <Link to="/feed" className="btn-outline flex items-center gap-2 text-sm !py-2.5 !px-5">
              Community Feed
            </Link>
          </div>
        </div>
      </div>

      {/* Impact Meters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Trees Planted', value: userStats.treesPlanted, unit: 'Trees', icon: '🌳', color: 'text-emerald-400' },
          { label: 'Estimated CO₂ Offset', value: `${userStats.co2Offset}`, unit: 'kg / year', icon: '☁️', color: 'text-teal-400' },
          { label: 'Oxygen Produced', value: `${userStats.oxygenProduced}`, unit: 'kg / year', icon: '🍃', color: 'text-light-green' },
          { label: 'Global Standing', value: userStats.rank, unit: 'Rank', icon: '🏆', color: 'text-amber-400' },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card p-6 glass border border-forest/20 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-400">{item.label}</span>
              <span className="text-2xl">{item.icon}</span>
            </div>
            <div>
              <div className={`text-3xl font-extrabold font-display ${item.color}`}>
                {item.value}
              </div>
              <span className="text-xs text-gray-500 font-medium">{item.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: My Trees */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card glass p-6 border border-forest/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                <FiBookOpen className="text-light-green" /> My Active Trees
              </h2>
              <Link to="/diary" className="text-xs text-light-green hover:underline">
                View All Diary Entries →
              </Link>
            </div>

            <div className="space-y-4">
              {myRecentTrees.map((tree) => (
                <div key={tree.id} className="flex items-center justify-between p-4 rounded-xl glass hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={tree.img} alt={tree.species} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-white text-base">{tree.species}</h4>
                      <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                        <FiCalendar /> Planted {tree.plantedDate} • Height: {tree.height}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full glass border border-forest/30 text-light-green font-medium">
                    {tree.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Achievements & Recommended Quests */}
        <div className="space-y-6">
          <div className="card glass p-6 border border-forest/20">
            <h2 className="text-xl font-bold font-display text-white mb-4 flex items-center gap-2">
              <FiAward className="text-amber-400" /> Badges Earned
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'First Seedling', icon: '🌱', desc: 'Planted 1st tree' },
                { title: 'Oak Master', icon: '🌳', desc: 'Planted 5 Oaks' },
                { title: 'Eco Supporter', icon: '💚', desc: 'Joined 3 challenges' },
                { title: 'Green Pioneer', icon: '✨', desc: 'Active for 30 days' },
              ].map((b, i) => (
                <div key={i} className="p-3 rounded-xl glass text-center border border-white/5">
                  <span className="text-2xl block mb-1">{b.icon}</span>
                  <h5 className="font-semibold text-xs text-white">{b.title}</h5>
                  <p className="text-[10px] text-gray-400 mt-0.5">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card glass p-6 border border-forest/20">
            <h2 className="text-xl font-bold font-display text-white mb-4">Recommended Challenge</h2>
            <div className="p-4 rounded-xl bg-forest-dark/40 border border-forest/30">
              <span className="text-xs px-2.5 py-1 rounded-full bg-forest text-white font-medium">Active Challenge</span>
              <h4 className="font-bold text-white text-base mt-2">Spring Reforestation Sprint 🌸</h4>
              <p className="text-xs text-gray-300 mt-1">Plant 3 native trees within 14 days to earn the Golden Sapling badge.</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-light-green">Reward: +250 Eco Points</span>
                <Link to="/feed" className="btn-primary text-xs !py-1.5 !px-4">
                  View Feed
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
