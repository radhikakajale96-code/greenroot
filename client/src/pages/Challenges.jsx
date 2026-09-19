import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getChallenges, joinChallenge } from '../api';
import toast from 'react-hot-toast';
import { FiAward, FiUsers, FiClock, FiCheckCircle } from 'react-icons/fi';

const initialMockChallenges = [
  {
    _id: 'c1',
    title: 'Spring Reforestation Sprint 🌸',
    description: 'Plant 3 native saplings in your local area and upload growth updates within 14 days.',
    rewardPoints: 250,
    badgeName: 'Golden Sapling',
    badgeIcon: '🌱',
    participantsCount: 420,
    daysLeft: 8,
    joined: false,
    category: 'Planting',
  },
  {
    _id: 'c2',
    title: '7-Day Zero Plastic Pledge ♻️',
    description: 'Avoid single-use plastic bottles & bags for one full week. Share your eco tips with the community.',
    rewardPoints: 150,
    badgeName: 'Plastic Purifier',
    badgeIcon: '🌊',
    participantsCount: 890,
    daysLeft: 3,
    joined: true,
    category: 'Lifestyle',
  },
  {
    _id: 'c3',
    title: 'Urban Tree Guardian 🏙️',
    description: 'Adopt and care for an urban street tree. Water it weekly and remove litter around its base.',
    rewardPoints: 300,
    badgeName: 'Urban Sentinel',
    badgeIcon: '🌳',
    participantsCount: 310,
    daysLeft: 18,
    joined: false,
    category: 'Care',
  },
];

export default function Challenges() {
  const [challenges, setChallenges] = useState(initialMockChallenges);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await getChallenges();
      if (res.data && res.data.challenges && res.data.challenges.length > 0) {
        setChallenges(res.data.challenges);
      }
    } catch (err) {
      // quiet fallback
    }
  };

  const handleJoin = async (id) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c._id === id) {
          return { ...c, joined: true, participantsCount: c.participantsCount + 1 };
        }
        return c;
      })
    );
    toast.success('Joined challenge! Let’s make an impact 🚀');
    try {
      await joinChallenge(id);
    } catch (err) {
      // quiet fallback
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold font-display text-gradient">Eco Challenges</h1>
        <p className="text-gray-300 text-sm mt-2">
          Participate in community quests, earn digital badges, and boost your environmental score.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {challenges.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card glass p-6 border border-forest/30 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs px-2.5 py-1 rounded-full glass text-light-green font-semibold uppercase">
                  {item.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <FiClock /> {item.daysLeft} days left
                </span>
              </div>

              <div className="text-4xl mb-3">{item.badgeIcon}</div>
              <h3 className="text-xl font-bold font-display text-white mb-2">{item.title}</h3>
              <p className="text-gray-300 text-xs leading-relaxed mb-4">{item.description}</p>

              <div className="glass p-3 rounded-xl space-y-1 text-xs mb-4">
                <div className="flex justify-between text-gray-300">
                  <span>Reward:</span>
                  <span className="text-amber-400 font-bold">+{item.rewardPoints} Eco Points</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Badge Unlocked:</span>
                  <span className="text-light-green font-semibold">{item.badgeName}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <span className="flex items-center gap-1"><FiUsers /> {item.participantsCount} Joined</span>
                <span className="text-light-green">Active</span>
              </div>

              {item.joined ? (
                <button disabled className="w-full py-2.5 rounded-xl glass text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2 border border-emerald-500/30">
                  <FiCheckCircle /> Joined & Active
                </button>
              ) : (
                <button
                  onClick={() => handleJoin(item._id)}
                  className="w-full btn-primary py-2.5 text-xs font-semibold"
                >
                  Join Challenge 🌱
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
