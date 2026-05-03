import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiMailLine, RiLockLine, RiUser3Line, RiEyeLine, RiEyeOffLine, RiImageLine } from 'react-icons/ri';
import Avatar from '../../components/common/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { authAPI } from '../../services/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import styles from './Register.module.css';
import toast from 'react-hot-toast';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length > 50) e.name = 'Name cannot exceed 50 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return; }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('email', form.email);
      fd.append('password', form.password);
      if (avatarFile) fd.append('avatar', avatarFile);

      const { data } = await authAPI.register(fd);
      login(data.user, data.token);
      toast.success(`Account created! Welcome, ${data.user.name}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.card}>
        <div className={styles.logoArea}>
          <div className={styles.logoMark}>AC</div>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join Alajangi Connect today</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.avatarUploadContainer} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <label htmlFor="reg-avatar" style={{ cursor: 'pointer', position: 'relative' }}>
              <Avatar src={avatarPreview} name={form.name || '?'} size="lg" />
              <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--clr-primary)', borderRadius: '50%', padding: '4px', display: 'flex' }}>
                <RiImageLine size={12} color="white" />
              </div>
            </label>
            <input
              id="reg-avatar"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Profile Picture (Optional)</span>
          </div>
          <Input
            id="reg-name"
            label="Full name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            icon={RiUser3Line}
            error={errors.name}
            autoComplete="name"
          />
          <Input
            id="reg-email"
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
              id="reg-password"
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              icon={RiLockLine}
              error={errors.password}
              autoComplete="new-password"
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

          <Input
            id="reg-confirm"
            label="Confirm password"
            name="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={handleChange}
            icon={RiLockLine}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <Button type="submit" fullWidth loading={loading} size="lg">
            Create Account
          </Button>
        </form>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
