import { Link } from 'react-router-dom';
import { imageUrl } from '../api.js';
import { formatDate, fullName } from '../utils/format.js';

// Props: photo (a photo object returned by the API)
export default function PhotoCard({ photo }) {
  const detailPath = `/photos/${photo._id}`;
  const shortDescription =
    photo.description && photo.description.length > 90
      ? `${photo.description.slice(0, 90)}...`
      : photo.description;

  return (
    <div className="photo-card h-100">
      <Link to={detailPath} className="d-block flex-shrink-0">
        <img src={imageUrl(photo.fileName)} alt={photo.title} loading="lazy" />
      </Link>
      <div className="card-body flex-grow-1">
        <h5 className="card-title">
          <Link to={detailPath} className="text-dark text-decoration-none">{photo.title}</Link>
        </h5>
        {shortDescription && <p className="text-muted small mb-2">{shortDescription}</p>}
        <small>
          <i className="bi bi-person"></i> {fullName(photo.userId)} &middot; {formatDate(photo.dateTime)}
        </small>
      </div>
    </div>
  );
}
