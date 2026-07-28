import mongoose from "mongoose";


// ==========================================
// MEMORY SCHEMA
// ==========================================

export const memorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    key: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


// ==========================================
// UNIQUE MEMORY PER USER + KEY
// ==========================================

memorySchema.index(
  {
    userId: 1,
    key: 1,
  },
  {
    unique: true,
  }
);