import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Clear search when navigating away from search page
  useEffect(() => {
    if (!location.pathname.includes('/search')) {
      setSearchQuery('');
    }
  }, [location.pathname]);

  // Handle clicks outside search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleProductsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // If we're on the home page, scroll to products section
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to home page and scroll to products
      navigate('/');
      setTimeout(() => {
        const productsSection = document.getElementById('products-section');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <header className="fixed w-full z-50 transition-all duration-300 bg-custom-bg shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-light tracking-widest">
            DARDANIA<span className="align-super text-xs ml-1">®</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`hover:text-gray-600 transition ${location.pathname === '/' ? 'text-gray-900' : 'text-gray-500'}`}>
              HOME
            </Link>
            <Link 
              to="/kitchen"
              className={`hover:text-gray-600 transition ${location.pathname === '/kitchen' ? 'text-gray-900' : 'text-gray-500'}`}
            >
              TABLES
            </Link>
            <Link 
              to="/patio"
              className={`hover:text-gray-600 transition ${location.pathname === '/patio' ? 'text-gray-900' : 'text-gray-500'}`}
            >
              PATIO
            </Link>
            <a 
              href="#products-section" 
              onClick={handleProductsClick}
              className={`hover:text-gray-600 transition ${location.pathname === '/products' ? 'text-gray-900' : 'text-gray-500'}`}
            >
              PRODUCTS
            </a>
            <Link to="/tv-decoration" className={`hover:text-gray-600 transition ${location.pathname === '/tv-decoration' ? 'text-gray-900' : 'text-gray-500'}`}>
              TV DECORATION
            </Link>
            <Link to="/contact" className={`hover:text-gray-600 transition ${location.pathname === '/contact' ? 'text-gray-900' : 'text-gray-500'}`}>
              CONTACT
            </Link>
          </nav>

          {/* Search Icon */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-500 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-md p-4">
            <form onSubmit={handleSearch} className="container mx-auto">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};
