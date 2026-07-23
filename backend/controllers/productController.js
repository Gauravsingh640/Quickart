import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import { generateEmbedding } from "../services/embedding.service.js";

// ======================
// ADD PRODUCT
// ======================

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      brand,
      category,
      description,
      stock,
    } = req.body;

    const uploadedImages = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "quickart_products",
      });

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    // Generate Embedding
    const embedding = await generateEmbedding(`
      Product Name: ${name}
      Brand: ${brand}
      Category: ${category}
      Description: ${description}
    `);

    console.log("Embedding Length:", embedding.length);
    console.log("Embedding Length:", embedding.length);
    console.log("Embedding exists:", !!embedding);
    console.log("First 5:", embedding.slice(0, 5));

    const product = await Product.create({
      name,
      price,
      stock,
      brand,
      category,
      description,
      embedding, // ⭐ IMPORTANT
      images: uploadedImages,
    });

    console.log(product.toObject());
    console.log(product.embedding);

    res.status(201).json({
      success: true,
      message: "Product Added",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// GET ALL PRODUCTS
// ======================

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// GET SINGLE PRODUCT
// ======================

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// UPDATE PRODUCT
// ======================

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    // Replace Images
    if (req.files && req.files.length > 0) {
      for (const image of product.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }

      const uploadedImages = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "quickart_products",
        });

        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }

      product.images = uploadedImages;
    }

    // Update Fields
    product.name = req.body.name;
    product.price = req.body.price;
    product.stock = req.body.stock;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.description = req.body.description;

    // Regenerate Embedding
    const embedding = await generateEmbedding(`
      Product Name: ${product.name}
      Brand: ${product.brand}
      Category: ${product.category}
      Description: ${product.description}
    `);

    product.embedding = embedding;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product Updated",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// DELETE PRODUCT
// ======================

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};