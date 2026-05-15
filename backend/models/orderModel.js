import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        id: String,
        title: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true },
);
export const Order = mongoose.model("Order", orderSchema);
