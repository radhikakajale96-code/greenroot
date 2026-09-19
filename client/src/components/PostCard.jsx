import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { likePost } from '../api';
import toast from 'react-hot-toast';
import CommentSection from './CommentSection';

export default function PostCard({ post: initialPost, onPostUpdated }) {
  const { user } = useAuth();
  const [post, setPost] = useState(initialPost);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Support both Django (id) and legacy (_id) post identifiers
  const postId = post.id || post._id;
  const postUser = post.user || post.author || {};
  const authorName = postUser.name || 'GreenRoots User';
  const authorAvatar =
    postUser.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=2E7D32&color=fff`;

  // Resolve image URL: PostSerializer returns image as a string URL
  const imageUrl =
    typeof post.image === 'string'
      ? post.image
      : post.image?.url || (Array.isArray(post.images) && post.images[0]) || '';

  const captionText = post.caption || post.content || '';

  // Support both Django (likes: [userId, ...]) and like status
  const currentUserId = user?.id || user?._id;
  const likesArray = post.likes || [];
  const hasLiked =
    Boolean(user) &&
    (post.is_liked === true ||
      likesArray.some((id) =>
        typeof id === 'object' ? String(id._id) === String(currentUserId) : String(id) === String(currentUserId)
      ));
  const likesCount = post.likes_count ?? likesArray.length;
  const commentsCount = post.comments_count ?? (post.comments?.length || 0);

  // Like / Unlike Toggle with Optimistic UI Update
  const handleLikeToggle = async () => {
    if (!user) {
      toast.error('Please sign in to like posts!');
      return;
    }
    if (isLiking) return;
    setIsLiking(true);

    // Optimistic update
    const newIsLiked = !hasLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    const optimisticPost = { ...post, is_liked: newIsLiked, likes_count: newLikesCount };
    setPost(optimisticPost);
    if (onPostUpdated) onPostUpdated(optimisticPost);

    try {
      const res = await likePost(postId);
      if (res.data) {
        const serverPost = {
          ...post,
          is_liked: res.data.liked,
          likes_count: res.data.likes_count ?? newLikesCount,
        };
        setPost(serverPost);
        if (onPostUpdated) onPostUpdated(serverPost);
      }
    } catch (err) {
      // Rollback
      setPost(post);
      if (onPostUpdated) onPostUpdated(post);
      toast.error('Failed to update like status.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentUpdate = (updatedComments) => {
    const updatedPost = {
      ...post,
      comments: updatedComments,
      comments_count: updatedComments.length,
    };
    setPost(updatedPost);
    if (onPostUpdated) onPostUpdated(updatedPost);
  };

  const formattedDate = post.created_at || post.createdAt
    ? new Date(post.created_at || post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="card glass overflow-hidden border border-forest/20 shadow-xl hover:border-forest/40 transition-all"
    >
      {/* Post Author Header */}
      <div className="flex items-center gap-3 p-5 pb-3">
        <img
          src={authorAvatar}
          alt={authorName}
          className="w-10 h-10 rounded-full object-cover border border-forest/40 shrink-0"
        />
        <div>
          <h4 className="font-semibold text-sm text-gray-200">{authorName}</h4>
          <span className="text-xs text-gray-400">{formattedDate}</span>
        </div>
      </div>

      {/* Post Image */}
      {imageUrl && (
        <div className="bg-black/30">
          <img
            src={imageUrl}
            alt="Post"
            className="w-full object-cover max-h-[500px]"
            loading="lazy"
          />
        </div>
      )}

      {/* Caption */}
      {captionText && (
        <p className="px-5 pt-4 pb-1 text-gray-200 text-sm leading-relaxed whitespace-pre-line">
          {captionText}
        </p>
      )}

      {/* Action Bar */}
      <div className="px-5 py-3 flex items-center gap-5 border-t border-forest/10 mt-3 text-gray-400 text-sm">
        {/* Like Button */}
        <button
          type="button"
          id={`like-btn-${postId}`}
          onClick={handleLikeToggle}
          disabled={isLiking}
          className={`flex items-center gap-1.5 transition-colors ${
            hasLiked ? 'text-red-400 font-semibold' : 'hover:text-red-400'
          }`}
        >
          <FiHeart className={hasLiked ? 'fill-current text-red-500' : ''} />
          <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
        </button>

        {/* Comment Toggle */}
        <button
          type="button"
          id={`comments-toggle-btn-${postId}`}
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-1.5 hover:text-light-green transition-colors"
        >
          <FiMessageSquare />
          <span>{commentsCount} {commentsCount === 1 ? 'Comment' : 'Comments'}</span>
        </button>
      </div>

      {/* Embedded Comment Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <CommentSection
                postId={postId}
                comments={post.comments || []}
                onCommentUpdated={handleCommentUpdate}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
