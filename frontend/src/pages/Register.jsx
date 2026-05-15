import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
function Register() {

  const [formData, setFormData] = useState({

    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(

        "http://localhost:8000/api/v1/user/register",

        formData
      );
      console.log(res.data);
      toast.success(
        res.data.message
     );

    } catch (err) {

    console.log(err.response.data);

    toast.error(
      err.response.data.message
    );
}
  };

  return (

    <div className="auth-container">

      <form
        className="auth-box"
        onSubmit={handleSubmit}
      >

        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="First Name"
          name="firstName"
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Last Name"
          name="lastName"
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
        />

        <button type="submit">
          Register
        </button> 

        <p>
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

      </form>

    </div>
  );
}

export default Register;