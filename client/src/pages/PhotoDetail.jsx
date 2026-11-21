import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deletePhoto, getComments, getPhoto, imageUrl } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import CommentForm from '../components/CommentForm.jsx';
import Loading from '../components/Loading.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import { formatDateTime, fullName } from '../utils/format.js';

export default function PhotoDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let ignore = false; // avoids updating state if the user navigates away mid-request
    setLoading(true);
    setError('');
    Promise.all([getPhoto(id), getComments(id)])
      .then(([photoData, commentData]) => {
        if (ignore) return;
        setPhoto(photoData);
        setComments(commentData);
      })
      .catch((err) => !ignore && setError(err.message))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [id]);

  // The new comment is added to state, so the list updates without a page reload
  const handleCommentAdded = (comment) => setComments((current) => [comment, ...current]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this photo and its comments?')) return;
    setDeleting(true);
    try {
      await deletePhoto(id);
      navigate('/photos');
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) return <Loading text="Loading photo..." />;

  if (error || !photo) {
    return (
      <>
        <ErrorAlert message={error || 'Photo not found'} />
        <Link to="/photos" className="btn btn-dark">Back to gallery</Link>
      </>
    );
  }

  const isOwner = user && photo.userId && photo.userId._id === user._id;

  return (
    <div className="row g-4">
      <div className="col-lg-7">
        <img className="detail-image" src={imageUrl(photo.fileName)} alt={photo.title} />
      </div>

      <div className="col-lg-5">
        <div className="detail-panel mb-4">
          <h1 className="h3 section-heading">{photo.title}</h1>
          <p className="text-muted small">
            <i className="bi bi-person"></i> {fullName(photo.userId)} &middot; {formatDateTime(photo.dateTime)}
          </p>
          {photo.description && <p>{photo.description}</p>}
          <div className="d-flex gap-2">
            <Link to="/photos" className="btn btn-outline-dark btn-sm">
              <i className="bi bi-arrow-left"></i> Gallery
            </Link>
            {isOwner && (
              <button className="btn btn-outline-danger btn-sm" onClick={handleDelete} disabled={deleting}>
                <i className="bi bi-trash"></i> {deleting ? 'Deleting...' : 'Delete photo'}
              </button>
            )}
          </div>
        </div>

        <div className="detail-panel">
          <h2 className="h5 section-heading">Comments ({comments.length})</h2>
          <CommentForm photoId={photo._id} onAdded={handleCommentAdded} />
          {comments.length === 0 && <p className="text-muted mb-0">No comments yet.</p>}
          {comments.map((c) => (
            <div className="comment" key={c._id}>
              <strong>{fullName(c.userId)}</strong>{' '}
              <small className="text-muted">{formatDateTime(c.dateTime)}</small>
              <p>{c.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
