import express from "express";

import {

  addProduct,

  getProducts,

  getSingleProduct,

  updateProduct,

  deleteProduct,

} from "../controllers/productController.js";

import {upload} from "../middleware/multer.js";

const router =
  express.Router();


// ADD PRODUCT

router.post(
  "/add-product",
  upload.array("images",5),
  addProduct
);


// GET ALL PRODUCTS

router.get(
  "/",
  getProducts
);


// GET SINGLE PRODUCT

router.get(
  "/:id",
  getSingleProduct
);


// UPDATE PRODUCT

router.put(
  "/:id",
  upload.array("images",5),
  updateProduct
);


// DELETE PRODUCT

router.delete(
  "/:id",
  deleteProduct
);

export default router;