import express from 'express';
import Product from '../models/productModel.js';
import { isAuth } from '../utils.js';

const productRouter = express.Router();

// Function to calculate the overall rating
const calculateRating = (reviews) => {
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / reviews.length;
};

// Fetch all products
productRouter.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching products' });
  }
});

// Fetch product by slug
productRouter.get('/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error fetching product' });
  }
});

// Fetch product by id
productRouter.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error fetching product' });
  }
});

// Add a review to a product
productRouter.post('/:productId/reviews', isAuth, async (req, res) => {
  const { rating, comment, name } = req.body;
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newReview = {
      rating,
      comment,
      name,
      createdAt: new Date(),
    };

    product.reviews.push(newReview);
    product.numReviews = product.reviews.length;
    product.rating = calculateRating(product.reviews);

    await product.save();

    res.status(201).json({
      message: 'Review added successfully',
      review: newReview,
      numReviews: product.numReviews,
      rating: product.rating,
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Failed to add review' });
  }
});

export default productRouter;
