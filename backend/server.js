import express from 'express';
import data from './data.js';

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

// Increase maxHttpHeaderSize (default is 8KB)
// app.use(express.json({ limit: '2mb' }));
// app.use(express.urlencoded({ extended: true, limit: '2mb' }));
// app.use(express.raw({ limit: '2mb' }));
// app.use(express.text({ limit: '2mb' }));

// Set the maximum header size
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Max-Age', '1000');
//     next();
//   });
  
//   app.use(express.json());
//   app.use(express.urlencoded({ extended: true }));
  

app.get('/api/products', (req, res) => {
  res.send(data.products);
});

app.get('/api/products/slug/:slug', (req, res) => {
  const product = data.products.find((x) => x.slug === req.params.slug);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

app.get('/api/products/:id', (req, res) => {
  const product = data.products.find((x) => x._id === req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

// Route for root path to avoid 404 errors
app.get('/', (req, res) => {
    res.send('Welcome to the API server');
  });

const port = process.env.PORT || 5002;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
