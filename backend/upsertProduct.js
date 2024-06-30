// upsertProduct.js (or upsertProduct.mjs)

import { MongoClient } from 'mongodb';

async function upsertProduct(product) {
  const uri = "mongodb+srv://starjane:adeola@cluster0.oyl0avd.mongodb.net/starjane";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('starjane');
    const collection = database.collection('products');

    // Check if the product already exists
    const existingProduct = await collection.findOne({ name: product.name });
    
    if (existingProduct) {
      // Update the existing product
      await collection.updateOne(
        { name: product.name },
        { $set: product }
      );
      console.log('Product updated successfully');
    } else {
      // Insert the new product
      await collection.insertOne(product);
      console.log('Product inserted successfully');
    }
  } catch (err) {
    console.error('Error upserting product:', err);
  } finally {
    await client.close();
  }
}

const newProduct = {
  name: 'FashionNova',
  slug: 'fashionova-collection',
  image: './a16f168bd2e14aee62a2c5fa20033122.jpg',
  brand: 'fashionova',
  category: 'shoe',
  description: 'high quality shoe',
  price: 120,
  countInStock: 10,
  rating: 3,
  numReviews: 9,
  createdAt: new Date(),
  updatedAt: new Date()
};

upsertProduct(newProduct);
