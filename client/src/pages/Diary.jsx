import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getDiary, createDiaryEntry, addGrowthLog } from '../api';
import toast from 'react-hot-toast';
import { FiPlus, FiCalendar, FiMapPin, FiTrendingUp, FiX } from 'react-icons/fi';

const initialMockDiary = [
  {
    _id: 'd1',
    treeSpecies: 'Sugar Maple',
    nickname: 'Misty Sapling',
    plantedDate: '2024-02-14',
    location: 'Backyard Garden, Row A',
    notes: 'Planted during early spring thaw. Rich compost added.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=60',
    growthLogs: [
      { _id: 'g1', date: '2024-02-14', height: '0.6', note: 'Planted initial sapling.', image: '' },
      { _id: 'g2', date: '2024-04-20', height: '0.9', note: 'First green buds appeared!', image: '' },
      { _id: 'g3', date: '2024-06-10', height: '1.3', note: 'Thriving with strong new leaves.', image: '' }
    ]
  },
  {
    _id: 'd2',
    treeSpecies: 'White Pine',
    nickname: 'Whispering Pine',
    plantedDate: '2023-10-05',
    location: 'Community Park Slope',
    notes: 'Planted with neighborhood green team.',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=60',
    growthLogs: [
      { _id: 'g10', date: '2023-10-05', height: '1.2', note: 'Planted conifer sapling.', image: '' },
      { _id: 'g11', date: '2024-05-15', height: '2.1', note: 'Survived winter smoothly.', image: '' }
    ]
  }
];

export default function Diary() {
  const { user } = useAuth();
  const [diaryEntries, setDiaryEntries] = useState(initialMockDiary);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // New Tree Form
  const [newTree, setNewTree] = useState({
    treeSpecies: '',
    nickname: '',
    plantedDate: new Date().toISOString().split('T')[0],
    location: '',
    notes: '',
    image: '',
  });

  // Growth Update Form
  const [growthForm, setGrowthForm] = useState({
    height: '',
    note: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchDiary();
  }, [user]);

  const fetchDiary = async () => {
    if (!user) return;
    try {
      const res = await getDiary(user._id);
      if (res.data && res.data.entries && res.data.entries.length > 0) {
        setDiaryEntries(res.data.entries);
      }
    } catch (err) {
      // quiet fallback
    }
  };

  const handleCreateTree = async (e) => {
    e.preventDefault();
    if (!newTree.treeSpecies) return;

    const entryObj = {
      _id: `d_${Date.now()}`,
      treeSpecies: newTree.treeSpecies,
      nickname: newTree.nickname || newTree.treeSpecies,
      plantedDate: newTree.plantedDate,
      location: newTree.location || 'Home Forest',
      notes: newTree.notes,
      image: newTree.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=60',
      growthLogs: [
        { _id: `g_${Date.now()}`, date: newTree.plantedDate, height: '0.5', note: 'Planted entry', image: '' }
      ]
    };

    setDiaryEntries([entryObj, ...diaryEntries]);
    setIsNewModalOpen(false);
    setNewTree({ treeSpecies: '', nickname: '', plantedDate: new Date().toISOString().split('T')[0], location: '', notes: '', image: '' });
    toast.success('New tree logged in your diary! 🌿');

    try {
      await createDiaryEntry(entryObj);
    } catch (err) {
      // fallback handled
    }
  };

  const handleAddGrowthLog = async (e) => {
    e.preventDefault();
    if (!selectedEntry || !growthForm.height) return;

    const logObj = {
      _id: `g_${Date.now()}`,
      date: growthForm.date,
      height: growthForm.height,
      note: growthForm.note,
    };

    const updated = diaryEntries.map((e) => {
      if (e._id === selectedEntry._id) {
        return { ...e, growthLogs: [...e.growthLogs, logObj] };
      }
      return e;
    });

    setDiaryEntries(updated);
    setSelectedEntry({ ...selectedEntry, growthLogs: [...selectedEntry.growthLogs, logObj] });
    setIsLogModalOpen(false);
    setGrowthForm({ height: '', note: '', date: new Date().toISOString().split('T')[0] });
    toast.success('Growth milestone added! 📈');

    try {
      await addGrowthLog(selectedEntry._id, logObj);
    } catch (err) {
      // quiet fallback
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-gradient">Tree Growth Diary</h1>
          <p className="text-gray-400 text-sm mt-1">Track growth timelines and milestones for every tree you plant.</p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="btn-primary flex items-center gap-2 text-sm self-start sm:self-auto"
        >
          <FiPlus size={18} /> Plant & Log New Tree
        </button>
      </div>

      {/* Diary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {diaryEntries.map((entry) => (
          <motion.div
            key={entry._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card glass overflow-hidden border border-forest/30 flex flex-col justify-between"
          >
            <div>
              <div className="h-48 overflow-hidden relative">
                <img src={entry.image} alt={entry.treeSpecies} className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 glass px-3 py-1 rounded-full text-xs text-light-green font-semibold">
                  🌱 {entry.growthLogs?.length || 1} Growth Logs
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white font-display">{entry.treeSpecies}</h3>
                  <span className="text-xs text-gray-400 italic">"{entry.nickname}"</span>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-gray-400 mt-2">
                  <span className="flex items-center gap-1"><FiCalendar /> Planted {entry.plantedDate}</span>
                  <span className="flex items-center gap-1"><FiMapPin /> {entry.location}</span>
                </div>

                {entry.notes && (
                  <p className="text-gray-300 text-xs mt-3 bg-forest-dark/30 p-3 rounded-xl border border-forest/10">
                    {entry.notes}
                  </p>
                )}

                {/* Latest Growth Milestone */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <span className="text-xs font-semibold text-light-green uppercase tracking-wider block mb-2">Growth Timeline</span>
                  <div className="space-y-2">
                    {entry.growthLogs?.map((log) => (
                      <div key={log._id} className="flex items-center justify-between text-xs glass p-2.5 rounded-lg">
                        <span className="text-gray-400">{log.date}</span>
                        <span className="font-semibold text-white">Height: {log.height}m</span>
                        <span className="text-gray-300 truncate max-w-[150px]">{log.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-forest-dark/20 border-t border-white/5 flex justify-end">
              <button
                onClick={() => {
                  setSelectedEntry(entry);
                  setIsLogModalOpen(true);
                }}
                className="btn-outline text-xs !py-1.5 !px-4 flex items-center gap-1.5"
              >
                <FiTrendingUp /> Add Growth Update
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New Tree Modal */}
      <AnimatePresence>
        {isNewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card glass w-full max-w-lg p-6 relative border border-forest/40"
            >
              <button onClick={() => setIsNewModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <FiX size={20} />
              </button>

              <h2 className="text-xl font-bold font-display text-white mb-4">Log New Tree 🌱</h2>

              <form onSubmit={handleCreateTree} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Tree Species *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Red Oak"
                      value={newTree.treeSpecies}
                      onChange={(e) => setNewTree({ ...newTree, treeSpecies: e.target.value })}
                      className="w-full bg-forest-dark/40 border border-forest/30 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-forest-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Nickname</label>
                    <input
                      type="text"
                      placeholder="e.g., Mighty Oak"
                      value={newTree.nickname}
                      onChange={(e) => setNewTree({ ...newTree, nickname: e.target.value })}
                      className="w-full bg-forest-dark/40 border border-forest/30 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-forest-light"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Planted Date</label>
                    <input
                      type="date"
                      value={newTree.plantedDate}
                      onChange={(e) => setNewTree({ ...newTree, plantedDate: e.target.value })}
                      className="w-full bg-forest-dark/40 border border-forest/30 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-forest-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Backyard"
                      value={newTree.location}
                      onChange={(e) => setNewTree({ ...newTree, location: e.target.value })}
                      className="w-full bg-forest-dark/40 border border-forest/30 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-forest-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Photo URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newTree.image}
                    onChange={(e) => setNewTree({ ...newTree, image: e.target.value })}
                    className="w-full bg-forest-dark/40 border border-forest/30 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-forest-light"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Initial Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Soil conditions, sapling origin, watering schedule..."
                    value={newTree.notes}
                    onChange={(e) => setNewTree({ ...newTree, notes: e.target.value })}
                    className="w-full bg-forest-dark/40 border border-forest/30 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-forest-light"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsNewModalOpen(false)} className="px-4 py-2 text-xs text-gray-400">Cancel</button>
                  <button type="submit" className="btn-primary text-xs px-5 py-2">Save Entry 🌳</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Growth Log Modal */}
      <AnimatePresence>
        {isLogModalOpen && selectedEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card glass w-full max-w-md p-6 relative border border-forest/40"
            >
              <button onClick={() => setIsLogModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <FiX size={20} />
              </button>

              <h2 className="text-xl font-bold font-display text-white mb-1">Add Growth Milestone</h2>
              <p className="text-xs text-light-green mb-4">Tree: {selectedEntry.treeSpecies} ({selectedEntry.nickname})</p>

              <form onSubmit={handleAddGrowthLog} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Height (meters) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 1.5"
                      value={growthForm.height}
                      onChange={(e) => setGrowthForm({ ...growthForm, height: e.target.value })}
                      className="w-full bg-forest-dark/40 border border-forest/30 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-forest-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={growthForm.date}
                      onChange={(e) => setGrowthForm({ ...growthForm, date: e.target.value })}
                      className="w-full bg-forest-dark/40 border border-forest/30 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-forest-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Observations / Notes</label>
                  <textarea
                    rows={3}
                    placeholder="New leaves, trunk thickness, health status..."
                    value={growthForm.note}
                    onChange={(e) => setGrowthForm({ ...growthForm, note: e.target.value })}
                    className="w-full bg-forest-dark/40 border border-forest/30 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-forest-light"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsLogModalOpen(false)} className="px-4 py-2 text-xs text-gray-400">Cancel</button>
                  <button type="submit" className="btn-primary text-xs px-5 py-2">Add Log 📈</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
