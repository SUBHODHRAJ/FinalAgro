import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';
import AboutPage from './pages/AboutPage';
import DashboardPage from './pages/DashboardPage';
import HeatmapPage from './pages/HeatmapPage';
import Footer from './components/Footer';
import GlobalChatPanel from './components/GlobalChatPanel';


function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/heatmap" element={<HeatmapPage />} />
          </Routes>
          <Footer />
          <GlobalChatPanel />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
