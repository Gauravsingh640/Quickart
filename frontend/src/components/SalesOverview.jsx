import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {

  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,

} from "recharts";

function SalesOverview() {

  const [salesData,
    setSalesData] =
    useState([]);

  useEffect(() => {

    fetchSales();

  }, []);

  const fetchSales =
  async () => {

    try {

      const res =
      await axios.get(

        "https://quickart-jxc5.onrender.com/api/v1/order/all-orders"
      );

      const orders =
      res.data.orders;

      // GROUP SALES BY DATE

      const groupedData = {};

      orders.forEach((order) => {

        if ( order.status !== "Pending"
 ) { return; }

        const rawDate =
        new Date(order.createdAt);
 
        // YYYY-MM-DD 
        const formattedDate =

        rawDate.toLocaleDateString(
        "en-CA"
        ); 


        if (
          groupedData[
            formattedDate
          ]
        ) {

          groupedData[
            formattedDate
          ] += order.totalPrice;
        }

        else {

          groupedData[
            formattedDate
          ] = order.totalPrice;
        }
      });

      // CONVERT TO ARRAY
      // SORT IN INCREASING DATE

      const formattedData =

      Object.keys(
        groupedData
      )

      .sort()

      .map((date) => ({

        date,

        sales:
        groupedData[date],
      }));

      setSalesData(
        formattedData
      );

    }

    catch(error){

      console.log(error);
    }
  };

  return (

    <div
      className="salesOverview"
    >

      <ResponsiveContainer
        width="100%"
        height={350}
      >
 
        <LineChart
        data={salesData}
        margin={{
            top:20,
            right:30,
            left:10,
            bottom:10,
        }}
        > 
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="date"
          />

          <YAxis />

          <Tooltip

            formatter={(value) =>

              `₹${value.toFixed(2)}`
            }

          />

          <Line

            type="monotone"

            dataKey="sales"

            stroke="#e32f92"

            strokeWidth={4}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}

export default SalesOverview;
