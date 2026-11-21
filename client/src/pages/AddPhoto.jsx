import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { createPhoto } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

export default function AddPhoto() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // Only logged-in users can upload
  if (!user) return <Navigate to="/login" replace state={{ from: '/upload' }} />;

  const handleFile = (e) => {
    const chosen = e.target.files[0];
    if (preview) URL.revokeObjectURL(preview);
    setFile(chosen || null);
    setPreview(chosen ? URL.createObjectURL(chosen) : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('photo', file); // the file goes last so the text fields arrive first
      const photo = await createPhoto(formData);
      navigate(`/photos/${photo._id}`);
    } catch (err) {
      setError(err);
      setSending(false);
    }
  };

  return (
    <div className="form-card mx-auto">
      <h1 className="h3">Upload a photo</h1>
      <p className="text-muted">JPG, PNG, GIF or WEBP, up to 5 MB.</p>
      <form onSubmit={handleSubmit}>
        <ErrorAlert message={error?.message} details={error?.details} />
        <div className="mb-3">
          <label htmlFor="photo" className="form-label">Photo</label>
          <input id="photo" type="file" className="form-control"
            accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFile} required />
        </div>
        {preview && <img src={preview} alt="Preview" className="img-fluid rounded-3 mb-3" style={{ maxHeight: 260 }} />}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input id="title" className="form-control" value={title} maxLength="200"
            onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Story (optional)</label>
          <textarea id="description" className="form-control" rows="3" value={description} maxLength="1000"
            onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button className="btn btn-warning w-100" disabled={sending || !file}>
          {sending ? 'Uploading...' : 'Upload photo'}
        </button>
      </form>
    </div>
  );
}
