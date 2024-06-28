import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import ProductScreen from "./screens/ProductScreen";

function App() {
  return (
    <BrowserRouter>
    <div className='site-container d-flex flex-column'>
      <header >
        <Link to="/">StarJane</Link>
      </header>
      <main>
        <Routes>
        <Route path="/product/:slug" element={<ProductScreen />} />
        <Route path="/" element={<HomeScreen/>} />
        </Routes>
      </main>
      <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
    </div>
    </BrowserRouter>
  );
}

export default App;
