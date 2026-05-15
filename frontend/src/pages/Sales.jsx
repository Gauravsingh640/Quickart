import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { toast }
from "react-toastify";


function Sales() {

  const [stats,
    setStats] =
    useState({

      totalUsers:0,

      totalProducts:0,

      totalOrders:0,

      totalSales:0,
    });

  // FETCH STATS

  const fetchStats =
  async () => {

    try {

      const res =
      await axios.get(

        "http://localhost:8000/api/v1/admin/stats"
      );

      setStats(
        res.data
      );

    }

    catch(error){

      console.log(error);

      toast.error(
        "Failed To Fetch Stats"
      );
    }
  };

  useEffect(() => {

    fetchStats();

  }, []);

  return (

    <div className="main-content">

      {/* CARDS */}

      <div className="cards1">

        {/* USERS */}

        <div className="card1">

          <h3>
            Total Users
          </h3>

          <p>
            {
              stats.totalUsers
            }
          </p>

        </div>

        {/* PRODUCTS */}

        <div className="card1">

          <h3>
            Total Products
          </h3>

          <p>
            {
              stats.totalProducts
            }
          </p>

        </div>

        {/* ORDERS */}

        <div className="card1">

          <h3>
            Total Orders
          </h3>

          <p>
            {
              stats.totalOrders
            }
          </p>

        </div>

        {/* SALES */}

        <div className="card1">

          <h3>
            Total Sales
          </h3>

          <p>

            ₹
            {
              stats.totalSales.toFixed(2)
            }

          </p>

        </div>

      </div>

      {/* GRAPH */}

      <div className="graph">

        <h2>
          Sales Overview
        </h2>

        <div className="graph-box">

          Graph Area

        </div>

      </div>

    </div>
  );
}

export default Sales;