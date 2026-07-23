import dotenv from "dotenv";
dotenv.config();

import connectDB from "../database/db.js";
import {Product} from "../models/productModel.js";
import { generateEmbedding } from "../services/embedding.service.js";

const run = async () => {
  try {
    await connectDB();

    const products = await Product.find();

    console.log(`Found ${products.length} products`);

    for (const product of products) {
      if (!product.embedding || product.embedding.length === 0) {
        const text = `
          ${product.name}
          ${product.brand}
          ${product.category}
          ${product.description}
        `;

        product.embedding = await generateEmbedding(text);
        await product.save();

        console.log(`✅ Updated: ${product.name}`);
      }
    }

    console.log("🎉 All embeddings generated.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();