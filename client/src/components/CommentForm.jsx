import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createComment } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ErrorAlert from './ErrorAlert.jsx';

// Props: photoId, onAdded(comment) called with the saved comment so the parent can update the list
export default function CommentForm({ photoId, onAdded }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    return (
      <p className="text-muted">
        <Link to="/login" state={{ from: `/photos/${photoId}` }}>Log in</Link> to leave a comment.
      </p>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setError(null);
    try {
      const saved = await createComment(photoId, text, user._id);
      onAdded(saved);
      setText('');
    } catch (err) {
      setError(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <ErrorAlert message={error?.message} details={error?.details} />
      <label htmlFor="comment" className="form-label">Add a comment</label>
      <textarea
        id="comment"
        className="form-control mb-2"
        rows="3"
        maxLength="1000"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <button className="btn btn-warning" disabled={sending || !text.trim()}>
        {sending ? 'Posting...' : 'Post comment'}
      </button>
    </form>
  );
}
