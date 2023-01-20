import mongoose from "mongoose";

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: ["smartphones", "tablets", "laptops", "pc"],
    },
    reviews: [
      {
        comment: { type: String, required: true },
        rate: { type: Number, min: 0, max: 5, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default model("Product", productSchema);
