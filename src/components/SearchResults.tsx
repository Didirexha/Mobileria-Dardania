import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/products';

interface Product {
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  category: string;
  features?: string[];
  specifications?: {
    [key: string]: string;
  };
}

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching all products for search from:', API_URL);
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: Product[] = await res.json();
        console.log('Fetched all products:', data);
        setAllProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products for search');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []); // Fetch all products only once on mount

  useEffect(() => {
    // Filter products based on query whenever allProducts or query changes
    const filtered = allProducts.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(query.toLowerCase()))
    );
    setResults(filtered);
  }, [query, allProducts]);

  if (loading) {
    return (
      <div className="pt-32 min-h-screen bg-custom-bg" style={{backgroundColor: 'rgb(249, 245, 240)'}}>
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

   if (error) {
    return (
      <div className="pt-32 min-h-screen bg-custom-bg">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500 text-lg">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <section className="pt-32 pb-20 min-h-screen bg-custom-bg" style={{backgroundColor: 'rgb(249, 245, 240)'}}>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-light text-center mb-12">Search Results {query && `for "${query}"`}</h2>
        {results.length === 0 && query && (
          <div className="text-center text-gray-500 text-lg">No products found for "{query}".</div>
        )}
         {results.length === 0 && !query && (
          <div className="text-center text-gray-500 text-lg">Please enter a search query.</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((product) => (
            <div
              key={product._id}
              className="relative h-[450px] rounded-md overflow-hidden shadow-lg group cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img
                src={product.image.startsWith('http') ? product.image : `http://localhost:5000/uploads/${product.image}`}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 onError={(e) => {
                    console.error('Error loading image:', product.image);
                    // Fallback image or placeholder
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-60 transition duration-300" />
              <div className="relative z-10 flex flex-col justify-center items-start h-full p-8">
                <span className="text-white text-xs tracking-widest mb-2 font-light">
                  {product.subtitle}
                </span>
                <h3 className="text-white text-3xl md:text-4xl font-semibold mb-8 tracking-widest leading-tight">
                  {product.title}
                </h3>
                <button 
                  className="bg-white text-gray-900 px-8 py-3 font-medium tracking-widest rounded-sm shadow hover:bg-gray-100 transition"
                  onClick={e => {
                    e.stopPropagation();
                    navigate(`/product/${product._id}`);
                  }}
                >
                  VIEW PRODUCTS
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 