// migrateCategory.js
 
import mongoose from "mongoose";
import { Order } from "./models/orderModel.js";
import { Product } from "./models/productModel.js";



await mongoose.connect("mongodb+srv://gauravsingh71205:gauravsingh71205@cluster0.uxynx36.mongodb.net");

console.log("✅ MongoDB Connected");

const orders = await Order.find();

console.log(`📦 Total Orders: ${orders.length}`);

let updatedOrders = 0;
let updatedItems = 0;

for (const order of orders) {
  let orderChanged = false;

  for (const item of order.items) {
    console.log("--------------------------------");
    console.log("Order:", order._id);
    console.log("Product Id:", item.id);
    console.log("Current Category:", item.category);

    // Agar category already hai to skip
    if (item.category) continue;

    const product = await Product.findById(item.id).select("category");

    if (!product) {
      console.log("❌ Product Not Found");
      continue;
    }

    console.log("✅ Product Found:", product.category);

    item.category = product.category;
    orderChanged = true;
    updatedItems++;
  }

  if (orderChanged) {
    await order.save();
    updatedOrders++;
    console.log("💾 Order Updated:", order._id);
  }
}

console.log("\n==============================");
console.log("Migration Completed");
console.log("Orders Updated :", updatedOrders);
console.log("Items Updated  :", updatedItems);
console.log("==============================\n");

await mongoose.disconnect();
console.log("🔌 MongoDB Disconnected");