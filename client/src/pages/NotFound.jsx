import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="empty-state">
      <i className="bi bi-compass"></i>
      <h1 className="h4">Page not found</h1>
      <p>The page you asked for does not exist.</p>
      <Link to="/" className="btn btn-dark">Go to home</Link>
    </div>
  );
}
