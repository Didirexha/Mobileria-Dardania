const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// Configure CORS
app.use(cors({
  origin: (origin, callback) => {
    // Allow all localhost ports for development
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mobileriadardania', {
  // Removed deprecated options
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

// Define a Product schema
const Product = mongoose.model('Product', new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  images: { type: [String], default: [] }, // Changed from single image to array of images
  category: String,
  features: { type: [String], required: false }, // Add optional features array
  specifications: { type: Object, required: false }, // Add optional specifications object
}));

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Get all products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  console.log('Fetched products:', JSON.stringify(products, null, 2));
  res.json(products);
});

// Get a single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Validate if the provided ID is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.log(`Invalid product ID format: ${productId}`);
      return res.status(400).json({ error: 'Invalid product ID format.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      console.log(`Product not found with ID: ${productId}`);
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new product
app.post('/api/products', async (req, res) => {
  try {
    const productData = { ...req.body };
    // If images are full paths, extract just the filenames
    if (productData.images && Array.isArray(productData.images)) {
      productData.images = productData.images.map(image => 
        image.includes('/') ? path.basename(image) : image
      );
    }
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a product by ID
app.put('/api/products/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    // If images are full paths, extract just the filenames
    if (updateData.images && Array.isArray(updateData.images)) {
      updateData.images = updateData.images.map(image => 
        image.includes('/') ? path.basename(image) : image
      );
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a product by ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload endpoint - modified to handle multiple files
app.post('/api/upload', upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      console.error('No files received for upload.');
      return res.status(400).json({ error: 'No files uploaded.' });
    }
    const filenames = req.files.map(file => file.filename);
    console.log('Files uploaded successfully:', filenames);
    res.json({ filenames });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).json({ error: 'Internal server error during upload.' });
  }
});

// Handle contact form submission and generate WhatsApp link
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const phoneNumber = '38348222209'; // Your target WhatsApp number without '+'
    const text = `Message from ${name} (${email}):\n\n${message}`;
    // Encode the text for URL
    const encodedText = encodeURIComponent(text);
    // Construct the wa.me link
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    console.log('Generated WhatsApp URL:', whatsappUrl);
    res.json({ whatsappUrl });
  } catch (error) {
    console.error('Error in contact endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add more routes as needed...

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 