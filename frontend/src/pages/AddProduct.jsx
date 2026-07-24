import {
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import { toast }
from "react-toastify";


function AddProduct() {

  const navigate =
  useNavigate();

  const [formData,
    setFormData] =
    useState({

      name:"",
      price:"",
      brand:"",
      category:"",
      description:"",
    });

  const [images,
    setImages] =
    useState([]);
 
  const [stock,
    setStock] =
    useState(0); 


  // HANDLE INPUT

  const handleChange =
  (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value,
    });
  };

  // HANDLE IMAGES

  const handleImages =
  (e) => {

    setImages(

      [...e.target.files]
    );
  };

  // HANDLE SUBMIT

  const handleSubmit =
  async (e) => {

    e.preventDefault();

    try {

      // FORM DATA

      const data =
      new FormData();

      data.append(
        "name",
        formData.name
      );

      data.append(
        "price",
        formData.price
      );

      data.append(
        "brand",
        formData.brand
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "description",
        formData.description
      );

      data.append( "stock", stock );

      // IMAGES

      images.forEach((img) => {

        data.append(
          "images",
          img
        );
      });

      // API

      const res =
      await axios.post(

        "https://quickart-jxc5.onrender.com/api/v1/products/add-product",

        data,

        {

          headers:{

            "Content-Type":
            "multipart/form-data",
          },
        }
      );

      toast.success(
        res.data.message
      );

      navigate(
        "/dashboard/products"
      );

    }

    catch(error){

      console.log(error);

      toast.error(

        error.response
        ?.data?.message
      );
    }
  };

  return (

    <div className="add-product-page">

      <div className="add-product-container">

        <h2>
          Add Product
        </h2>

        <p>
          Enter product details below
        </p>

        <form

          className="add-product-form"

          onSubmit={
            handleSubmit
          }
        >

          {/* PRODUCT NAME */}

          <label>
            Product Name
          </label>

          <input

            type="text"

            name="name"

            placeholder="Ex-Iphone"

            value={
              formData.name
            }

            onChange={
              handleChange
            }
          />

          {/* PRICE + STOCK */}
          <div className="row">

            <div className="input-group">

              <label>
                Price
              </label>

              <input

                type="number"

                name="price"

                placeholder="0"

                value={
                  formData.price
                }

                onChange={
                  handleChange
                }
              />
            </div>

            <div className="input-group">

              <label>
                Stock
              </label>

              <input

                type="number"

                name="stock"

                placeholder="0"

                value={
                  stock
                }

                onChange={
                  (e) => setStock(e.target.value)
                }
              />
            </div>
          </div>

          {/* BRAND + CATEGORY */}

          <div className="row">

            <div className="input-group">

              <label>
                Brand
              </label>

              <input

                type="text"

                name="brand"

                placeholder="Ex-Apple"

                value={
                  formData.brand
                }

                onChange={
                  handleChange
                }
              />

            </div>

            <div className="input-group">

              <label>
                Category
              </label>

              <input

                type="text"

                name="category"

                placeholder="Ex-Mobile"

                value={
                  formData.category
                }

                onChange={
                  handleChange
                }
              />

            </div>

          </div>

          {/* DESCRIPTION */}

          <label>
            Description
          </label>

          <textarea

            name="description"

            placeholder="Enter brief description of product"

            value={
              formData.description
            }

            onChange={
              handleChange
            }

          ></textarea>

          {/* IMAGE */}

          <label>
            Product Images
          </label>

          <input

            type="file"

            multiple

            onChange={
              handleImages
            }
          />

          {/* PREVIEW */}

          <div className="previewImages">

            {

              images.map(
                (img,index) => (

                  <img

                    key={index}

                    src={
                      URL.createObjectURL(
                        img
                      )
                    }

                    alt=""
                    width="80"
                  />
                ))
            }

          </div>

          {/* BUTTON */}

          <button type="submit">

            Add Product

          </button>

        </form>

      </div>

    </div>
  );
}

export default AddProduct;