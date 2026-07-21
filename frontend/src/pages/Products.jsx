// import { useState } from "react";
// import productsData from "../data/products";
// import ProductCard from "../components/ProductCard";

// function Products() {
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("all");
//   const [brand, setBrand] = useState("all");
//   const [price, setPrice] = useState(200000);
//   const [sort, setSort] = useState("");
//   let filteredProducts = productsData.filter((item) => {
//     return (
//       item.title.toLowerCase().includes(search.toLowerCase()) &&
//       (category === "all" || item.category === category) &&
//       (brand === "all" || item.brand === brand) &&
//       item.price <= price
//     );
//   });

//   // SORTING

//   if (sort === "lowToHigh") {
//     filteredProducts.sort((a, b) => a.price - b.price);
//   }

//   if (sort === "highToLow") {
//     filteredProducts.sort((a, b) => b.price - a.price);
//   }

//   const resetFilters = () => {
//     setSearch("");
//     setCategory("all");
//     setBrand("all");
//     setPrice(200000);
//     setSort("");
//   };

//   return (
//     <div className="products-page">
//       {/* SIDEBAR */}

//       <div className="sidebar">
//         <h2>Filters</h2>

//         <input
//           type="text"
//           placeholder="Search Product..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         {/* CATEGORY */}

//         <h3>Category</h3>

//         <label>
//           <input
//             type="radio"
//             checked={category === "all"}
//             onChange={() => setCategory("all")}
//           />
//           All
//         </label>

//         <label>
//           <input
//             type="radio"
//             checked={category === "mobile"}
//             onChange={() => setCategory("mobile")}
//           />
//           Mobile
//         </label>

//         <label>
//           <input
//             type="radio"
//             checked={category === "headphone"}
//             onChange={() => setCategory("headphone")}
//           />
//           Headphone
//         </label>

//         <label>
//           <input
//             type="radio"
//             checked={category === "laptop"}
//             onChange={() => setCategory("laptop")}
//           />
//           Laptop
//         </label>

//         {/* BRAND */}

//         <h3>Brand</h3>

//         <select value={brand} onChange={(e) => setBrand(e.target.value)}>
//           <option value="all">All</option>
//           <option value="Apple">Apple</option>
//           <option value="Samsung">Samsung</option>
//           <option value="Dell">Dell</option>
//           <option value="HP">HP</option>
//           <option value="Sony">Sony</option>
//           <option value="Boat">Boat</option>
//           <option value="OnePlus">OnePlus</option>
//         </select>

//         {/* PRICE */}

//         <h3>Price: ₹ {price}</h3>

//         <input
//           type="range"
//           min="1000"
//           max="200000"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//         />

//         <button className="reset-btn" onClick={resetFilters}>
//           Reset Filters
//         </button>
//       </div>

//       {/* RIGHT SIDE */}

//       <div className="products-content">
//         <div className="top-bar">
//           <h2>Products ({filteredProducts.length})</h2>

//           <select value={sort} onChange={(e) => setSort(e.target.value)}>
//             <option value="">Sort By</option>

//             <option value="lowToHigh">Price Low To High</option>

//             <option value="highToLow">Price High To Low</option>
//           </select>
//         </div>

//         <div className="products-grid">
//           {filteredProducts.map((item) => (
//             <ProductCard key={item.id} item={item} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Products;

import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";
function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [price, setPrice] = useState(200000);
  const [sort, setSort] = useState("");

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/products");
      setProducts(res.data.products);
    } catch (error) {
      console.log(error);
      toast.error("Failed To Fetch Products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // FILTER PRODUCTS

  let filteredProducts = products.filter((item) => {
    return (
      item.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) &&
      (category === "all" || item.category?.toLowerCase() === category) &&
      (brand === "all" || item.brand === brand) &&
      item.price <= price
    );
  });

  // SORTING

  if (sort === "lowToHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "highToLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // RESET
  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setBrand("all");
    setPrice(200000);
    setSort("");
  };

  return (
    <div className="products-page">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Filters</h2>
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search Product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* CATEGORY */}

        <h3>Category</h3>
        <label>
          <input
            type="radio"
            checked={category === "all"}
            onChange={() => setCategory("all")}
          />
          All
        </label>
        <label>
          <input
            type="radio"
            checked={category === "mobile"}
            onChange={() => setCategory("mobile")}
          />
          Mobile
        </label>
        <label>
          <input
            type="radio"
            checked={category === "headphone"}
            onChange={() => setCategory("headphone")}
          />
          Headphone
        </label>
        <label>
          <input
            type="radio"
            checked={category === "laptop"}
            onChange={() => setCategory("laptop")}
          />
          Laptop
        </label>

        {/* BRAND */}

        <h3>Brand</h3>
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="all">All</option>
          <option value="Apple">Apple</option>
          <option value="Samsung">Samsung</option>
          <option value="Dell">Dell</option>
          <option value="HP">HP</option>
          <option value="Sony">Sony</option>
          <option value="Boat">Boat</option>
          <option value="OnePlus">OnePlus</option>
        </select>
        {/* PRICE */}

        <h3>Price: ₹{price}</h3>
        <input
          type="range"
          min="1000"
          max="200000"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* RESET */}
        <button className="reset-btn" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>

      {/* RIGHT SIDE */}

      <div className="products-content">
        {/* TOP BAR */}
        <div className="top-bar">
          <h2>Products ({filteredProducts.length})</h2>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort By</option>
            <option value="lowToHigh">Price Low To High</option>
            <option value="highToLow">Price High To Low</option>
          </select>
        </div>

        {/* PRODUCTS */}
        <div className="products-grid">
          {filteredProducts.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default Products;
