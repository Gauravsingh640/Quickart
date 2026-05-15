import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

import { toast }
from "react-toastify";

function ProductsAdmin() {

  const navigate =
    useNavigate();

  const [allProducts,
    setAllProducts] =
    useState([]);

  const [searchText,
    setSearchText] =
    useState("");

  const [sortPrice,
    setSortPrice] =
    useState("");

  // FETCH PRODUCTS

  const fetchProducts =
  async () => {

    try {

      const res =
      await axios.get(
        "https://quickart-jxc5.onrender.com/api/v1/products"
      );

      setAllProducts(
        res.data.products
      );

    }

    catch (error) {

      console.log(error);

      toast.error(
        "Failed to fetch products"
      );
    }
  };

  useEffect(() => {

    fetchProducts();

  }, []);

  // DELETE PRODUCT

  const handleDelete =
  async (id) => {

    try {

      const res =
      await axios.delete(

        `https://quickart-jxc5.onrender.com/api/v1/products/${id}`
      );

      toast.success(
        res.data.message
      );

      fetchProducts();

    }

    catch(error){

      console.log(error);

      toast.error(
        "Delete Failed"
      );
    }
  };

  // FILTER PRODUCTS

  let filteredProducts =
    allProducts.filter((item) =>

      item.name
      .toLowerCase()
      .includes(
        searchText.toLowerCase()
      )
    );

  // SORT PRODUCTS

  if (sortPrice === "lowToHigh") {

    filteredProducts.sort(
      (a, b) =>
        a.price - b.price
    );
  }

  if (sortPrice === "highToLow") {

    filteredProducts.sort(
      (a, b) =>
        b.price - a.price
    );
  }

  return (

    <div className="adminProductsMainContainer">

      {/* TOP BAR */}

      <div className="adminProductsTopBar">

        <input
          className="adminProductsSearchInput"

          type="text"

          placeholder="Search Product..."

          value={searchText}

          onChange={(e) =>
            setSearchText(
              e.target.value
            )
          }
        />

        <select
          className="adminProductsSortSelect"

          value={sortPrice}

          onChange={(e) =>
            setSortPrice(
              e.target.value
            )
          }
        >

          <option value="">
            Sort by price
          </option>

          <option value="lowToHigh">
            Low To High
          </option>

          <option value="highToLow">
            High To Low
          </option>

        </select>

      </div>

      {/* PRODUCTS */}

      <div className="adminProductsGrid">

        {filteredProducts.map((item) => (

          <div
            className="adminSingleProductCard"

            key={item._id}
          >

            {/* IMAGE */}

            <img
              className="adminProductImage"

              src={
                item.images?.[0]?.url ||

                "https://via.placeholder.com/100"
              }

              alt=""
            />

            {/* INFO */}

            <div className="adminProductInfo">

              <h3 className="adminProductTitle">

                {item.name}

              </h3>

              <p className="adminProductBrand">

                {item.brand}

              </p>

            </div>

            {/* PRICE */}

            <div className="adminProductPrice">

              ₹{item.price}

            </div>

            {/* ACTIONS */}

            <div className="adminProductActions">

              <FaEdit

                className="adminEditIcon"

                onClick={() =>

                  navigate(

                    `/dashboard/products/${item._id}`
                  )
                }
              />

              <FaTrash

                className="adminDeleteIcon"

                onClick={() =>
                  handleDelete(item._id)
                }
              />

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default ProductsAdmin;