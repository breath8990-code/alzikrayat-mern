// Shows an error message and, when the server sent them, the list of validation details
export default function ErrorAlert({ message, details = [] }) {
  if (!message) return null;
  return (
    <div className="alert alert-danger" role="alert">
      {message}
      {details.length > 0 && (
        <ul className="mb-0 mt-2">
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
