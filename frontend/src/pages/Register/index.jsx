import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authAPI } from '../../services/api';
import Input from '../../components/common/Input';
import GlowButton from '../../components/common/GlowButton';
import Avatar from '../../components/common/Avatar';
import { RiUser3Line, RiMailLine, RiLockPasswordLine, RiImageAddLine } from 'react-icons/ri';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      if (image) data.append('avatar', image);

      const response = await authAPI.register(data);
      login(response.data.user, response.data.token);
      toast.success(`Welcome to Alajangi Connect, ${response.data.user.name}`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 neural-bg opacity-20"></div>
      <div className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-electric/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      {/* Register Card */}
      <div className="w-full max-w-lg relative z-10">
        <div className="glass-panel glow-border-intense rounded-[32px] p-8 sm:p-10">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight glow-text mb-2">Create Account</h1>
            <p className="text-gray-400">Join the Alajangi Connect community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-electric to-cyan-500 rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-electric transition-colors">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-500">
                      <RiUser3Line size={40} />
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <RiImageAddLine size={24} className="text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-3 font-mono">Profile Picture</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                placeholder="Enter your name"
                icon={RiUser3Line}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="name@email.com"
                icon={RiMailLine}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={RiLockPasswordLine}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                icon={RiLockPasswordLine}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <div className="pt-4">
              <GlowButton 
                type="submit" 
                fullWidth 
                size="lg" 
                loading={loading}
              >
                Create Account
              </GlowButton>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-electric font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
