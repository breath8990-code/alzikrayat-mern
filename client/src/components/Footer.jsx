export default function Footer() {
  return (
    <footer className="text-white py-3 mt-5">
      <div className="container d-flex flex-wrap justify-content-between gap-2">
        <span>&copy; {new Date().getFullYear()} Alzikrayat</span>
        <span className="text-white-50">Advanced Web Technologies, MERN edition</span>
      </div>
    </footer>
  );
}
