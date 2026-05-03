import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { postsAPI } from '../../services/api';
import Avatar from '../common/Avatar';
import Loader from '../common/Loader';
import { RiImageLine, RiCloseLine, RiSendPlaneFill, RiSparklingLine } from 'react-icons/ri';
import toast from 'react-hot-toast';

const FloatingComposer = ({ onPostCreated, isOpen, onClose }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current.focus(), 100);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB');
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('text', text.trim());
      if (image) formData.append('image', image);

      const { data } = await postsAPI.createPost(formData);
      onPostCreated(data.post);
      
      // Reset & close
      setText('');
      clearImage();
      toast.success('Thought transmitted to the network');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transmission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const charCount = text.length;
  const charLimit = 2000;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-void/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg glass-panel glow-border rounded-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2 text-electric font-medium">
                  <RiSparklingLine size={20} />
                  <span>Compose Thought</span>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <RiCloseLine size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 overflow-y-auto no-scrollbar">
                <div className="flex gap-4">
                  <Avatar src={user?.avatar} name={user?.name} size="md" className="flex-shrink-0" />
                  <div className="flex-1">
                    <textarea
                      ref={textareaRef}
                      className="w-full bg-transparent border-none text-white text-lg resize-none focus:ring-0 p-0 placeholder-gray-500 min-h-[120px]"
                      placeholder="What's transmitting in your network?"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      maxLength={charLimit}
                      disabled={submitting}
                    />

                    {/* Image Preview */}
                    {preview && (
                      <div className="relative mt-3 rounded-xl overflow-hidden border border-white/10 group">
                        <img src={preview} alt="Preview" className="w-full max-h-64 object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={clearImage}
                            className="p-2 bg-danger/80 text-white rounded-full hover:bg-danger transition-colors transform hover:scale-110"
                          >
                            <RiCloseLine size={24} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-white/10 bg-black/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors px-3 py-1.5 rounded-full hover:bg-cyan-400/10"
                  >
                    <RiImageLine size={20} />
                    <span className="text-sm font-medium">Attach Data</span>
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {charCount > 0 && (
                    <span className={`text-xs font-mono ${charCount > charLimit * 0.9 ? 'text-warning' : 'text-gray-500'}`}>
                      {charCount} / {charLimit}
                    </span>
                  )}
                  
                  <button
                    onClick={handleSubmit}
                    disabled={!text.trim() || submitting}
                    className="relative group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-electric rounded-full blur-md opacity-50 group-hover:opacity-100 group-disabled:hidden transition-opacity"></div>
                    <div className="relative flex items-center gap-2 bg-gradient-to-r from-electric to-cyan-500 text-white px-5 py-2 rounded-full font-medium">
                      {submitting ? (
                        <Loader inline />
                      ) : (
                        <>
                          <RiSendPlaneFill />
                          <span>Transmit</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FloatingComposer;
