import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';

import cors from 'cors';

import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';

// Load environment variables
dotenv.config({ path: './backend/.env' }); // Specify the path to the .env file

// Verify environment variables
console.log('MONGODB_URI:', process.env.MONGODB_URI);

if (!process.env.MONGODB_URI) {
  console.error('MongoDB URI is not defined in environment variables');
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for multiple frontend origins
const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

// Routes
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter); // Ensure this route is public
app.use('/api/users', userRouter); // Ensure this registration is present
app.use('/api/orders', orderRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);


// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Root route to avoid 404 errors
app.get('/', (req, res) => {
  res.send('Welcome to the API server');
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
