import mongoose from 'mongoose';

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/farmStand');
    console.log("Connected to MongoDB");

    const module = await import('./models/product.js');
    const Product = module.default;

    const seedProducts = [
      { name: 'Apple', price: 1.0, category: 'fruit' },
      { name: 'Banana', price: 0.5, category: 'fruit' },
      { name: 'Carrot', price: 0.75, category: 'vegetable' },
      { name: 'Milk', price: 2.0, category: 'dairy' }
    ];
    
    const res = await Product.insertMany(seedProducts);
    console.log('Seed products inserted:', res);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
