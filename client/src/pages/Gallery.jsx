import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPhotos } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import PhotoCard from '../components/PhotoCard.jsx';
import Loading from '../components/Loading.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

export default function Gallery() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    getPhotos()
      .then(setPhotos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="gallery-toolbar d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h1 className="h3 section-heading mb-0">Gallery</h1>
        <div className="d-flex gap-2 align-items-center">
          <div className="btn-group" role="group" aria-label="Display style">
            <button
              type="button"
              className={`btn btn-outline-dark btn-sm${view === 'grid' ? ' active' : ''}`}
              onClick={() => setView('grid')}
            >
              <i className="bi bi-grid-3x3-gap"></i> Grid
            </button>
            <button
              type="button"
              className={`btn btn-outline-dark btn-sm${view === 'list' ? ' active' : ''}`}
              onClick={() => setView('list')}
            >
              <i className="bi bi-list-ul"></i> List
            </button>
          </div>
          {user && (
            <Link to="/upload" className="btn btn-warning btn-sm">
              <i className="bi bi-cloud-arrow-up"></i> Upload
            </Link>
          )}
        </div>
      </div>

      {loading && <Loading text="Loading photos..." />}
      <ErrorAlert message={error} />

      {!loading && !error && photos.length === 0 && (
        <div className="empty-state">
          <i className="bi bi-images"></i>
          <p className="mb-0">The gallery is empty. Upload the first photo.</p>
        </div>
      )}

      <div className={`row g-4${view === 'list' ? ' list-style' : ''}`}>
        {photos.map((photo) => (
          <div className={view === 'list' ? 'col-12' : 'col-md-6 col-lg-4'} key={photo._id}>
            <PhotoCard photo={photo} />
          </div>
        ))}
      </div>
    </>
  );
}
