import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authAPI } from '../../services/api';
import Input from '../../components/common/Input';
import GlowButton from '../../components/common/GlowButton';
import { RiMailLine, RiLockPasswordLine, RiUser3Line } from 'react-icons/ri';
import toast from 'react-hot-toast';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return toast.error('Email/Phone and password required');

    setLoading(true);
    try {
      const { data } = await authAPI.login({ identifier, password });
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Login failed: Access denied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 neural-bg opacity-20"></div>
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-electric/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel glow-border-intense rounded-[32px] p-8 sm:p-10">
          
          <div className="text-center mb-10">
            <div className="inline-block p-4 bg-white/5 rounded-2xl mb-6 relative group">
              <div className="absolute inset-0 bg-electric/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img src="/logo.png" alt="Alajangi Logo" className="w-16 h-16 relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight glow-text mb-2">Sign In</h1>
            <p className="text-gray-400">Welcome back to Alajangi Connect</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email or Phone Number"
              type="text"
              placeholder="name@email.com or +1234567890"
              icon={RiMailLine}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={RiLockPasswordLine}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="pt-2">
              <GlowButton 
                type="submit" 
                fullWidth 
                size="lg" 
                loading={loading}
              >
                Sign In
              </GlowButton>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm">
              New to Alajangi?{' '}
              <Link to="/register" className="text-electric hover:text-cyan-400 font-semibold transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-8 text-center flex items-center justify-center gap-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
          <span>Ver 4.6.0</span>
          <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
          <span>Secure Layer Active</span>
          <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
