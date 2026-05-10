import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <div className="hero-left">
        <h1>
          Latest Electronics at
          <br />
          Best Prices
        </h1>

        <p>
          Discover cutting-edge technology with
          unbeatable deals.
        </p>

        <div className="hero-btns">
          <button onClick={() => navigate("/products")}>
            Shop Now
          </button>

          <button onClick={() => navigate("/products")}>
            View Deals
          </button>
        </div>
      </div>

      <div className="hero-right">
        <img
          src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab"
          alt=""
        />
      </div>
    </div>
  );
}

export default Home;