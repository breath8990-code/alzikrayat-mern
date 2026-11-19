import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoginForm from '../components/LoginForm.jsx';
import RegisterForm from '../components/RegisterForm.jsx';

export default function LoginRegister() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [justRegistered, setJustRegistered] = useState(false);

  const goBack = () => navigate(location.state?.from || '/', { replace: true });

  // Already logged in (for example right after a successful login)
  if (user) return <Navigate to={location.state?.from || '/'} replace />;

  const handleRegistered = () => {
    setJustRegistered(true);
    setMode('login');
  };

  return (
    <div className="auth-card mx-auto">
      <div className="btn-group w-100 mb-4" role="group" aria-label="Login or register">
        <button type="button" className={`btn btn-outline-dark${mode === 'login' ? ' active' : ''}`}
          onClick={() => setMode('login')}>Log in</button>
        <button type="button" className={`btn btn-outline-dark${mode === 'register' ? ' active' : ''}`}
          onClick={() => setMode('register')}>Register</button>
      </div>

      {mode === 'login' ? (
        <>
          <h1 className="h3 mb-3">Welcome back</h1>
          {justRegistered && (
            <div className="alert alert-success" role="status">Account created. Log in to continue.</div>
          )}
          <LoginForm onSuccess={goBack} />
        </>
      ) : (
        <>
          <h1 className="h3 mb-3">Create your account</h1>
          <RegisterForm onSuccess={handleRegistered} />
        </>
      )}
    </div>
  );
}
