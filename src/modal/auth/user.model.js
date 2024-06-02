import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
  },
  shared: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.getToken = function (req, res) {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

export const User = mongoose.model("User", userSchema);
