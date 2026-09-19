import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getPosts } from '../api';
import toast from 'react-hot-toast';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getPosts();
      const data = res.data;
      const fetched = data?.posts || data?.results || (Array.isArray(data) ? data : []);
      setPosts(fetched);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Could not load posts. Is the Django server running?');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handlePostUpdated = (updatedPost) => {
    const updatedId = updatedPost.id || updatedPost._id;
    setPosts((prev) =>
      prev.map((p) => {
        const pId = p.id || p._id;
        return String(pId) === String(updatedId) ? updatedPost : p;
      })
    );
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-gradient">GreenRoots Feed</h1>
          <p className="text-gray-400 text-sm mt-1">
            Share moments, explore nature, and connect with the community.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchPosts}
            disabled={loading}
            className="p-2.5 rounded-xl glass border border-forest/30 text-gray-300 hover:text-light-green transition-colors"
            title="Refresh feed"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            id="open-create-post-modal-btn"
            type="button"
            onClick={() => {
              if (!user) {
                toast.error('Please sign in to create a post.');
                return;
              }
              setIsCreateModalOpen(true);
            }}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <FiPlus size={18} /> Create Post
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="text-center py-20 card glass border border-forest/20">
          <div className="w-10 h-10 border-4 border-forest-light border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading posts...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 card glass border border-red-500/20">
          <span className="text-4xl block mb-3">⚠️</span>
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button
            onClick={fetchPosts}
            className="btn-primary text-xs px-4 py-2"
          >
            Try Again
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 card glass border border-forest/20">
          <span className="text-5xl block mb-4">🌱</span>
          <h3 className="text-lg font-semibold text-gray-200 mb-2">No posts yet</h3>
          <p className="text-gray-400 text-sm mb-5">
            Be the first to share a photo with the community!
          </p>
          {user && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary text-sm px-5 py-2.5"
            >
              Create the first post
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id || post._id}
              post={post}
              onPostUpdated={handlePostUpdated}
            />
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg"
            >
              <CreatePost
                onPostCreated={handlePostCreated}
                onClose={() => setIsCreateModalOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
