import { Product }
from "../models/productModel.js";
import cloudinary
from "../utils/cloudinary.js";

// ADD PRODUCT

export const addProduct =
async (req, res) => {

  try {

    const {
      name,
      price,
      brand,
      category,
      description, 
    } = req.body;

    const uploadedImages =
    [];

    for (const file of req.files){

      const result =

      await cloudinary
      .uploader
      .upload(

        file.path,

        {

          folder:
          "quickart_products",
        }
      );

      uploadedImages.push({

        url:
        result.secure_url,

        public_id:
        result.public_id,
      });
    }

    const product =
      await Product.create({

        name,

        price,

        brand,

        category,

        description,

        images: uploadedImages,

      });

    res.status(201).json({

      success: true,

      message:
        "Product Added",

      product,
    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
};


// GET ALL PRODUCTS

export const getProducts =
async (req, res) => {

  try {

    const products =
      await Product.find()

      .sort({
        createdAt: -1,
      });

    res.status(200).json({

      success: true,

      products,
    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
};


// GET SINGLE PRODUCT

export const getSingleProduct =
async (req, res) => {

  try {

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {

      return res.status(404)
      .json({

        success: false,

        message:
          "Product Not Found",
      });
    }

    res.status(200).json({

      success: true,

      product,
    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
};


// UPDATE PRODUCT

export const updateProduct =
async (req, res) => {

  try {

    const product =
    await Product.findById(

      req.params.id
    );

    if (!product){

      return res.status(404)
      .json({

        success:false,

        message:
        "Product Not Found",
      });
    }

    // DELETE OLD IMAGES

    if (
      req.files &&
      req.files.length > 0
    ){

      for (
        const image
        of
        product.images
      ){

        await cloudinary
        .uploader
        .destroy(

          image.public_id
        );
      }

      // UPLOAD NEW

      const uploadedImages =
      [];

      for (
        const file
        of
        req.files
      ){

        const result =

        await cloudinary
        .uploader
        .upload(

          file.path,

          {

            folder:
            "quickart_products",
          }
        );

        uploadedImages.push({

          url:
          result.secure_url,

          public_id:
          result.public_id,
        });
      }

      product.images =
      uploadedImages;
    }

    // UPDATE DATA

    product.name =
    req.body.name;

    product.price =
    req.body.price;

    product.brand =
    req.body.brand;

    product.category =
    req.body.category;

    product.description =
    req.body.description;

    await product.save();

    return res.status(200)
    .json({

      success:true,

      message:
      "Product Updated",

      product,
    });

  }

  catch(error){

    return res.status(500)
    .json({

      success:false,

      message:error.message,
    });
  }
};


// DELETE PRODUCT

export const deleteProduct =
async (req, res) => {

  try {

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {

      return res.status(404)
      .json({

        success: false,

        message:
          "Product Not Found",
      });
    }

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({

      success: true,

      message:
        "Product Deleted",
    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
};