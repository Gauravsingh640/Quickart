import { UserMemory } from "../models/userMemoryModel.js";

export async function remember(
  userId,
  key,
  value
) {
  try {
    console.log("Remember:", {
      userId: userId.toString(),
      key,
      value,
    });

    // null means remove that preference
    if (value === null || value === undefined) {
      await UserMemory.deleteOne({
        userId,
        key,
      });

      console.log("Removed Memory:", key);

      return null;
    }

    const memory =
      await UserMemory.findOneAndUpdate(
        {
          userId,
          key,
        },
        {
          $set: {
            userId,
            key,
            value,
          },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );

    console.log("Saved Memory:", memory);

    return memory;
  } catch (error) {
    console.error(
      "Remember Error:",
      error
    );

    throw error;
  }
}

export async function recall(
  userId,
  key
) {
  try {
    const memory =
      await UserMemory.findOne({
        userId,
        key,
      });

    return memory?.value ?? null;
  } catch (error) {
    console.error(
      "Recall Error:",
      error
    );

    return null;
  }
}

export async function recallAll(userId) {
  try {
    const memories =
      await UserMemory.find({
        userId,
      });

    const result = {};

    for (const memory of memories) {
      result[memory.key] = memory.value;
    }

    return result;
  } catch (error) {
    console.error(
      "RecallAll Error:",
      error
    );

    return {};
  }
}

export async function forget(
  userId,
  key
) {
  try {
    await UserMemory.deleteOne({
      userId,
      key,
    });
  } catch (error) {
    console.error(
      "Forget Error:",
      error
    );

    throw error;
  }
}