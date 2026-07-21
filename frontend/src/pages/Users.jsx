import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { 
  FaEye,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

import { toast }
from "react-toastify";


function Users() {

  const navigate =
    useNavigate();

  const [users,
    setUsers] =
    useState([]);

  const [searchText,
    setSearchText] =
    useState("");

  // FETCH USERS

  const fetchUsers =
  async () => {

    try {

      const res =
      await axios.get(

        "http://localhost:8000/api/v1/user/all-users"
      );

      setUsers(
        res.data.users
      );

    }

    catch(error){

      console.log(error);

      toast.error(
        "Failed To Fetch Users"
      );
    }
  };

  useEffect(() => {

    fetchUsers();

  }, []);

  // UPDATE ROLE

  const handleRoleChange =
  async (id, role) => {

    try {

        const res =
        await axios.put(

        `http://localhost:8000/api/v1/user/update-role/${id}`,

        { role }
        );

        toast.success(
        res.data.message
        );

        fetchUsers();

    }

    catch(error){

        toast.error(

        error.response?.data
        ?.message
        );
    }
    };

  // FILTER USERS

  const filteredUsers =
  users.filter((item) =>

    `${item.firstName}
     ${item.lastName}`

    .toLowerCase()

    .includes(
      searchText.toLowerCase()
    )
  );

  return (

    <div className="adminUsersContainer">

      {/* HEADING */}

      <h1>
        User Management
      </h1>

      <br />

      {/* SEARCH */}

      <div className="adminUsersTopBar">

        <input

          className="adminUsersSearch"

          type="text"

          placeholder="Search User..."

          value={searchText}

          onChange={(e) =>
            setSearchText(
              e.target.value
            )
          }
        />

      </div>

      {/* USERS */}

      <div className="adminUsersGrid">

        {

          filteredUsers.map((item) => (

            <div
              className="adminUserCard"

              key={item._id}
            >

              {/* IMAGE */}

              <img

                className="adminUserImage"

                src={
                  item.profilePic ||

                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }

                alt=""
              />

              {/* NAME */}

              <h3>

                {item.firstName}
                {" "}
                {item.lastName}

              </h3>

              {/* EMAIL */}

              <p>
                {item.email}
              </p>

              {/* ROLE */}

              <div className="adminRoleContainer">

                <label>

                  <input
                    type="radio"

                    name={item._id}

                    checked={
                      item.role ===
                      "user"
                    }

                    disabled={
                      item.role ===
                      "superAdmin"
                    }

                    onChange={() =>

                      handleRoleChange(

                        item._id,

                        "user"
                      )
                    }
                  />

                  User

                </label>

                <label>

                  <input
                    type="radio"

                    name={item._id}

                    checked={
                      item.role ===
                      "admin"
                    }

                    disabled={
                      item.role ===
                      "superAdmin"
                    }

                    onChange={() =>

                      handleRoleChange(

                        item._id,

                        "admin"
                      )
                    }
                  />

                  Admin

                </label>

              </div>

              {/* SUPER ADMIN */}

              {

                item.role ===
                "superAdmin"

                &&

                <h4 className="superAdminText">

                  Super Admin

                </h4>
              }

              {/* BUTTONS */}

              <div className="adminUserButtons">

                <button

                  className="viewOrdersBtn"

                  onClick={() =>

                    navigate(

                      `/dashboard/users/${item._id}/orders`
                    )
                  }
                >

                  <FaEye />

                    {" "}
                    View Orders

                </button>

              </div>

            </div>
          ))
        }

      </div>

    </div>
  );
}

export default Users;