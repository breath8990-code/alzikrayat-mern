import { useState } from 'react';
import { loginUser } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ErrorAlert from './ErrorAlert.jsx';

// Props: onSuccess() called after a successful login
export default function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const user = await loginUser(form);
      login(user);
      onSuccess();
    } catch (err) {
      setError(err);
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ErrorAlert message={error?.message} details={error?.details} />
      <div className="mb-3">
        <label htmlFor="loginEmail" className="form-label">Email</label>
        <input id="loginEmail" name="email" type="email" className="form-control"
          value={form.email} onChange={handleChange} autoComplete="email" required />
      </div>
      <div className="mb-3">
        <label htmlFor="loginPassword" className="form-label">Password</label>
        <input id="loginPassword" name="password" type="password" className="form-control"
          value={form.password} onChange={handleChange} autoComplete="current-password" required />
      </div>
      <button className="btn btn-dark w-100" disabled={sending}>
        {sending ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  );
}
