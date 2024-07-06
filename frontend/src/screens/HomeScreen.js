import React, { useEffect, useReducer, useContext } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const config = {};
        if (userInfo && userInfo.token) {
          config.headers = { Authorization: `Bearer ${userInfo.token}` };
        }
        const { data } = await axios.get('https://starjane-6.onrender.com/api/products', config);
        //dispatch({ type: 'FETCH_SUCCESS', payload: data });
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: data.sort((a, b) => {
            if (a.name === 'FashionNova') return -1;
            if (b.name === 'FashionNova') return 1;
            if (a.name === 'Starjane') return -1;
            if (b.name === 'Starjane') return 1;
            if (a.name === 'Fenty') return -1;
            if (b.name === 'Fenty') return 1;
            return 0;
          }),
        });
      } catch (err) {
        const errorMessage = err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
        dispatch({ type: 'FETCH_FAIL', payload: errorMessage });
      }
    };

    fetchData();
  }, [userInfo]);

  return (
    <div>
      <Helmet>
        <title>Star Jane</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
