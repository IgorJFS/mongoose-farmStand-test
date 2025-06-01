import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';

    const module = await import('./models/product.js');
    const Product = module.default;


mongoose.connect('mongodb://localhost:27017/farmStand', {
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/products', async (req, res) => {
    const products = await Product.find({});
    res.render('Products/index', { products });
});

app.get('/products/new', (req, res) => {
    res.render('products/new');
});

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(`New product created: ${newProduct}`);
    res.redirect(`/products/${newProduct._id}`);
});
    

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).send('Product not found');
    }
    console.log(`product found: ${product.name}`);
    res.render('products/show', { product});
});

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).send('Product not found');
    }
    res.render('products/edit', { product });
});

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedProduct) {
        return res.status(404).send('Product not found');
    }
    console.log(`Product updated: ${updatedProduct}`);
    res.redirect(`/products/${updatedProduct._id}`);
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
