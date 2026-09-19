import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getPost, likePost, addComment, bookmarkPost } from '../api';
import toast from 'react-hot-toast';
import { FiHeart, FiMessageSquare, FiBookmark, FiShare2, FiArrowLeft, FiSend } from 'react-icons/fi';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await getPost(id);
      if (res.data && res.data.post) {
        setPost(res.data.post);
      }
    } catch (err) {
      // Mock post fallback
      setPost({
        _id: id || 'p1',
        title: 'Community Oak Planting Drive Results 🌳',
        content: 'Last Saturday, 35 volunteers gathered at the North Reserve to plant 50 native sugar maples and oaks. Soil moisture was ideal, and all saplings received mulch and protective netting.',
        category: 'trees',
        tags: ['reforestation', 'volunteer', 'oak'],
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&auto=format&fit=crop&q=60',
        user: { _id: 'u1', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' },
        likes: ['u1', 'u2', 'u3'],
        bookmarks: [],
        comments: [
          { _id: 'c1', user: { name: 'Marcus Chen' }, text: 'Such an inspiring day! Can’t wait for the next sprint.' },
          { _id: 'c2', user: { name: 'Aaliyah Patel' }, text: 'Great job team! The photos look wonderful.' }
        ],
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }
    const currentUserId = user.id || user._id;
    const likesArr = Array.isArray(post.likes) ? post.likes : [];
    const hasLiked = post.is_liked === true || likesArr.some(
      (l) => (typeof l === 'object' ? String(l.id || l._id) === String(currentUserId) : String(l) === String(currentUserId))
    );
    const updatedLikes = hasLiked
      ? likesArr.filter((l) => (typeof l === 'object' ? String(l.id || l._id) !== String(currentUserId) : String(l) !== String(currentUserId)))
      : [...likesArr, currentUserId];

    const newLikesCount = hasLiked ? Math.max(0, (post.likes_count || likesArr.length) - 1) : (post.likes_count || likesArr.length) + 1;

    setPost({ ...post, is_liked: !hasLiked, likes: updatedLikes, likes_count: newLikesCount });
    try {
      const res = await likePost(id);
      if (res.data) {
        setPost((prev) => ({
          ...prev,
          is_liked: res.data.liked,
          likes_count: res.data.likes_count ?? newLikesCount,
        }));
      }
    } catch (err) {
      // quiet fallback
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const currentUserId = user?.id || user?._id;
    const newComment = {
      id: Date.now(),
      _id: Date.now().toString(),
      user: { id: currentUserId, _id: currentUserId, name: user?.name || 'Green Planter', avatar: user?.avatar },
      text: commentText.trim(),
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setPost({ ...post, comments: [...(post.comments || []), newComment] });
    const textToSend = commentText.trim();
    setCommentText('');
    toast.success('Comment added!');

    try {
      const res = await addComment(id, { text: textToSend });
      const serverComment = res.data?.comment || res.data;
      if (serverComment) {
        setPost((prev) => ({
          ...prev,
          comments: (prev.comments || []).map((c) => (c.id === newComment.id ? serverComment : c)),
        }));
      }
    } catch (err) {
      // quiet fallback
    }
  };

  if (!post) return null;

  const currentUserId = user?.id || user?._id;
  const likesArr = Array.isArray(post.likes) ? post.likes : [];
  const isLiked = Boolean(user) && (
    post.is_liked === true ||
    likesArr.some((l) => (typeof l === 'object' ? String(l.id || l._id) === String(currentUserId) : String(l) === String(currentUserId)))
  );
  const likesCount = post.likes_count ?? likesArr.length;
  const commentsList = post.comments || [];
  const authorName = post.user?.name || 'GreenRoots User';
  const authorAvatar = post.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=2E7D32&color=fff`;
  const postDate = post.created_at || post.createdAt ? new Date(post.created_at || post.createdAt).toLocaleDateString() : 'Recently';
  const postImage = typeof post.image === 'string' ? post.image : (post.image?.url || post.image_url || '');

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link to="/feed" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-light-green mb-6 transition-colors">
        <FiArrowLeft /> Back to Feed
      </Link>

      <div className="card glass p-8 border border-forest/30">
        {/* Author Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-12 h-12 rounded-full object-cover border-2 border-forest-light"
            />
            <div>
              <h3 className="font-bold text-white text-base">{authorName}</h3>
              <span className="text-xs text-gray-400">{postDate}</span>
            </div>
          </div>
          {post.category && (
            <span className="text-xs px-3 py-1 rounded-full glass border border-forest/30 text-light-green font-medium capitalize">
              {post.category}
            </span>
          )}
        </div>

        {/* Caption / Content */}
        {post.title && <h1 className="text-3xl font-bold font-display text-white mb-4">{post.title}</h1>}
        <p className="text-gray-300 text-base leading-relaxed mb-6">{post.caption || post.content}</p>

        {/* Image */}
        {postImage && (
          <div className="rounded-2xl overflow-hidden mb-6 max-h-[450px]">
            <img src={postImage} alt="Post" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between py-4 border-y border-white/10 text-gray-400 text-sm">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-400 font-semibold' : 'hover:text-red-400'}`}
            >
              <FiHeart className={isLiked ? 'fill-current' : ''} /> {likesCount} Likes
            </button>
            <span className="flex items-center gap-1.5"><FiMessageSquare /> {commentsList.length} Comments</span>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied to clipboard!');
            }}
            className="hover:text-white transition-colors"
          >
            <FiShare2 />
          </button>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <h3 className="font-bold text-lg text-white mb-4">Comments</h3>

          <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Write a thought or comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-forest-dark/40 border border-forest/30 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-forest-light"
            />
            <button type="submit" className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2">
              Send <FiSend />
            </button>
          </form>

          <div className="space-y-3">
            {commentsList.map((c) => {
              const cName = c.user?.name || (typeof c.user === 'string' ? c.user : 'GreenRoots User');
              return (
                <div key={c.id || c._id} className="glass p-4 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-light-green">{cName}</span>
                  <p className="text-gray-200 text-sm">{c.text || c.content}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
