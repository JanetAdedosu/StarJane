import data from "./data";

function App() {
  return (
    <div >
      <header >
        <a href="/">Star Jane</a>
      </header>
      <main>
        <h1>Featured Products</h1>
        <div className="products">
        {data.products.map(product => (
          <div className="product" key={product.slug}>
          <a href={`/product/${product.slug}`}>
          <img src={product.image} alt={product.name}/>
          </a>
          <div className="product-info">
          <a href={`/product/${product.slug}`}>
          <p>{product.name}</p>
          </a>
          <strong><p>${product.price}</p></strong>
          <button>Add To Cart</button>
          </div>
         </div>
        ))}
        </div>
      </main>
    </div>
  );
}

export default App;
