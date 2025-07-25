import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { handleBuyProduct } from '../utils/buyUtils';

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
                <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  className="bg-white text-gray-900 px-8 py-3 font-medium tracking-widest rounded-sm shadow hover:bg-gray-100 transition"
                  onClick={e => {
                    e.stopPropagation();
                    navigate(`/product/${product._id}`);
                  }}
                >
                  VIEW PRODUCTS
                </button>
                <button 
                  className="bg-green-600 text-white px-8 py-3 font-medium tracking-widest rounded-sm shadow hover:bg-green-700 transition flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyProduct(product);
                  }}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  BUY NOW
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 