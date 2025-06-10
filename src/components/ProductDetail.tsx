import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Remove hardcoded image imports
// import wave from '../images/wave.jpg';
// import sunline from '../images/sunline.webp';
// import gardenPatio from '../images/gardenPatio.webp';
// import kitchenTable from '../images/kitchen-table.webp';
// import kitchenTable1 from '../images/kitchen-table1.jpg';
// import kitchenTable2 from '../images/kitchen-table2.jpg';
// import tvDecoration from '../images/tv-decoration.webp';
// import tvDecoration1 from '../images/tv-decoration1.avif';
// import tvDecoration2 from '../images/tv-decoration2.avif';

const API_URL = 'http://localhost:5000/api/products';

interface Product {
  _id: string;
  subtitle: string;
  title: string;
  images: string[]; // Changed from image to images array
  description: string;
  // Assuming features and specifications are part of the product data from backend
  features?: string[];
  specifications?: {
    [key: string]: string;
  };
}

// Remove hardcoded products list
// const products: Product[] = [...];

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('No product ID provided.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching product with ID:', id);
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setProduct(null);
          } else {
             throw new Error(`HTTP error! status: ${res.status}`);
          }
        } else {
           const data = await res.json();
           console.log('Fetched product:', data);
           setProduct(data);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Re-run effect if ID changes

  const nextImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="pt-32 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Loading Product...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
     return (
      
      <div className="pt-32 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500 text-lg">
            <h1 className="text-3xl font-bold mb-4">Error Loading Product</h1>
            <p>{error}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
     );
  }

  if (!product) {
    return (
      <div className="pt-32 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen bg-custom-bg mb-2.5">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative h-[600px] rounded-lg overflow-hidden shadow-lg">
            {product.images && product.images.length > 0 ? (
              <>
                <img
                  src={product.images[currentImageIndex].startsWith('http') 
                    ? product.images[currentImageIndex] 
                    : `http://localhost:5000/uploads/${product.images[currentImageIndex]}`}
                  alt={`${product.title} - Image ${currentImageIndex + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Error loading image:', product.images[currentImageIndex]);
                    e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
                  }}
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <span className="text-gray-600 text-sm tracking-widest mb-2 block">
                {product.subtitle}
              </span>
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
              <ul className="space-y-2">
                {product.features?.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                    <dt className="text-sm font-medium text-gray-500">{key}</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">{value}</dd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 