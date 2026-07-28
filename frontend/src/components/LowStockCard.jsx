import React, { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import { addProductStock } from "../services/ai"; 
const LowStockCard = ({
  product,
  onUpdated,
}) => {
  const THRESHOLD = 9;

  const recommended = Math.max(THRESHOLD + 1 - product.stock,1);

  const [quantity, setQuantity] = useState(recommended);
  const [loading, setLoading] = useState(false);

  const increase = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrease = () => {
    setQuantity((prev) =>
      prev > 1 ? prev - 1 : 1
    );
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await addProductStock(
        product._id,
        quantity
      );

      if (!res.success) {
        throw new Error(
          res.message || "Failed to update stock"
        );
      }

      toast.success("Stock updated");

      if (onUpdated) {
        onUpdated(product._id);
      }
    } catch (error) {
      toast.error(
        error.message || "Unable to update stock"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="low-stock-card">

      <div className="low-stock-header">

        <div>
          <h4>{product.name}</h4>

          <p>
            {product.brand} • {product.category}
          </p>
        </div>

        <span className="stock-badge">
          {product.stock} Left
        </span>

      </div>

      <div className="stock-info">

        <div>
          <span>Current Stock</span>
          <strong>{product.stock}</strong>
        </div>

        <div>
          <span>Recommended</span>
          <strong>+{recommended}</strong>
        </div>

        <div>
          <span>Expected</span>
          <strong>
            {product.stock + quantity}
          </strong>
        </div>

      </div>

      <div className="stock-quantity">

        <button
          type="button"
          onClick={decrease}
        >
          −
        </button>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) =>
            setQuantity(
              Math.max(
                1,
                Number(e.target.value) || 1
              )
            )
          }
        />

        <button
          type="button"
          onClick={increase}
        >
          +
        </button>

      </div>

      <button
        className="update-stock-btn"
        onClick={handleUpdate}
        disabled={loading}
      >
        <Plus size={18} />

        {loading
          ? "Updating..."
          : "Update Stock"}
      </button>

    </div>
  );
};

export default LowStockCard;