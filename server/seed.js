const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mobileriadardania', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Product = mongoose.model('Product', new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  image: String,
  category: String,
}));

const products = [
  {
    title: 'WEAVE PATIO COLLECTION',
    subtitle: 'SUMMER LIVING ELEGANCE',
    description: 'Experience the perfect blend of comfort and style with our Weave Patio Collection. This elegant outdoor furniture set brings a touch of sophistication to your outdoor living space while ensuring maximum comfort for you and your guests.',
    image: 'wave.jpg',
    category: 'Patio',
  },
  {
    title: 'SUNLINE COLLECTION',
    subtitle: 'COSMOPOLITAN',
    description: 'The Sunline Collection represents modern urban living at its finest. With its sleek lines and contemporary design, this collection brings a cosmopolitan feel to any space, perfect for those who appreciate sophisticated style.',
    image: 'sunline.webp',
    category: 'Sunline',
  },
  {
    title: 'GARDEN PATIO COLLECTION',
    subtitle: 'SCANDINAVIAN STYLE & COMFORT',
    description: 'Embrace the simplicity and functionality of Scandinavian design with our Garden Patio Collection. This collection combines minimalist aesthetics with practical comfort, perfect for creating a serene outdoor retreat.',
    image: 'gardenPatio.webp',
    category: 'Patio',
  },
  {
    title: 'KITCHEN TABLE COLLECTION',
    subtitle: 'MODERN KITCHEN ESSENTIALS',
    description: 'Transform your kitchen into a modern culinary haven with our Kitchen Table Collection. These tables combine functionality with contemporary design, creating the perfect centerpiece for your kitchen space.',
    image: 'kitchen-table.webp',
    category: 'Kitchen',
  },
  {
    title: 'KITCHEN TABLE SERIES 1',
    subtitle: 'CONTEMPORARY DESIGN',
    description: 'The Kitchen Table Series 1 brings contemporary elegance to your dining space. With its clean lines and sophisticated design, this table serves as both a functional piece and a statement of modern style.',
    image: 'kitchen-table1.jpg',
    category: 'Kitchen',
  },
  {
    title: 'KITCHEN TABLE SERIES 2',
    subtitle: 'ELEGANT DINING',
    description: 'Experience the perfect blend of elegance and functionality with our Kitchen Table Series 2. This collection offers sophisticated dining solutions that combine timeless design with modern practicality.',
    image: 'kitchen-table2.jpg',
    category: 'Kitchen',
  },
  {
    title: 'TV DECORATION COLLECTION',
    subtitle: 'MODERN LIVING ROOM',
    description: 'Elevate your living room with our TV Decoration Collection. This modern and stylish collection combines functionality with aesthetic appeal, creating the perfect backdrop for your entertainment space.',
    image: 'tv-decoration.webp',
    category: 'TV Decoration',
  },
  {
    title: 'TV DECORATION SERIES 1',
    subtitle: 'CONTEMPORARY STYLE',
    description: 'The TV Decoration Series 1 brings contemporary elegance to your entertainment space. With its sleek design and practical features, this unit provides both style and functionality for your modern living room.',
    image: 'tv-decoration1.avif',
    category: 'TV Decoration',
  },
  {
    title: 'TV DECORATION SERIES 2',
    subtitle: 'ELEGANT DISPLAY',
    description: 'Create an elegant entertainment center with our TV Decoration Series 2. This sophisticated design combines modern aesthetics with practical storage solutions, perfect for showcasing your TV and media equipment.',
    image: 'tv-decoration2.avif',
    category: 'TV Decoration',
  },
];

async function seed() {
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log('Database seeded!');
  mongoose.disconnect();
}

seed(); 