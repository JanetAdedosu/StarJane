// orderRoutes.js

import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAuth } from '../utils.js';

const orderRouter = express.Router();

// POST /api/orders
orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (
      !orderItems ||
      orderItems.length === 0 ||
      !shippingAddress ||
      !paymentMethod ||
      itemsPrice === undefined ||
      shippingPrice === undefined ||
      taxPrice === undefined ||
      totalPrice === undefined
    ) {
      return res.status(400).send({ message: 'Missing required order fields' });
    }

    // Ensure all order items have the necessary fields
    const isValidOrderItems = orderItems.every(
      item => item.product && item.quantity && item.price && item.name && item.image && item.slug
    );

    if (!isValidOrderItems) {
      return res.status(400).send({ message: 'Invalid order items format' });
    }

    const newOrder = new Order({
      orderItems: orderItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
        slug: item.slug,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      user: req.user._id,
    });

    try {
      const createdOrder = await newOrder.save();
      res.status(201).send({ message: 'New Order Created', order: createdOrder });
    } catch (error) {
      console.error('Error creating order:', error.message);
      res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
  })
);

// GET /api/orders/mine
orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id });
      res.send(orders);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
  })
);

// GET /api/orders/:id
orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (order) {
        res.send(order);
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    } catch (error) {
      console.error('Error fetching order:', error.message);
      res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
  })
);

// PUT /api/orders/:id/pay
orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();
        res.send({ message: 'Order Paid', order: updatedOrder });
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    } catch (error) {
      console.error('Error updating order payment:', error.message);
      res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
  })
);

export default orderRouter;
