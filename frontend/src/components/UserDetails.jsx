import axios from "axios";
import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  AuthContext,
} from "../context/AuthContext";

import {
  toast,
} from "react-toastify";

function UserDetails() {

  const {
    user,
    setUser,
  } = useContext(AuthContext);

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState(

      user?.profilePic ||

      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    );

  const [formData, setFormData] =
    useState({
      firstName: "",
      lastName: "",
      email: "",
      phoneNo: "",
      address: "",
      city: "",
      zipCode: "",
    });

  // LOAD USER

  useEffect(() => {

    if (user) {

      setFormData({
        firstName:
          user.firstName || "",

        lastName:
          user.lastName || "",

        email:
          user.email || "",

        phoneNo:
          user.phoneNo || "",

        address:
          user.address || "",

        city:
          user.city || "",

        zipCode:
          user.zipCode || "",
      });

      setPreview(
        user.profilePic ||

        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
      );
    }

  }, [user]);

  // CHANGE

  const handleChange = (e) => {

    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  // IMAGE

  const handleImage = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(
      URL.createObjectURL(
        file
      )
    );
  };

  // UPDATE

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const form =
          new FormData();

        form.append(
          "firstName",
          formData.firstName
        );

        form.append(
          "lastName",
          formData.lastName
        );

        form.append(
          "phoneNo",
          formData.phoneNo
        );

        form.append(
          "address",
          formData.address
        );

        form.append(
          "city",
          formData.city
        );

        form.append(
          "zipCode",
          formData.zipCode
        );

        if (image) {

          form.append(
            "profilePic",
            image
          );
        }

        const res =
          await axios.put(

            "https://quickart-jxc5.onrender.com/api/v1/user/profile/update",

            form,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (
          res.data.success
        ) {

          setUser(
            res.data.user
          );

          localStorage.setItem(

            "user",

            JSON.stringify(
              res.data.user
            )
          );

          toast.success(
            "Profile Updated"
          );
        }

      }
      catch (error) {

        toast.error(
          error.response?.data
            ?.message
        );
      }
    };

  return (

    <div className="profile-content">

      {/* LEFT */}

      <div className="profile-left">

        <img
          src={preview}
          alt=""
          className="profile-image"
        />

        <label className="upload-btn">

          Change Picture

          <input
            type="file"
            hidden
            onChange={
              handleImage
            }
          />

        </label>

      </div>

      {/* RIGHT */}

      <form
        className="profile-form"
        onSubmit={
          handleSubmit
        }
      >

        <h2>
          Update Profile
        </h2>

        <div className="input-row">

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={
              formData.firstName
            }
            onChange={
              handleChange
            }
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={
              formData.lastName
            }
            onChange={
              handleChange
            }
          />

        </div>

        <input
          type="email"
          disabled
          value={
            formData.email
          }
        />

        <input
          type="text"
          name="phoneNo"
          placeholder="Phone"
          value={
            formData.phoneNo
          }
          onChange={
            handleChange
          }
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={
            formData.address
          }
          onChange={
            handleChange
          }
        />

        <div className="input-row">

          <input
            type="text"
            name="city"
            placeholder="City"
            value={
              formData.city
            }
            onChange={
              handleChange
            }
          />

          <input
            type="text"
            name="zipCode"
            placeholder="Zip Code"
            value={
              formData.zipCode
            }
            onChange={
              handleChange
            }
          />

        </div>

        <button
          type="submit"
        >
          Update Profile
        </button>

      </form>

    </div>
  );
}

export default UserDetails;