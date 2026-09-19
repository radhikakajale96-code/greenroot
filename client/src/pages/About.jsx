import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiGlobe, FiHeart, FiShield, FiUsers } from 'react-icons/fi';

export default function About() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-light-green text-sm font-semibold uppercase tracking-widest">Our Mission</span>
        <h1 className="text-4xl sm:text-5xl font-bold font-display text-gradient mt-2">
          Making Earth Breathe Again
        </h1>
        <p className="text-gray-300 text-base mt-4 leading-relaxed">
          GreenRoots is an open community-driven platform built to connect environmentalists, gardeners, and nature lovers worldwide. Our mission is to democratize tree planting tracking and foster local reforestation initiatives.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { icon: <FiGlobe size={32} />, title: 'Global Reforestation', desc: 'Connecting tree planters across 85+ countries to share growth milestones.' },
          { icon: <FiShield size={32} />, title: 'Verified Impact', desc: 'Documenting real-world growth timelines with geotagged photo logs.' },
          { icon: <FiUsers size={32} />, title: 'Community Action', desc: 'Building grass-root eco challenges to inspire daily sustainable actions.' },
        ].map((item, i) => (
          <div key={i} className="card glass p-6 border border-forest/30 text-center">
            <div className="text-light-green flex justify-center mb-4">{item.icon}</div>
            <h3 className="font-bold text-xl text-white mb-2 font-display">{item.title}</h3>
            <p className="text-gray-300 text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Impact Stats Banner */}
      <div className="card glass p-8 border border-forest/40 text-center relative overflow-hidden mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="text-3xl font-extrabold text-light-green font-display">45,000+</span>
            <span className="block text-xs text-gray-400 mt-1">Trees Logged</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-teal-400 font-display">1,100 Tons</span>
            <span className="block text-xs text-gray-400 mt-1">CO₂ Sequestered</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-emerald-400 font-display">12,400+</span>
            <span className="block text-xs text-gray-400 mt-1">Community Members</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-amber-400 font-display">100%</span>
            <span className="block text-xs text-gray-400 mt-1">Community Powered</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold font-display text-white mb-4">Want to get involved?</h2>
        <Link to="/register" className="btn-primary inline-block text-sm px-8 py-3">
          Join the Movement Today 🌱
        </Link>
      </div>
    </div>
  );
}
