import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import ProductScreen from "./screens/ProductScreen";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';

function App() {
  return (
    <BrowserRouter>
    <div className='site-container d-flex flex-column'>
      <header >
      <Navbar bg="primary" data-bs-theme="dark" expand="lg">
        <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Star Jane</Navbar.Brand>
          </LinkContainer>
        </Container>
      </Navbar>
      </header>
      <main>
        <Container>
        <Routes>
        <Route path="/product/:slug" element={<ProductScreen />} />
        <Route path="/" element={<HomeScreen/>} />
        </Routes>
        </Container>
      </main>
      <footer>
      <h1 className="text-center">All Right Reserved &copy; Adedosu</h1>
      </footer>
    </div>
    </BrowserRouter>
  );
}

export default App;
