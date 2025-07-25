const mongoose = require('mongoose');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mobileriadardania', {
  // Removed deprecated options
});

// Define the Product model
const Product = mongoose.model('Product', new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  image: String,
  category: String,
  features: [String],
  specifications: Object,
}));

async function migrateImages() {
  try {
    // Get all products
    const products = await Product.find();
    console.log(`Found ${products.length} products to migrate`);

    // Update each product
    for (const product of products) {
      if (product.image) {
        // Extract filename from the path
        const filename = path.basename(product.image);
        console.log(`Updating product ${product._id}:`);
        console.log(`  From: ${product.image}`);
        console.log(`  To: ${filename}`);

        // Update the product with just the filename
        await Product.findByIdAndUpdate(product._id, { image: filename });
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
  }
}

// Run the migration
migrateImages(); 