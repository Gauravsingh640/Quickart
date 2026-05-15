import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    brand: {
      type: String,
    },

    category: {
      type: String,
    },

    description: {
      type: String,
    },

    images: [
      {
        url: String,

        public_id: String,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
    },
  },

  {
    timestamps: true,
  },
);

export const Product = mongoose.model("Product", productSchema);
