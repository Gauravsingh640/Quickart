import mongoose from "mongoose";

import {
  memorySchema,
} from "./memoryModel.js";


// ==========================================
// ADMIN MEMORY MODEL
// ==========================================

export const AdminMemory = mongoose.model(
  "AdminMemory",
  memorySchema,
  "admin_memories"
);