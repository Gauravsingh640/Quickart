import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const sessionSchema = new mongoose.Schema(
  {
    // ==========================================
    // USER
    // ==========================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ==========================================
    // CHAT TITLE
    // ==========================================

    title: {
      type: String,
      default: "New Chat",
      trim: true,
    },

    // ==========================================
    // CURRENT CHAT CONTEXT
    // ==========================================

    lastIntent: {
      type: String,
      default: "",
    },

    lastQuery: {
      type: String,
      default: "",
    },

    // Products from immediately previous response
    lastProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // Original/main search products
    searchProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // ==========================================
    // CHAT MESSAGES
    // ==========================================

    chatHistory: [messageSchema],
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEX
// ==========================================
//
// IMPORTANT:
// userId is NOT unique anymore.
//
// One user can now have:
//
// User
//  ├── Chat 1
//  ├── Chat 2
//  ├── Chat 3
//  └── ...
//
// ==========================================

sessionSchema.index({
  userId: 1,
  updatedAt: -1,
});

export const Session = mongoose.model(
  "Session",
  sessionSchema
);