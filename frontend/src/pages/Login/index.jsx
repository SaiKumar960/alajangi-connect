import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { useAuth } from '../../hooks/useAuth';
import { authAPI } from '../../services/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import styles from './Login.module.css';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoArea}>
          <div className={styles.logoMark}>AC</div>
          <h1 className={styles.title}>Alajangi Connect</h1>
          <p className={styles.subtitle}>Welcome back! Sign in to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input
            id="login-email"
            label="Email address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            icon={RiMailLine}
            error={errors.email}
            autoComplete="email"
          />

          <div className={styles.passwordField}>
            <Input
              id="login-password"
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              icon={RiLockLine}
              error={errors.password}
              autoComplete="current-password"
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
            </button>
          </div>

          <Button type="submit" fullWidth loading={loading} size="lg">
            Sign In
          </Button>
        </form>

        <p className={styles.switchText}>
          Don&apos;t have an account?{' '}
          <Link to="/register" className={styles.switchLink}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
