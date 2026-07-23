import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },

    lastIntent: {
      type: String,
      default: "",
    },

    lastQuery: {
      type: String,
      default: "",
    },

    lastProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    chatHistory: [
      {
        role: String,
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Session = mongoose.model("Session", sessionSchema);