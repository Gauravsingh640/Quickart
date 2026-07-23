import mongoose from "mongoose";
import { memorySchema } from "./memoryModel.js";

export const UserMemory = mongoose.model(
  "UserMemory",
  memorySchema,
  "user_memories"
);