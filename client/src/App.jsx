import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Gallery from './pages/Gallery.jsx';
import PhotoDetail from './pages/PhotoDetail.jsx';
import AddPhoto from './pages/AddPhoto.jsx';
import LoginRegister from './pages/LoginRegister.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

// Routes configuration
export default function App() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photos" element={<Gallery />} />
          <Route path="/photos/:id" element={<PhotoDetail />} />
          <Route path="/upload" element={<AddPhoto />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
