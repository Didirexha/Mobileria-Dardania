const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mobileriadardania', {
  // Removed deprecated options
});

// Define the Product model
const Product = mongoose.model('Product', new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  images: { type: [String], default: [] },
  category: String,
  features: { type: [String], required: false },
  specifications: { type: Object, required: false },
}));

async function seedDatabase() {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Sample kitchen products
    const kitchenProducts = [
      {
        title: "Modern Kitchen Cabinet",
        subtitle: "Contemporary Design",
        description: "A sleek and modern kitchen cabinet with premium finish and ample storage space.",
        images: ["1748917559260.jpg"],
        category: "kitchen",
        features: ["Premium wood finish", "Soft-close hinges", "Adjustable shelves"],
        specifications: {
          dimensions: "60\" x 24\" x 30\"",
          material: "Solid wood",
          color: "White"
        }
      },
      {
        title: "Kitchen Island",
        subtitle: "Multi-functional Centerpiece",
        description: "A versatile kitchen island with built-in storage and seating area.",
        images: ["1748917912098.jpg"],
        category: "kitchen",
        features: ["Built-in storage", "Breakfast bar", "Wheel casters"],
        specifications: {
          dimensions: "48\" x 24\" x 36\"",
          material: "Maple wood",
          color: "Natural"
        }
      },
      {
        title: "Kitchen Pantry",
        subtitle: "Organized Storage Solution",
        description: "A spacious pantry cabinet perfect for organizing kitchen essentials.",
        images: ["1748918373536.jpg"],
        category: "kitchen",
        features: ["Pull-out shelves", "Spice rack", "Basket storage"],
        specifications: {
          dimensions: "24\" x 24\" x 84\"",
          material: "Plywood with veneer",
          color: "Oak"
        }
      }
    ];

    // Insert the products
    const insertedProducts = await Product.insertMany(kitchenProducts);
    console.log(`Successfully added ${insertedProducts.length} kitchen products`);

    // Also add some other category products for testing
    const otherProducts = [
      {
        title: "Living Room Sofa",
        subtitle: "Comfortable Seating",
        description: "A comfortable sofa perfect for your living room.",
        images: ["1748918578351.jpg"],
        category: "living-room",
        features: ["Premium fabric", "High-density foam", "Sturdy frame"],
        specifications: {
          dimensions: "84\" x 35\" x 38\"",
          material: "Fabric and wood",
          color: "Gray"
        }
      }
    ];

    const insertedOtherProducts = await Product.insertMany(otherProducts);
    console.log(`Successfully added ${insertedOtherProducts.length} other products`);

    // Add patio products
    const patioProducts = [
      {
        title: "Outdoor Dining Set",
        subtitle: "Elegant Patio Furniture",
        description: "A beautiful outdoor dining set perfect for entertaining guests in your patio.",
        images: ["1748919195052.webp"],
        category: "patio",
        features: ["Weather-resistant", "Comfortable seating", "Easy to clean"],
        specifications: {
          dimensions: "Table: 60\" x 60\" x 30\"",
          material: "Wrought iron and glass",
          color: "Black"
        }
      },
      {
        title: "Patio Lounge Chair",
        subtitle: "Relaxing Outdoor Seating",
        description: "A comfortable lounge chair for relaxing in your outdoor space.",
        images: ["1748950965734.jpg"],
        category: "patio",
        features: ["Adjustable backrest", "Cushioned seat", "Portable design"],
        specifications: {
          dimensions: "28\" x 32\" x 42\"",
          material: "Aluminum and fabric",
          color: "Beige"
        }
      }
    ];

    const insertedPatioProducts = await Product.insertMany(patioProducts);
    console.log(`Successfully added ${insertedPatioProducts.length} patio products`);

    // Add TV decoration products
    const tvDecorationProducts = [
      {
        title: "TV Stand with Storage",
        subtitle: "Modern Entertainment Center",
        description: "A sleek TV stand with ample storage for your entertainment devices and accessories.",
        images: ["1749580231834.webp"],
        category: "tv-decoration",
        features: ["Cable management", "Adjustable shelves", "Glass doors"],
        specifications: {
          dimensions: "60\" x 20\" x 24\"",
          material: "Engineered wood and glass",
          color: "Black"
        }
      },
      {
        title: "Wall Mount TV Bracket",
        subtitle: "Space-Saving Solution",
        description: "A sturdy wall mount bracket for flat-screen TVs with cable management.",
        images: ["1749580221399.jpg"],
        category: "tv-decoration",
        features: ["Tilt adjustment", "Cable routing", "Universal compatibility"],
        specifications: {
          dimensions: "Varies by TV size",
          material: "Steel and aluminum",
          color: "Black"
        }
      },
      {
        title: "TV Console Cabinet",
        subtitle: "Elegant Entertainment Storage",
        description: "A beautiful console cabinet designed to complement your TV setup.",
        images: ["1749580209969.jpg"],
        category: "tv-decoration",
        features: ["Hidden storage", "Cable holes", "Premium finish"],
        specifications: {
          dimensions: "72\" x 18\" x 28\"",
          material: "Solid wood",
          color: "Walnut"
        }
      }
    ];

    const insertedTvDecorationProducts = await Product.insertMany(tvDecorationProducts);
    console.log(`Successfully added ${insertedTvDecorationProducts.length} TV decoration products`);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
  }
}

// Run the seeding
seedDatabase(); 