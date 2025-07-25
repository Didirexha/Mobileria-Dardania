import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { handleBuyProduct } from '../utils/buyUtils';
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

            {/* Buy Button */}
            <div className="pt-4">
              <button
                onClick={() => handleBuyProduct(product)}
                className="w-full bg-green-600 text-white px-8 py-4 font-semibold text-lg tracking-wider rounded-md shadow-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 