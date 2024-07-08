import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Card, Col, ListGroup, Row } from 'react-bootstrap';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
};

const OrderScreen = () => {
  const { state: globalState } = useContext(Store);
  const { userInfo } = globalState;
  const params = useParams();
  const { id: orderId } = params;

  const [orderState, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false,
    loadingPay: false,
  });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`https://starjane-6.onrender.com/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    const loadPaypalScript = async () => {
      try {
        const { data: clientId } = await axios.get('https://starjane-6.onrender.com/api/keys/paypal', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      } catch (err) {
        toast.error('Failed to load PayPal script');
        console.error('PayPal script loading error:', err);
      }
    };

    if (!userInfo) {
      // Redirect to login if userInfo is not available
      return;
    }

    if (!orderState.order._id || orderState.successPay || orderState.order._id !== orderId) {
      fetchOrder();
      if (orderState.successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      loadPaypalScript();
    }
  }, [orderId, userInfo, orderState.order._id, orderState.successPay, paypalDispatch]);

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(`/api/orders/${orderState.order._id}/pay`, details, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is paid');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  };

  const onError = (err) => {
    toast.error(getError(err));
  };

  return orderState.loading ? (
    <LoadingBox />
  ) : orderState.error ? (
    <MessageBox variant="danger">{orderState.error}</MessageBox>
  ) : (
    <div>
      <h1>Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Text>
                <strong>Name:</strong> {orderState.order.shippingAddress.fullName} <br />
                <strong>Address: </strong> {orderState.order.shippingAddress.address},
                {orderState.order.shippingAddress.city}, {orderState.order.shippingAddress.postalCode}, {orderState.order.shippingAddress.country}
              </Card.Text>
              {orderState.order.isDelivered ? (
                <MessageBox variant="success">Delivered on {orderState.order.deliveredAt}</MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {orderState.order.orderItems.map((item) => (
                  <ListGroup.Item key={item.product}>
                    <Row>
                      <Col md={1}>
                        <img src={item.image} alt={item.name} className="small" />
                      </Col>
                      <Col>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>
                      <Col md={4}>
                        {item.qty} x ${item.price} = ${item.qty * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${orderState.order.itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${orderState.order.shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${orderState.order.taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${orderState.order.totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Payment Status</Col>
                  <Col>{orderState.order.isPaid ? 'Paid' : 'Not Paid'}</Col>
                </Row>
              </ListGroup.Item>
              {!orderState.order.isPaid && (
                <ListGroup.Item>
                  {isPending ? (
                    <LoadingBox />
                  ) : (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: orderState.order.totalPrice.toFixed(2),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={onApprove}
                      onError={onError}
                      options={{
                        'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID, // Ensure this is correctly set
                        currency: 'USD',
                      }}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderScreen;
