import React, { useState, useRef } from 'react';
import { RiCloseLine, RiCameraLine, RiUserLine, RiFileListLine, RiImageLine } from 'react-icons/ri';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';
import { userAPI } from '../../services/api';

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [loading, setLoading] = useState(false);
  
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [bannerPreview, setBannerPreview] = useState(user.banner);
  
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (avatarFile) formData.append('avatar', avatarFile);
    if (bannerFile) formData.append('banner', bannerFile);

    try {
      const { data } = await userAPI.updateProfile(formData);
      onUpdate(data.user);
      toast.success('Profile updated successfully');
      onClose();
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-void/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-xl bg-surface border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <RiEditLine className="text-electric" />
            Edit Profile
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
            <RiCloseLine size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8 overflow-y-auto max-h-[70vh]">
          {/* Banner Upload */}
          <div className="relative group">
            <div className="h-32 rounded-2xl overflow-hidden bg-void border border-white/5 relative">
              {bannerPreview ? (
                <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-electric/10 to-cyan-500/10 flex items-center justify-center text-gray-600">
                  <RiImageLine size={40} />
                </div>
              )}
              <div 
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                onClick={() => bannerInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <RiCameraLine size={32} />
                  <span className="text-xs font-bold uppercase tracking-widest">Update Banner</span>
                </div>
              </div>
            </div>
            <input ref={bannerInputRef} type="file" className="hidden" accept="image/*" onChange={handleBannerSelect} />
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center -mt-20 relative z-10">
            <div className="relative group w-32 h-32">
              <Avatar src={avatarPreview} name={name} size="xxl" className="border-4 border-surface shadow-2xl" />
              <div 
                className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                onClick={() => avatarInputRef.current?.click()}
              >
                <RiCameraLine size={28} />
              </div>
              <input ref={avatarInputRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarSelect} />
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                <RiUserLine size={14} className="text-electric" />
                Full Name
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-void/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-electric/50 transition-colors"
                placeholder="How shall we call you?"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                <RiFileListLine size={14} className="text-cyan-400" />
                Bio
              </label>
              <textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-void/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                placeholder="Tell the network your story..."
              />
              <div className="flex justify-end px-1">
                <span className={`text-[10px] font-mono ${bio.length > 160 ? 'text-danger' : 'text-gray-600'}`}>
                  {bio.length}/160
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || bio.length > 160}
              className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-electric to-cyan-500 text-white font-bold shadow-lg shadow-electric/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Syncing...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RiEditLine = ({ className }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className={className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" d="M0 0h24v24H0z"></path><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
  </svg>
);

export default EditProfileModal;
