// services/adminMemory.service.js

import { AdminMemory } from "../models/adminMemoryModel.js";


// ==========================================
// ALLOWED MEMORY KEYS
// ==========================================

const ALLOWED_MEMORY_KEYS = new Set([
  "name",
  "reportFormat",
  "reportPreference",
  "dashboardPreference",
  "defaultPeriod",
  "currency",
]);


// ==========================================
// REMEMBER
// ==========================================

export const remember = async (
  userId,
  key,
  value
) => {
  try {
    // ========================================
    // VALIDATION
    // ========================================

    if (!userId) {
      throw new Error(
        "User ID is required to save memory."
      );
    }

    if (
      !key ||
      typeof key !== "string"
    ) {
      throw new Error(
        "Valid memory key is required."
      );
    }

    if (!ALLOWED_MEMORY_KEYS.has(key)) {
      console.warn(
        "Unsupported Admin Memory Key:",
        key
      );

      return null;
    }

    if (
      value === undefined ||
      value === null ||
      String(value).trim() === ""
    ) {
      return null;
    }


    // ========================================
    // NORMALIZE VALUE
    // ========================================

    const normalizedValue =
      typeof value === "string"
        ? value.trim()
        : value;


    // ========================================
    // UPSERT MEMORY
    // ========================================

    const memory =
      await AdminMemory.findOneAndUpdate(
        {
          userId,
          key,
        },

        {
          $set: {
            value:
              normalizedValue,
          },
        },

        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );


    return memory;

  } catch (error) {
    console.error(
      `Admin Memory Save Error [${key}]:`,
      error
    );

    throw error;
  }
};


// ==========================================
// RECALL ONE MEMORY
// ==========================================

export const recall = async (
  userId,
  key
) => {
  try {
    if (
      !userId ||
      !key
    ) {
      return null;
    }


    const memory =
      await AdminMemory.findOne({
        userId,
        key,
      })
        .select("value")
        .lean();


    return memory?.value ?? null;

  } catch (error) {
    console.error(
      `Admin Memory Recall Error [${key}]:`,
      error
    );

    throw error;
  }
};


// ==========================================
// RECALL ALL MEMORIES
// ==========================================

export const recallAll = async (
  userId
) => {
  try {
    if (!userId) {
      return {};
    }


    const memories =
      await AdminMemory.find({
        userId,
      })
        .select("key value")
        .lean();


    const result = {};


    for (const memory of memories) {
      if (
        memory.key &&
        ALLOWED_MEMORY_KEYS.has(memory.key)
      ) {
        result[memory.key] =
          memory.value;
      }
    }


    return result;

  } catch (error) {
    console.error(
      "Admin Memory Recall All Error:",
      error
    );

    throw error;
  }
};


// ==========================================
// FORGET ONE MEMORY
// ==========================================

export const forget = async (
  userId,
  key
) => {
  try {
    if (
      !userId ||
      !key
    ) {
      return false;
    }


    const result =
      await AdminMemory.deleteOne({
        userId,
        key,
      });


    return result.deletedCount > 0;

  } catch (error) {
    console.error(
      `Admin Memory Forget Error [${key}]:`,
      error
    );

    throw error;
  }
};


// ==========================================
// FORGET ALL ADMIN MEMORIES
// ==========================================

export const forgetAll = async (
  userId
) => {
  try {
    if (!userId) {
      return 0;
    }


    const result =
      await AdminMemory.deleteMany({
        userId,
      });


    return result.deletedCount || 0;

  } catch (error) {
    console.error(
      "Admin Memory Forget All Error:",
      error
    );

    throw error;
  }
};