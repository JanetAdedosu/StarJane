import express from "express";
import data from "./data.js";
//test
const app = express();

app.get('/api/product', (req, res)=> {
    res.send(data.products);
});

const port = process.env.PORT  || 4000;
app.listen(port, () => {
    console.log(`serve at http://localhost:${port}`);
});
