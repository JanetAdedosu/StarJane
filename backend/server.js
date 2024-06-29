import express from 'express';
import data from './data.js';

const app = express();

app.get('/api/products', (req, res)=> {
    res.send(data.products);
});

//backend api for returning product information based
//on slug product
app.get('/api/products/slug/:slug', (req, res)=> {
    const product = data.products.find(x => x.slug === req.params.slug);
    if (product) {
        res.send(product);
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
});

const port = process.env.PORT  || 3000;
app.listen(port, () => {
    console.log(`serve at http://localhost:${port}`);
});
