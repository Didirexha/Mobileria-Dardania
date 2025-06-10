import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import wave from '../images/wave.jpg'; // Removed as file was deleted
// import gardenPatio from '../images/gardenPatio.webp'; // Removed as file was deleted

const API_URL = 'http://localhost:5000/api/products';

interface Product {
  _id?: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
}

const Patio: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatioProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch products and filter by category on the frontend
        console.log('Fetching patio products from:', API_URL);
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: Product[] = await res.json();
        // Filter products by category 'patio'
        const patioProducts = data.filter(product => product.category === 'patio');
        console.log('Fetched and filtered patio products:', patioProducts);
        setProducts(patioProducts);
      } catch (err) {
        console.error('Error fetching patio products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch patio products');
      } finally {
        setLoading(false);
      }
    };
    fetchPatioProducts();
  }, []);

  const handleProductClick = (productId?: string) => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <section className="pt-32 pb-20 min-h-screen bg-gray-50" style={{backgroundColor: 'rgb(249, 245, 240)'}}>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-light text-center mb-12">Patio Collection</h2>
        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading patio products...</div>
        ) : error ? (
          <div className="text-center text-red-500 text-lg">Error: {error}</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">No patio products found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="relative h-[450px] rounded-md overflow-hidden shadow-lg group cursor-pointer"
                onClick={() => handleProductClick(product._id)}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product._id);
                    }}
                  >
                    VIEW PRODUCTS
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Patio; 