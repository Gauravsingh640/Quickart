import mongoose from "mongoose";
import { memorySchema } from "./memoryModel.js";

export const AdminMemory = mongoose.model(
  "AdminMemory",
  memorySchema,
  "admin_memories"
);