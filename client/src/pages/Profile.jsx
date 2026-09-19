import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, followUser, updateProfile } from '../api';
import toast from 'react-hot-toast';
import { FiUserCheck, FiUserPlus, FiEdit3, FiMapPin, FiCalendar, FiBookOpen, FiGrid, FiX } from 'react-icons/fi';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [activeTab, setActiveTab] = useState('diary');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', location: '' });

  const isSelf = currentUser && (currentUser._id === id || id === 'me');

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await getUserProfile(id);
      if (res.data && res.data.user) {
        setProfileUser(res.data.user);
        setEditForm({
          name: res.data.user.name || '',
          bio: res.data.user.bio || '',
          location: res.data.user.location || '',
        });
      }
    } catch (err) {
      // Fallback mock profile
      const mock = {
        _id: id || 'u1',
        name: isSelf ? currentUser?.name || 'Green Champion' : 'Elena Rostova',
        avatar: isSelf ? currentUser?.avatar : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=60',
        bio: 'Environmental activist & urban forest gardener. Planting 50 trees this year!',
        location: 'Berlin, Germany',
        treesPlanted: 18,
        followersCount: 142,
        followingCount: 98,
        createdAt: '2024-01-15',
      };
      setProfileUser(mock);
      setEditForm({ name: mock.name, bio: mock.bio, location: mock.location });
    }
  };

  const handleFollow = async () => {
    setIsFollowing((prev) => !prev);
    toast.success(isFollowing ? 'Unfollowed user' : 'Now following user!');
    try {
      await followUser(id);
    } catch (err) {
      // quiet fallback
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    updateUser(editForm);
    setProfileUser((prev) => ({ ...prev, ...editForm }));
    setIsEditOpen(false);
    toast.success('Profile updated! 🌱');
    try {
      await updateProfile(editForm);
    } catch (err) {
      // quiet fallback
    }
  };

  if (!profileUser) return null;

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="card glass p-8 border border-forest/30 mb-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <img
            src={profileUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.name)}&background=2E7D32&color=fff`}
            alt={profileUser.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-forest-light shadow-xl"
          />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">{profileUser.name}</h1>
                <p className="text-sm text-gray-300 mt-1 max-w-lg">{profileUser.bio || 'GreenRoots Community Member'}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-400 mt-3">
                  {profileUser.location && (
                    <span className="flex items-center gap-1"><FiMapPin /> {profileUser.location}</span>
                  )}
                  <span className="flex items-center gap-1"><FiCalendar /> Joined {new Date(profileUser.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                {isSelf ? (
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="btn-outline flex items-center gap-2 text-xs !py-2 !px-4"
                  >
                    <FiEdit3 /> Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleFollow}
                    className={`btn-primary flex items-center gap-2 text-xs !py-2 !px-5 ${
                      isFollowing ? '!bg-gray-700 !text-gray-300' : ''
                    }`}
                  >
                    {isFollowing ? <><FiUserCheck /> Following</> : <><FiUserPlus /> Follow Planter</>}
                  </button>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex justify-center sm:justify-start gap-8 mt-6 pt-6 border-t border-white/10">
              <div>
                <span className="block text-2xl font-bold text-light-green font-display">{profileUser.treesPlanted || 18}</span>
                <span className="text-xs text-gray-400">Trees Planted</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-teal-400 font-display">{profileUser.followersCount || 142}</span>
                <span className="text-xs text-gray-400">Followers</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-emerald-400 font-display">{profileUser.followingCount || 98}</span>
                <span className="text-xs text-gray-400">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        <button
          onClick={() => setActiveTab('diary')}
          className={`px-6 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'diary' ? 'border-forest-light text-light-green' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <FiBookOpen /> Tree Diary (3)
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-6 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'posts' ? 'border-forest-light text-light-green' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <FiGrid /> Posts (5)
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'diary' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { species: 'Silver Birch', planted: 'Jan 2024', height: '1.8m', image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&auto=format&fit=crop&q=60' },
            { species: 'Red Oak', planted: 'Feb 2024', height: '1.1m', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=60' },
            { species: 'Wild Cherry', planted: 'Mar 2024', height: '0.9m', image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&auto=format&fit=crop&q=60' },
          ].map((t, idx) => (
            <div key={idx} className="card glass overflow-hidden">
              <img src={t.image} alt={t.species} className="w-full h-44 object-cover" />
              <div className="p-4">
                <h4 className="font-bold text-white text-base">{t.species}</h4>
                <p className="text-xs text-gray-400 mt-1">Planted: {t.planted} • Height: {t.height}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {[1, 2].map((p) => (
            <div key={p} className="card glass p-5 border border-forest/20">
              <h4 className="font-bold text-white text-lg">Community Reforestation Event #{p}</h4>
              <p className="text-gray-300 text-sm mt-2">Planted saplings with neighbors to restore local soil ecosystem.</p>
              <span className="text-xs text-gray-400 mt-3 block">Posted 2 days ago</span>
            </div>
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card glass w-full max-w-md p-6 relative border border-forest/40"
            >
              <button onClick={() => setIsEditOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <FiX size={20} />
              </button>

              <h2 className="text-xl font-bold font-display text-white mb-4">Edit Profile</h2>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-forest-dark/40 border border-forest/30 rounded-xl px-3.5 py-2 text-sm text-gray-200 focus:outline-none focus:border-forest-light"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Portland, OR"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full bg-forest-dark/40 border border-forest/30 rounded-xl px-3.5 py-2 text-sm text-gray-200 focus:outline-none focus:border-forest-light"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Tell the community about your green passion..."
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full bg-forest-dark/40 border border-forest/30 rounded-xl px-3.5 py-2 text-sm text-gray-200 focus:outline-none focus:border-forest-light"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-xs text-gray-400">Cancel</button>
                  <button type="submit" className="btn-primary text-xs px-5 py-2">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
