// Profile.jsx

import {
  FaArrowLeft,
} from "react-icons/fa";

import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

function Profile() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  return (

    <div className="profile-page">

      <div className="profile-container">

        {/* TOP */}

        <div className="profile-top">

          <button
            className="back-btn"
            onClick={() =>
              navigate("/")
            }
          >
            <FaArrowLeft />
          </button>

          <h1>
            My Profile
          </h1>

        </div>

        {/* TABS */}

        <div className="profile-tabs">

          {/* PROFILE */}

          <button

            className={

              location.pathname ===
              "/profile/userDetails"

                ? "active-tab"

                : ""
            }

            onClick={() =>
              navigate(
                "/profile/userDetails"
              )
            }
          >
            Profile
          </button>

          {/* ORDERS */}

          <button

            className={

              location.pathname ===
              "/profile/orders"

                ? "active-tab"

                : ""
            }

            onClick={() =>
              navigate(
                "/profile/orders"
              )
            }
          >
            Orders
          </button>

        </div>

        {/* CHILD ROUTES */}

        <Outlet />

      </div>

    </div>
  );
}

export default Profile;