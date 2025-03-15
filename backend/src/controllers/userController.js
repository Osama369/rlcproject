import User from "../models/User.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  const { username, password, dealerId, city } = req.body;
  try {
    const user = new User({ username, password, city, dealerId });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const updatedUserData = req.body;
  if (!updatedUserData) {
    return res.status(400).json({
      message: "Invalid user data",
    });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(id, updatedUserData, {
      new: true,
    }).select("-password");
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const toggleUserActiveStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    user.isActive = !user.isActive;
    await user.save();
    return res.status(200).json({
      message: "User active status updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const initializeUserBalance = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    user.balance += amount;
    await user.save();
    return res.status(200).json({
      message: "User balance initialized successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deductUserBalance = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    user.amount -= amount;
    await user.save();
    return res.status(200).json({
      message: "User balance deducted successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserActiveStatus,
  initializeUserBalance,
  deductUserBalance,
};
