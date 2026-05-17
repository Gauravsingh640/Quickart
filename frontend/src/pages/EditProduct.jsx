import { useEffect, useState } from "react";

import axios from "axios";

import { useParams, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

function EditProduct() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock:0,
    brand: "",
    category: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [addedStock, setAddedStock] = useState(0);

  const [oldImages, setOldImages] = useState([]);

  // GET SINGLE PRODUCT

  const getProduct = async () => {
    try {
      const res = await axios.get(
        `https://quickart-jxc5.onrender.comapi/v1/products/${id}`,
      );

      setFormData({
        name: res.data.product.name,

        price: res.data.product.price,

        stock: res.data.product.stock,

        brand: res.data.product.brand,

        category: res.data.product.category,

        description: res.data.product.description,
      });

      setOldImages(res.data.product.images);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  // HANDLE CHANGE

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // HANDLE IMAGES

  const handleImages = (e) => {
    setImages([...e.target.files]);
  };

  // UPDATE PRODUCT

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      // FORM DATA
      const updatedStock = Number(formData.stock) + Number(addedStock);

      if ( Number(addedStock) < 0 ){
        toast.error( "Please enter number greater than 0" ); 
        return; 
      }
      const data = new FormData();

      data.append("name", formData.name);

      data.append("price", formData.price);

      data.append("stock", updatedStock);

      data.append("brand", formData.brand);

      data.append("category", formData.category);

      data.append("description", formData.description);

      // NEW IMAGES

      images.forEach((img) => {
        data.append("images", img);
      });

      // API

      const res = await axios.put(
        `https://quickart-jxc5.onrender.comapi/v1/products/${id}`,

        data,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(res.data.message);

      navigate("/dashboard/products");
    } catch (error) {
      console.log(error);

      toast.error("Update Failed");
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        <h2>Edit Product</h2>

        <form className="add-product-form" onSubmit={handleUpdate}>
          {/* NAME */}

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          {/* PRICE */}

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />

          {/* BRAND */}

          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          />

          {/* CATEGORY */}

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />

          {/* DESCRIPTION */}

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>

          <h3>Current Stock: {" "} { formData.stock } </h3> 
          <input 
            type="number" 
            placeholder="Add Stock" 
            value={ addedStock } onChange={(e) => setAddedStock( e.target.value ) } 
          />

          {/* IMAGE INPUT */}

          <label>Upload New Images</label>

          <input type="file" multiple onChange={handleImages} />

          {/* OLD IMAGES */}

          <h3>Current Images</h3>

          <div className="oldImagesPreview">
            {oldImages.map((img, index) => (
              <img key={index} src={img.url} alt="" width="80" />
            ))}
          </div>

          {/* NEW IMAGES */}

          {images.length > 0 && (
            <>
              <h3>New Images</h3>

              <div className="newImagesPreview">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(img)}
                    alt=""
                    width="80"
                  />
                ))}
              </div>
            </>
          )}

          {/* BUTTON */}

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
