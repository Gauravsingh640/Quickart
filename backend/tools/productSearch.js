import { Product } from "../models/productModel.js";

export const productSearch = async ({
    budget,
    brand,
    category
}) => {

    const query = {};

    if (budget) {
        query.price = { $lte: budget };
    }

    if (brand) {
        query.brand = new RegExp(brand, "i");
    }

    if (category) {
        query.category = new RegExp(category, "i");
    }

    const products = await Product.find(query);

    return products;
};