import { UserMemory } from "../models/userMemoryModel.js";

export async function remember(userId, key, value) {
  try {
    console.log("Remember:", {
      userId: userId.toString(),
      key,
      value,
    });

    const memory = await UserMemory.findOneAndUpdate(
      {
        userId,
        key,
      },
      {
        userId,
        key,
        value,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    console.log("Saved Memory:", memory);

    return memory;
  } catch (err) {
    console.error("Remember Error:", err);
  }
}

export async function recall(userId, key) {
  try {
    const memory = await UserMemory.findOne({
      userId,
      key,
    });

    return memory ? memory.value : null;
  } catch (err) {
    console.error("Recall Error:", err);
    return null;
  }
}

export async function recallAll(userId) {
  try {
    const memories = await UserMemory.find({ userId });

    const result = {};

    memories.forEach((memory) => {
      result[memory.key] = memory.value;
    });

    return result;
  } catch (err) {
    console.error("RecallAll Error:", err);
    return {};
  }
}

export async function forget(userId, key) {
  try {
    await UserMemory.deleteOne({
      userId,
      key,
    });
  } catch (err) {
    console.error("Forget Error:", err);
  }
}