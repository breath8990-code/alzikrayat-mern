export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="text-center py-5" role="status">
      <div className="spinner-border text-warning" aria-hidden="true"></div>
      <p className="text-muted mt-3 mb-0">{text}</p>
    </div>
  );
}
