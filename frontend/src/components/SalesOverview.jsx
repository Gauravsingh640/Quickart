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

import "./SalesOverview.css";

function SalesOverview() {

  const [allOrders, setAllOrders] = useState([]);

  const [salesData, setSalesData] = useState([]);

  // CURRENT MONTH
  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`
  );

  // FETCH ORDERS

  const fetchSales = async () => {

    try {

      const res = await axios.get(
        "https://quickart-jxc5.onrender.com/api/v1/order/all-orders"
      );

      setAllOrders(res.data.orders || []);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchSales();

  }, []);

  // CREATE GRAPH WHEN MONTH / ORDERS CHANGE

  useEffect(() => {

    if (!selectedMonth) return;

    const [year, month] =
      selectedMonth.split("-").map(Number);

    // NUMBER OF DAYS IN SELECTED MONTH

    const daysInMonth =
      new Date(year, month, 0).getDate();

    const groupedData = {};

    // INIT ALL DAYS WITH 0

    for (let day = 1; day <= daysInMonth; day++) {

      groupedData[day] = 0;

    }

    // ADD SALES

    allOrders.forEach((order) => {

      // DON'T COUNT CANCELLED ORDERS

      if (order.status === "Cancelled") {
        return;
      }

      const orderDate =
        new Date(order.createdAt);

      const orderYear =
        orderDate.getFullYear();

      const orderMonth =
        orderDate.getMonth() + 1;

      // ONLY SELECTED MONTH

      if (
        orderYear === year &&
        orderMonth === month
      ) {

        const day =
          orderDate.getDate();

        groupedData[day] +=
          Number(order.totalPrice) || 0;

      }

    });

    // CONVERT INTO ARRAY

    const formattedData =
      Object.keys(groupedData).map((day) => ({

        date: Number(day),

        sales: groupedData[day],

      }));

    setSalesData(formattedData);

  }, [allOrders, selectedMonth]);

  // FORMAT MONTH NAME

  const monthName = new Date(
    `${selectedMonth}-01T00:00:00`
  ).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (

    <div className="salesOverview">

      {/* TOP */}

      <div className="salesOverviewTop">

        <h2>
          Sales Overview
        </h2>

        <div className="monthSelector">

          <span>
            Month:
          </span>

          <input
            type="month"
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(e.target.value)
            }
          />

        </div>

      </div>

      {/* SELECTED MONTH */}

      <p className="selectedMonthText">
        {monthName}
      </p>

      {/* GRAPH */}

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <LineChart
          data={salesData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="date"
            tickFormatter={(day) =>
              `${day}`
            }
          />

          <YAxis
            tickFormatter={(value) =>
              `₹${value.toLocaleString("en-IN")}`
            }
          />

          <Tooltip
            labelFormatter={(day) =>
              `${day} ${monthName}`
            }
            formatter={(value) => [
              `₹${Number(value).toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 2,
                }
              )}`,
              "Sales",
            ]}
          />

          <Line
            type="monotone"
            dataKey="sales"
            stroke="#e32f92"
            strokeWidth={4}
            dot={{
              r: 3,
            }}
            activeDot={{
              r: 6,
            }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}

export default SalesOverview;