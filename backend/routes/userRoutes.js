import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { isAuth, generateToken } from '../utils.js';

const userRouter = express.Router();
userRouter.post('/signup', async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user),
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'Validation Error', errors: error.errors });
    } else if (error.code === 11000) {
      res.status(400).send({ message: 'Email already exists' });
    } else {
      res.status(500).send({ message: 'Error creating user', error: error.message });
    }
  }
});



userRouter.post(
  '/login',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: generateToken(updatedUser), // Assuming you have a function to generate a token
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

export default userRouter;