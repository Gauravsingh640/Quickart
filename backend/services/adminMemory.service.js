import { AdminMemory } from "../models/adminMemoryModel.js";

export async function remember(userId, key, value) {
  await AdminMemory.findOneAndUpdate(
    { userId, key },
    { value },
    { upsert: true, new: true }
  );
}

export async function recall(userId, key) {
  const memory = await AdminMemory.findOne({ userId, key });

  return memory ? memory.value : null;
}

export async function recallAll(userId) {
  const memories = await AdminMemory.find({ userId });

  const result = {};

  memories.forEach((memory) => {
    result[memory.key] = memory.value;
  });

  return result;
}

export async function forget(userId, key) {
  await AdminMemory.deleteOne({ userId, key });
}