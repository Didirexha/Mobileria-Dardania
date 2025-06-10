import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Products } from './components/Products';
import { Hero } from './components/Hero';
import { Header } from './components/Header';
import { SearchResults } from './components/SearchResults';
import { ProductDetail } from './components/ProductDetail';
import { Footer } from './components/Footer';
import Kitchen from './components/Kitchen';
import Contact from './components/Contact';
import TvDecoration from './components/TvDecoration';
import Patio from './components/Patio';
import Dashboard from './components/Dashboard';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  return (
    <div className="min-h-screen bg-custom-bg font-sans flex flex-col">
      {!isDashboard && <Header />}
      <main className="flex-grow container mx-auto px-4 py-8" style={{ maxWidth: '100%', padding: '0px' }}>
        <Routes>
          <Route path="/" element={<><Hero /><Products /></>} />
          <Route path="/kitchen" element={<Kitchen/>}/>
          <Route path="/patio" element={<Patio/>}/>
          <Route path="/products" element={<Products />} />
          <Route path="/tv-decoration" element={<TvDecoration />} />
          <Route path="/references" element={<div className="pt-32">References Page</div>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
