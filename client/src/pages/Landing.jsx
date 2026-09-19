import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const stats = [
  { label: 'Trees Planted', value: '45,820+', icon: '🌳', color: 'from-emerald-400 to-green-600' },
  { label: 'Active Planters', value: '12,400+', icon: '👥', color: 'from-teal-400 to-emerald-600' },
  { label: 'CO₂ Offset (Tons)', value: '1,140+', icon: '☁️', color: 'from-green-400 to-teal-600' },
  { label: 'Communities Joined', value: '85+', icon: '🌍', color: 'from-lime-400 to-emerald-600' },
];

const features = [
  {
    title: 'Digital Tree Diary',
    desc: 'Log every tree you plant, track growth milestones over time, attach photos, and watch your digital forest grow.',
    icon: '📖',
    badge: 'Popular',
  },
  {
    title: 'Community Eco Feed',
    desc: 'Share planting achievements, exchange gardening tips, like, comment, and connect with nature lovers globally.',
    icon: '💬',
    badge: 'Social',
  },
  {
    title: 'Eco Challenges & Quests',
    desc: 'Participate in monthly environmental challenges, earn digital badges, and climb the green leaderboard.',
    icon: '🏆',
    badge: 'Gamified',
  },
  {
    title: 'Verified Impact Analytics',
    desc: 'Monitor your personal and collective carbon reduction metrics with visual interactive charts.',
    icon: '📊',
    badge: 'Real-time',
  },
];

const recentPlantings = [
  { id: 1, name: 'Red Oak Sapling', planter: 'Sarah Jenkins', location: 'Portland, OR', time: '2 hours ago', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Cherry Blossom Tree', planter: 'Kenji Sato', location: 'Kyoto, Japan', time: '5 hours ago', img: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=500&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Silver Birch', planter: 'Elena Rostova', location: 'Berlin, Germany', time: '1 day ago', img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&auto=format&fit=crop&q=60' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0f0a] text-gray-100 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Glowing backdrop elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-forest/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-forest-light/10 rounded-full blur-2xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-forest/30 text-light-green text-sm font-medium mb-6"
        >
          <span className="animate-pulse text-base">🌱</span> Together for a Greener Tomorrow
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight max-w-4xl leading-tight"
        >
          Plant Trees, Track Growth & <span className="text-gradient">Restore Earth</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed"
        >
          GreenRoots is a global community empowering individuals to plant trees, record growth timelines, share impact stories, and fight climate change together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-3.5 w-full sm:w-auto">
            Start Planting Today <FiArrowRight size={18} />
          </Link>
          <Link to="/feed" className="btn-outline flex items-center justify-center gap-2 text-base px-8 py-3.5 w-full sm:w-auto">
            Explore Community Feed
          </Link>
        </motion.div>

        {/* Tree Interactive Graphic Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 w-full max-w-4xl card p-6 sm:p-10 glass border border-forest/30 relative overflow-hidden shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
            <div>
              <span className="text-xs uppercase tracking-widest text-light-green font-semibold">Live Growth Simulator</span>
              <h2 className="text-2xl font-bold mt-2 font-display text-white">Watch Your Impact Grow</h2>
              <p className="text-gray-300 text-sm mt-3 leading-relaxed">
                Every single tree logged in GreenRoots absorbs ~22kg of carbon dioxide per year, produces fresh oxygen, and fosters native biodiversity.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-200">
                <li className="flex items-center gap-2"><FiCheckCircle className="text-forest-light" /> High resolution photo growth timeline</li>
                <li className="flex items-center gap-2"><FiCheckCircle className="text-forest-light" /> Geo-tagging & GPS location mapping</li>
                <li className="flex items-center gap-2"><FiCheckCircle className="text-forest-light" /> Automatic CO₂ absorption calculations</li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-forest-dark/40 rounded-2xl border border-forest/20 relative">
              <motion.div
                animate={{ scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="text-8xl select-none"
              >
                🌳
              </motion.div>
              <div className="mt-4 text-center">
                <span className="text-xs text-light-green font-mono">Status: Thriving 🌱</span>
                <p className="text-sm font-semibold text-gray-200">Estimated Oxygen: 118 kg/year</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-forest-dark/10 border-y border-forest/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="card p-6 text-center glass hover:scale-105 transition-all"
            >
              <span className="text-3xl block mb-2">{item.icon}</span>
              <div className={`text-3xl font-extrabold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                {item.value}
              </div>
              <p className="text-sm text-gray-400 mt-1">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-light-green font-semibold text-sm uppercase tracking-widest">Why GreenRoots?</span>
          <h2 className="section-heading text-gradient mt-2">Empowering Planet Defenders</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-base">
            Everything you need to turn your passion for environmental action into tangible, verifiable impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 glass flex flex-col justify-between hover:border-forest-light/40"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{f.icon}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full glass border border-forest/30 text-light-green font-medium">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2 font-display">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Plantings */}
      <section className="py-20 bg-forest-dark/20 px-4 sm:px-6 lg:px-8 border-t border-forest/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-light-green font-semibold text-sm uppercase tracking-wider">Live Activity</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mt-1">Recent Community Plantings</h2>
            </div>
            <Link to="/gallery" className="mt-4 md:mt-0 text-light-green hover:underline flex items-center gap-1 text-sm font-medium">
              View full photo gallery <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentPlantings.map((p) => (
              <div key={p.id} className="card overflow-hidden glass group">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 glass text-xs text-white px-2.5 py-1 rounded-full font-medium">
                    📍 {p.location}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-white mb-1">{p.name}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                    <span>Planted by <strong className="text-light-green">{p.planter}</strong></span>
                    <span>{p.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="card p-12 glass border border-forest/40 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-4xl block mb-3">🌳</span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white">Ready to Plant Your First Tree?</h2>
            <p className="mt-4 text-gray-300 text-base sm:text-lg">
              Join thousands of environmental stewards making a real difference. It takes less than two minutes to get started.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link to="/register" className="btn-primary text-base px-8 py-3.5">
                Join GreenRoots Free 🌱
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
