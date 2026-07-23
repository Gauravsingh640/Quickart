import { Product } from "../models/productModel.js";

export const compareProducts = async (products) => {

    return await Product.find({
        name: {
            $in: products
        }
    });

};