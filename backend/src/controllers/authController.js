import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = new User({ username, dealerId , balance ,  password, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { dealerId, password } = req.body;
  try {
    const user = await User.findOne({ dealerId });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if(!user){
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    return res.status(200).json({ message: 'Admin logged in successfully' });
  }catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export {
  adminLogin,
  register,
  login,
}