import {BrowserRouter, Routes, Route, Link,  } from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import ProductScreen from "./screens/ProductScreen";
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Store } from './Store';


function App() {
  const { state } = useContext(Store);
  const { cart } = state;
  return (
    <BrowserRouter>
    <div className='site-container d-flex flex-column'>
      <header >
      <Navbar bg="primary" data-bs-theme="dark" >
        <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Star Jane</Navbar.Brand>
          </LinkContainer>
          <Nav className="me-auto">
                <Link to="/cart" className="nav-link">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
              </Nav>
        </Container>
      </Navbar>
      </header>
      <main>
        <Container className="mt-3">
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
