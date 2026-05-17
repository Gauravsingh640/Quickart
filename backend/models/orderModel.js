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
    deliveryCode: { type: String },
 
    address:{
      fullName:String,
      phone:String,
      email:String,
      address:String,
      city:String,
      state:String,
      zipCode:String,
      country:String,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Out For Delivery",
        "Delivered",
        "Failed",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  { timestamps: true },
);
export const Order = mongoose.model("Order", orderSchema);
