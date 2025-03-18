import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, 
  phone: { type: String, required: true, unique: true },
  hasSubscribed : { type: Boolean, default: false },
  city : { type: String },
  dealerId : { type: String },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  isActive : {
    type: Boolean,
    default: true
  }, 
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);