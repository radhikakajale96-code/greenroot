import { useState, useRef } from 'react';
import { FiX, FiUploadCloud, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { createPost } from '../api';

export default function CreatePost({ onPostCreated, onClose }) {
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const handleFileChange = (e) => {
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setErrorMsg('Invalid file format! Please select a JPEG, PNG, or WebP image.');
      toast.error('Invalid image format!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 5MB. Please choose a smaller image.');
      toast.error('File size exceeds 5MB limit');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedFile) {
      setErrorMsg('An image is required to create a post.');
      toast.error('Please select an image first.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      if (caption.trim()) {
        formData.append('caption', caption.trim());
      }

      const res = await createPost(formData);
      toast.success('Post created successfully! 🌱');

      const createdPost = res.data?.post || res.data;
      if (onPostCreated && createdPost) {
        onPostCreated(createdPost);
      }

      // Reset form
      setCaption('');
      handleRemoveImage();
      if (onClose) onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create post. Please try again.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card glass p-6 border border-forest/30 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-forest/20 pb-3">
        <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
          📸 Create New Post
        </h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            id="close-create-post-btn"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <FiAlertCircle className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Image Button & Preview */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Select Image <span className="text-red-400">*</span>
          </label>
          <input
            id="post-image-file"
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {!previewUrl ? (
            <button
              id="choose-image-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-forest/40 hover:border-forest-light rounded-xl p-6 text-center flex flex-col items-center justify-center gap-2 bg-forest-dark/20 hover:bg-forest-dark/40 transition-all cursor-pointer group"
            >
              <FiUploadCloud size={32} className="text-light-green group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-200">Select Image from Device</span>
              <span className="text-xs text-gray-400">Supports JPEG, JPG, PNG, WEBP (Max 5MB)</span>
            </button>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-forest/40 max-h-72 bg-black/40">
              <img
                src={previewUrl}
                alt="Image Preview"
                className="w-full h-full object-contain max-h-72 mx-auto"
              />
              <button
                id="remove-image-btn"
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-red-600 text-white transition-colors"
                title="Remove image"
              >
                <FiX size={16} />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/70 px-2.5 py-1 rounded-lg text-[11px] text-light-green font-medium">
                📷 {selectedFile?.name} ({(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB)
              </div>
            </div>
          )}
        </div>

        {/* Caption (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Caption <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <textarea
            id="post-caption-input"
            rows={3}
            placeholder="Write something about this image..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full bg-forest-dark/40 border border-forest/30 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-forest-light"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex justify-end gap-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          )}
          <button
            id="create-post-submit-btn"
            type="submit"
            disabled={loading}
            className="btn-primary text-xs px-6 py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <span>POST</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
