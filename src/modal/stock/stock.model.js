import mongoose, { Schema } from "mongoose";

const stockSchema = new Schema({
  name: { type: String, required: true },
  desc: { type: String },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String },
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection",
  },
  
  imageUrl: { type: String },
  imagePublicId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const collectionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  desc: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  imageUrl: { type: String },
  imagePublicId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Stock = mongoose.model("Stock", stockSchema);
export const Collection = mongoose.model("Collection", collectionSchema);
