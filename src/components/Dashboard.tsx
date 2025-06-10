import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/products';

interface Product {
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  category: string;
  features?: string[];
  specifications?: {
    [key: string]: string;
  };
}

interface ProductFormState {
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  category: string;
  features: string;
  specifications: string;
}

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductFormState | null>(null);
  const [newProduct, setNewProduct] = useState<ProductFormState>({
    title: '',
    subtitle: '',
    description: '',
    images: [],
    category: '',
    features: '',
    specifications: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products.');
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle file selection for upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
      setUploadSuccess(false);
      setUploadError(null);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setUploadError('Please select at least one file to upload');
      return null;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      setUploadSuccess(true);
      setFiles(null);
      return data.filenames;
    } catch (err) {
      setUploadError('Failed to upload files');
      console.error('Upload error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Delete product
  const handleDelete = async (id?: string) => {
    if (!id) return;

    if (window.confirm('Are you sure you want to delete this product?')) {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Delete failed with status: ${res.status}`);
            }

            console.log('Product deleted successfully:', data);
            setProducts(products.filter(p => p._id !== id));
            setError(null);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong while deleting product.');
            console.error('Delete product error:', err);
        } finally {
            setLoading(false);
        }
    }
  };

  // Handle adding new product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.description || !newProduct.category) {
      setError('Title, Description, and Category are required to add a product.');
      return;
    }

    setError(null);
    setLoading(true);

    let uploadedFilenames: string[] = [];

    if (files && files.length > 0) {
      const newFilenames = await handleUpload();
      if (newFilenames) {
        uploadedFilenames = newFilenames;
      }
    }

    const featuresArray = newProduct.features
      ? newProduct.features.split(',').map(feature => feature.trim()).filter(feature => feature.length > 0)
      : undefined;

    let specificationsObject = undefined;
    if (newProduct.specifications) {
      try {
        specificationsObject = JSON.parse(newProduct.specifications);
        if (typeof specificationsObject !== 'object' || specificationsObject === null || Array.isArray(specificationsObject)) {
          throw new Error('Specifications must be a valid JSON object.');
        }
      } catch (parseError) {
        setError(`Invalid JSON format for Specifications: ${parseError instanceof Error ? parseError.message : 'Parsing failed'}`);
        setLoading(false);
        return;
      }
    }

    try {
      const productToAdd: Omit<Product, '_id'> = {
        title: newProduct.title,
        subtitle: newProduct.subtitle,
        description: newProduct.description,
        images: uploadedFilenames,
        category: newProduct.category,
        ...(featuresArray && { features: featuresArray }),
        ...(specificationsObject && { specifications: specificationsObject }),
      };

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToAdd),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add product');
      }

      console.log('Product added successfully:', data);
      setProducts([...products, data]);
      setNewProduct({
        title: '',
        subtitle: '',
        description: '',
        images: [],
        category: '',
        features: '',
        specifications: '',
      });
      setFiles(null);
      setError(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while adding product.');
      console.error('Add product error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change for new product form
  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'category') {
      if (!files || files.length === 0) {
        const imagePath = value ? `http://localhost:5000/uploads/${value}.webp` : '';
        setNewProduct({ ...newProduct, [name]: value, images: [imagePath] });
      } else {
        setNewProduct({ ...newProduct, [name]: value });
      }
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  // Handle initiating edit mode
  const startEditing = (product: Product) => {
    setEditingProduct({
      _id: product._id,
      title: product.title,
      subtitle: product.subtitle,
      description: product.description,
      images: product.images || [],
      category: product.category,
      features: product.features ? product.features.join(', ') : '',
      specifications: product.specifications ? JSON.stringify(product.specifications, null, 2) : '',
    });
    setFiles(null);
    setUploadError(null);
    setUploadSuccess(false);
  };

  // Handle input change for editing product form
  const handleEditProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: value });
    }
  };

  // Handle canceling edit mode
  const cancelEditing = () => {
    setEditingProduct(null);
    setError(null);
    setFiles(null);
    setUploadError(null);
    setUploadSuccess(false);
  };

  // Handle saving edited product
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct._id) {
      setError('No product selected for editing or missing ID.');
      return;
    }

    if (!editingProduct.title || !editingProduct.description || !editingProduct.category) {
      setError('Title, Description, and Category are required to update a product.');
      return;
    }

    setError(null);
    setLoading(true);

    let uploadedFilenames: string[] = editingProduct.images || [];

    if (files && files.length > 0) {
      const newFilenames = await handleUpload();
      if (newFilenames) {
        uploadedFilenames = [...uploadedFilenames, ...newFilenames];
      }
    }
    
    const featuresArray = editingProduct.features
      ? editingProduct.features.split(',').map(feature => feature.trim()).filter(feature => feature.length > 0)
      : undefined;

    let specificationsObject = undefined;
    if (editingProduct.specifications) {
      try {
        specificationsObject = JSON.parse(editingProduct.specifications);
        if (typeof specificationsObject !== 'object' || specificationsObject === null || Array.isArray(specificationsObject)) {
          throw new Error('Specifications must be a valid JSON object.');
        }
      } catch (parseError) {
        setError(`Invalid JSON format for Specifications: ${parseError instanceof Error ? parseError.message : 'Parsing failed'}`);
        setLoading(false);
        return;
      }
    }

    try {
      const productToUpdate: Omit<Product, '_id'> = {
        title: editingProduct.title,
        subtitle: editingProduct.subtitle,
        description: editingProduct.description,
        images: uploadedFilenames,
        category: editingProduct.category,
        ...(featuresArray && { features: featuresArray }),
        ...(specificationsObject && { specifications: specificationsObject }),
      };

      const res = await fetch(`${API_URL}/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToUpdate),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update product');
      }

      console.log('Product updated successfully:', data);
      setProducts(products.map(p => p._id === data._id ? data : p));
      setEditingProduct(null);
      setFiles(null);
      setError(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while updating product.');
      console.error('Update product error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && products.length === 0) return <div className="text-center mt-8">Loading products...</div>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col py-8 px-6 min-h-screen">
        <h1 className="text-2xl font-bold mb-8 tracking-widest">DASHBOARD</h1>
        <nav className="flex flex-col space-y-4">
          <a href="#add-product-form" className="font-semibold text-gray-200 bg-gray-800 rounded px-3 py-2">Add New Product</a>
          <span className="font-semibold text-gray-200 bg-gray-800 rounded px-3 py-2">Manage Products</span>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Global Error Display */}
        {error && !loading && (
           <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">Error: {error}</div>
        )}

        {/* Add New Product Form */}
        <div id="add-product-form" className="mb-12 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
          
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label htmlFor="newTitle" className="block text-gray-700 mb-2">Title</label>
              <input type="text" id="newTitle" name="title" value={newProduct.title} onChange={handleNewProductChange} required className="w-full px-3 py-2 border rounded-md" disabled={loading || uploading}/>
            </div>
            <div>
              <label htmlFor="newSubtitle" className="block text-gray-700 mb-2">Subtitle</label>
              <input type="text" id="newSubtitle" name="subtitle" value={newProduct.subtitle} onChange={handleNewProductChange} className="w-full px-3 py-2 border rounded-md" disabled={loading || uploading}/>
            </div>
            <div>
              <label htmlFor="newDescription" className="block text-gray-700 mb-2">Description</label>
              <textarea id="newDescription" name="description" value={newProduct.description} onChange={handleNewProductChange} required rows={3} className="w-full px-3 py-2 border rounded-md" disabled={loading || uploading}></textarea>
            </div>
            <div>
               <label htmlFor="newCategory" className="block text-gray-700 mb-2">Category</label>
               <select id="newCategory" name="category" value={newProduct.category} onChange={handleNewProductChange} required className="w-full px-3 py-2 border rounded-md" disabled={loading || uploading}>
                  <option value="">Select Category</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="tv-decoration">TV Decoration</option>
                  <option value="patio">Patio</option>
               </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full"
              />
              {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
              {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
              {uploadSuccess && <p className="text-sm text-green-500">Upload successful!</p>}
            </div>
            {/* Add Features Textarea */}
            <div>
              <label htmlFor="newFeatures" className="block text-gray-700 mb-2">Key Features (comma-separated)</label>
              <textarea
                id="newFeatures"
                name="features"
                rows={3}
                value={newProduct.features}
                onChange={handleNewProductChange}
                className="w-full px-3 py-2 border rounded-md" 
                disabled={loading || uploading}
                placeholder="e.g., Feature 1, Feature 2, Another feature"
              ></textarea>
            </div>
             {/* Add Specifications Textarea */}
            <div>
              <label htmlFor="newSpecifications" className="block text-gray-700 mb-2">Specifications (JSON format)</label>
              <textarea
                id="newSpecifications"
                name="specifications"
                rows={5}
                value={newProduct.specifications}
                onChange={handleNewProductChange}
                className="w-full px-3 py-2 border rounded-md" 
                 disabled={loading || uploading}
                placeholder='{\"Dimension\": \"120x80x75cm\", \"Material\": \"Wood\"}'
              ></textarea>
<p className="mt-1 text-sm text-gray-600">
  Enter specifications as a valid JSON object (e.g., {"{\"key\": \"value\"}"}).
</p>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading || uploading || !files}>
              {loading ? 'Adding...' : (uploading ? 'Uploading Images...' : 'Add Product')}
            </button>
          </form>
        </div>

        {/* Edit Product Form */}
        {editingProduct && (
          <div className="mb-12 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
            
            <form onSubmit={handleSaveEdit} className="space-y-4">
               <div>
                  <label htmlFor="editTitle" className="block text-gray-700 mb-2">Title</label>
                  <input type="text" id="editTitle" name="title" value={editingProduct.title} onChange={handleEditProductChange} required className="w-full px-3 py-2 border rounded-md" disabled={loading || uploading}/>
                </div>
                <div>
                  <label htmlFor="editSubtitle" className="block text-gray-700 mb-2">Subtitle</label>
                  <input type="text" id="editSubtitle" name="subtitle" value={editingProduct.subtitle} onChange={handleEditProductChange} className="w-full px-3 py-2 border rounded-md" disabled={loading || uploading}/>
                </div>
                <div>
                  <label htmlFor="editDescription" className="block text-gray-700 mb-2">Description</label>
                  <textarea id="editDescription" name="description" value={editingProduct.description} onChange={handleEditProductChange} required rows={3} className="w-full px-3 py-2 border rounded-md" disabled={loading || uploading}></textarea>
                </div>
                <div>
                  <label htmlFor="editCategory" className="block text-gray-700 mb-2">Category</label>
                  <select id="editCategory" name="category" value={editingProduct.category} onChange={handleEditProductChange} required className="w-full px-3 py-2 border rounded-md" disabled={loading || uploading}>
                     <option value="">Select Category</option>
                     <option value="kitchen">Kitchen</option>
                     <option value="tv-decoration">TV Decoration</option>
                     <option value="patio">Patio</option>
                  </select>
                </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700">Images</label>
                   <input
                     type="file"
                     multiple
                     accept="image/*"
                     onChange={handleFileChange}
                     className="mt-1 block w-full"
                   />
                   {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
                   {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
                   {uploadSuccess && <p className="text-sm text-green-500">Upload successful!</p>}
                 </div>
                {/* Add Features Textarea for Edit */}
                <div>
                  <label htmlFor="editFeatures" className="block text-gray-700 mb-2">Key Features (comma-separated)</label>
                  <textarea
                    id="editFeatures"
                    name="features"
                    rows={3}
                    value={editingProduct.features}
                    onChange={handleEditProductChange}
                    className="w-full px-3 py-2 border rounded-md" 
                    disabled={loading || uploading}
                    placeholder="e.g., Feature 1, Feature 2, Another feature"
                  ></textarea>
                </div>
                 {/* Add Specifications Textarea for Edit */}
                <div>
                  <label htmlFor="editSpecifications" className="block text-gray-700 mb-2">Specifications (JSON format)</label>
                  <textarea
                    id="editSpecifications"
                    name="specifications"
                    rows={5}
                    value={editingProduct.specifications}
                    onChange={handleEditProductChange}
                    className="w-full px-3 py-2 border rounded-md" 
                     disabled={loading || uploading}
                     placeholder='{\"Dimension\": \"120x80x75cm\", \"Material\": \"Wood\"}'
                  ></textarea>
                  <p className="mt-1 text-sm text-gray-600">
  Enter specifications as a valid JSON object (e.g., {"{\"key\": \"value\"}"}).
</p>

                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading || uploading || (!files && editingProduct.images.length === 0)}>
                     {loading ? 'Saving...' : (uploading ? 'Uploading Images...' : 'Save Changes')}
                  </button>
                  <button type="button" onClick={cancelEditing} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition">Cancel</button>
                </div>
            </form>
            {editingProduct && editingProduct.images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {editingProduct.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`http://localhost:5000/uploads/${image}`}
                      alt={`Product image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct({
                          ...editingProduct,
                          images: editingProduct.images.filter((_, i) => i !== index)
                        });
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Product List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Existing Products</h2>
          {loading && products.length === 0 ? (
            <div className="text-center text-gray-500">Loading products...</div>
          ) : products.length === 0 ? (
             <div className="text-center text-gray-500">No products found. Add one above!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map(product => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-md object-cover" src={product.images && product.images.length > 0 ? `http://localhost:5000/uploads/${product.images[0]}` : 'placeholder-image.jpg'} alt="" onError={(e) => (e.currentTarget.src = 'placeholder-image.jpg')}/>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs overflow-hidden truncate">
                         {product.description}
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => startEditing(product)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                        <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 