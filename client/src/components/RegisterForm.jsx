import { useState } from 'react';
import { registerUser } from '../api.js';
import ErrorAlert from './ErrorAlert.jsx';

const emptyForm = {
  firstName: '', lastName: '', email: '', password: '', location: '', occupation: '', description: '',
};

// Props: onSuccess() called after the account has been created
export default function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await registerUser(form);
      onSuccess();
    } catch (err) {
      setError(err);
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ErrorAlert message={error?.message} details={error?.details} />
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label htmlFor="firstName" className="form-label">First name</label>
          <input id="firstName" name="firstName" className="form-control"
            value={form.firstName} onChange={handleChange} maxLength="50" required />
        </div>
        <div className="col-sm-6">
          <label htmlFor="lastName" className="form-label">Last name</label>
          <input id="lastName" name="lastName" className="form-control"
            value={form.lastName} onChange={handleChange} maxLength="50" required />
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="regEmail" className="form-label">Email</label>
        <input id="regEmail" name="email" type="email" className="form-control"
          value={form.email} onChange={handleChange} autoComplete="email" required />
      </div>
      <div className="mb-3">
        <label htmlFor="regPassword" className="form-label">Password</label>
        <input id="regPassword" name="password" type="password" className="form-control"
          value={form.password} onChange={handleChange} minLength="6" autoComplete="new-password" required />
        <div className="form-text">At least 6 characters.</div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label htmlFor="location" className="form-label">Location (optional)</label>
          <input id="location" name="location" className="form-control"
            value={form.location} onChange={handleChange} maxLength="100" />
        </div>
        <div className="col-sm-6">
          <label htmlFor="occupation" className="form-label">Occupation (optional)</label>
          <input id="occupation" name="occupation" className="form-control"
            value={form.occupation} onChange={handleChange} maxLength="100" />
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">About you (optional)</label>
        <textarea id="description" name="description" className="form-control" rows="3"
          value={form.description} onChange={handleChange} maxLength="500" />
      </div>
      <button className="btn btn-warning w-100" disabled={sending}>
        {sending ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}
