import dotenv from "dotenv";
dotenv.config();

import { generateEmbedding } from "./services/embedding.service.js";

const embedding = await generateEmbedding(
    "Wireless Bluetooth Headphones with Noise Cancellation"
);

console.log(embedding.length);
console.log(embedding.slice(0,5));