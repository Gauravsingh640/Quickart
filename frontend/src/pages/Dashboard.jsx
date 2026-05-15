import {
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaClipboardList,
  FaThLarge
} from "react-icons/fa";
 
import { useNavigate, Outlet,  } from "react-router-dom"; 
function Dashboard() {
  const navigate=useNavigate();
  return (

    <div className="admin-dashboard">

      {/* SIDEBAR */}

      <div className="sidebar"> 

        <ul>
          <li className="active" onClick={() =>
              navigate("/dashboard/sales")
            }>
            <FaThLarge />
            Dashboard
          </li>

          <li onClick={() =>
              navigate("/dashboard/add-product")
            }>
            <FaBox />
            Add Product
          </li>

          <li onClick={() =>
              navigate("/dashboard/products")
            }>
            <FaShoppingCart />
            Products
          </li>

          <li onClick={() =>
              navigate("/dashboard/users")
            }>
            <FaUsers />
            Users
          </li>

          <li onClick={() =>
              navigate("/dashboard/orders")
            }>
            <FaClipboardList />
            Orders
          </li>

        </ul>

      </div>

      {/* CHILD PAGES */}

      <div className="main-content">

        <Outlet />

      </div>

      {/* MAIN CONTENT */}

      {/* <Sales/> */}

    </div>
  );
}

export default Dashboard;