import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPhotos } from '../api.js';
import PhotoCard from '../components/PhotoCard.jsx';
import Loading from '../components/Loading.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

export default function Home() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPhotos()
      .then(setPhotos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero rounded-4 p-5 mb-4">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <p className="text-warning fw-semibold mb-2">A visual diary for meaningful memories</p>
            <h1 className="display-4 fw-bold">Share the moments that matter.</h1>
            <p className="lead">
              Alzikrayat is a warm, simple photo-sharing space for your stories, people, and places.
            </p>
            <Link className="btn btn-warning btn-lg" to="/photos">
              Explore gallery <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="col-lg-4 text-center display-icon">
            <i className="bi bi-camera2"></i>
          </div>
        </div>
      </section>

      <div className="text-center mb-5">
        <h2>Capture. Connect. Remember.</h2>
        <p className="text-muted">
          Upload high-quality photos, tell the story behind them, and let friends add their own words.
        </p>
      </div>

      <h2 className="section-heading h3 mb-3">Latest photos</h2>
      {loading && <Loading />}
      <ErrorAlert message={error} />
      {!loading && !error && photos.length === 0 && (
        <div className="empty-state">
          <i className="bi bi-images"></i>
          <p className="mb-0">No photos yet. Log in and upload the first one.</p>
        </div>
      )}
      <div className="row g-4">
        {photos.slice(0, 3).map((photo) => (
          <div className="col-md-6 col-lg-4" key={photo._id}>
            <PhotoCard photo={photo} />
          </div>
        ))}
      </div>
    </>
  );
}
