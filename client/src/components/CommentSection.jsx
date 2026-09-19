import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addComment, deleteComment } from '../api';
import toast from 'react-hot-toast';
import { FiTrash2, FiSend } from 'react-icons/fi';

export default function CommentSection({ postId, comments = [], onCommentUpdated }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const currentUserId = user?.id || user?._id;

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!user) {
      toast.error('Please sign in to add comments.');
      return;
    }

    setLoading(true);
    const commentContent = text.trim();
    setText('');

    // Optimistic UI — show comment immediately
    const tempId = `temp_${Date.now()}`;
    const tempComment = {
      id: tempId,
      _id: tempId,
      user: { id: currentUserId, _id: currentUserId, name: user.name, avatar: user.avatar },
      text: commentContent,
      content: commentContent,
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    const optimisticComments = [...comments, tempComment];
    if (onCommentUpdated) onCommentUpdated(optimisticComments);

    try {
      const res = await addComment(postId, { text: commentContent });
      const newComment = res.data?.comment || res.data;
      toast.success('Comment posted!');

      // Replace temp comment with real server response
      const finalComments = comments.concat([newComment]);
      if (onCommentUpdated) onCommentUpdated(finalComments);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment.');
      // Rollback
      if (onCommentUpdated) onCommentUpdated(comments);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) return;

    const originalComments = [...comments];
    // Optimistic remove
    const filtered = comments.filter(
      (c) => String(c.id || c._id) !== String(commentId)
    );
    if (onCommentUpdated) onCommentUpdated(filtered);

    try {
      await deleteComment(postId, commentId);
      toast.success('Comment deleted.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete comment.');
      // Rollback
      if (onCommentUpdated) onCommentUpdated(originalComments);
    }
  };

  return (
    <div className="mt-3 pt-4 border-t border-forest/20 space-y-4">
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Comments ({comments.length})
      </h4>

      {/* Comments List */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-xs text-gray-500 italic py-2">No comments yet. Be the first!</p>
        ) : (
          comments.map((c) => {
            const commentId = c.id || c._id;
            const commentUser = c.user || c.author || {};
            const commentUserId = commentUser.id || commentUser._id;
            const isOwner =
              user && String(commentUserId) === String(currentUserId);
            const displayAuthor = commentUser.name || 'GreenRoots User';
            const displayAvatar =
              commentUser.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(displayAuthor)}&background=2E7D32&color=fff`;

            return (
              <div
                key={commentId}
                className="glass p-3 rounded-xl text-xs flex gap-3 items-start justify-between group"
              >
                <div className="flex gap-2.5 items-start min-w-0">
                  <img
                    src={displayAvatar}
                    alt={displayAuthor}
                    className="w-7 h-7 rounded-full object-cover border border-forest/40 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-light-green">{displayAuthor}</span>
                      <span className="text-[10px] text-gray-400">
                        {c.created_at || c.createdAt
                          ? new Date(c.created_at || c.createdAt).toLocaleDateString()
                          : 'Just now'}
                      </span>
                    </div>
                    <p className="text-gray-200 mt-0.5 leading-relaxed break-words">
                      {c.text || c.content}
                    </p>
                  </div>
                </div>

                {isOwner && (
                  <button
                    type="button"
                    id={`delete-comment-${commentId}`}
                    onClick={() => handleDeleteComment(commentId)}
                    className="text-gray-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    title="Delete comment"
                  >
                    <FiTrash2 size={13} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* New Comment Input */}
      {user ? (
        <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
          <input
            id={`comment-input-${postId}`}
            type="text"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-forest-dark/40 border border-forest/30 rounded-xl px-3.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-forest-light"
          />
          <button
            id={`comment-submit-${postId}`}
            type="submit"
            disabled={loading || !text.trim()}
            className="btn-primary text-xs !py-2 !px-4 flex items-center gap-1 disabled:opacity-50"
          >
            <span>Post</span>
            <FiSend size={12} />
          </button>
        </form>
      ) : (
        <p className="text-xs text-gray-400 text-center py-2 glass rounded-xl">
          Please sign in to join the conversation.
        </p>
      )}
    </div>
  );
}
