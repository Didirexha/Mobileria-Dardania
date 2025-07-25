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
    <header className={`fixed w-full z-50 transition-all duration-300 shadow-md ${
      location.pathname === '/' ? 'bg-[#0000004f]' : 'bg-white'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center h-20">
          {/* Logo */}
          <Link to="/" className={`text-2xl font-light tracking-widest ${
            location.pathname === '/' ? 'text-white' : 'text-black'
          }`}>
            DARDANIA<span className="align-super text-xs ml-1">®</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 ml-auto mr-8">
            <Link to="/" className={`hover:text-gray-300 transition ${
              location.pathname === '/' ? 'text-white' : 'text-black'
            }`}>
              HOME
            </Link>
            <Link 
              to="/kitchen"
              className={`hover:text-gray-300 transition ${
                location.pathname === '/' ? 'text-white' : 'text-black'
              }`}
            >
              TABLES
            </Link>
            <Link 
              to="/patio"
              className={`hover:text-gray-300 transition ${
                location.pathname === '/' ? 'text-white' : 'text-black'
              }`}
            >
              PATIO
            </Link>
            <a 
              href="#products-section" 
              onClick={handleProductsClick}
              className={`hover:text-gray-300 transition ${
                location.pathname === '/' ? 'text-white' : 'text-black'
              }`}
            >
              PRODUCTS
            </a>
            <Link to="/tv-decoration" className={`hover:text-gray-300 transition ${
              location.pathname === '/' ? 'text-white' : 'text-black'
            }`}>
              TV DECORATION
            </Link>
            <Link to="/contact" className={`hover:text-gray-300 transition ${
              location.pathname === '/' ? 'text-white' : 'text-black'
            }`}>
              CONTACT
            </Link>
          </nav>

          {/* Search Icon */}
          <div className="flex items-center space-x-4 relative">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`hover:text-gray-300 transition-all duration-300 ${
                isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
              } ${
                location.pathname === '/' ? 'text-white' : 'text-black'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Inline Search Bar */}
            <div 
              ref={searchRef}
              className={`flex items-center space-x-2 transition-all duration-300 ${
                isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              style={{width: '20%', minWidth: '200px'}}
            >
              <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className={`flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-gray-500 text-sm placeholder-gray-300 ${
                    location.pathname === '/' ? 'text-white' : 'text-black'
                  }`}
                  style={{
                    backgroundColor: location.pathname === '/' ? '#0000004f' : 'white'
                  }}
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors duration-200 text-sm"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className={`hover:text-gray-300 transition ${
                    location.pathname === '/' ? 'text-white' : 'text-black'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
