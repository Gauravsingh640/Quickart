// import { useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { toast }from "react-toastify";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { setUser } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post(
//         "https://quickart-jxc5.onrender.com/api/v1/user/login",

//         {
//           email,
//           password,
//         },

//         {
//           withCredentials: true,
//         },
//       );

//       // SAVE USER

//       setUser(res.data.user);

//       toast.success(res.data.message);

//       // REDIRECT

//       navigate("/products");
//     } catch (err) {
//       console.log(err);

//       toast.error(err.response?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <form className="auth-box" onSubmit={handleLogin}>
//         <h2>Login</h2>

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button type="submit">Login</button>

//         <p>
//           Don't have an account?
//           <Link to="/register"> Signup</Link>
//         </p>
//       </form> 
//     </div>
     
//   );
// }

// export default Login;


import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "https://quickart-jxc5.onrender.com/api/v1/user/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(res.data);

      // SAVE TOKEN

      sessionStorage.setItem(
        "token",
        res.data.token || res.data.accessToken
      );

      // SAVE USER

      sessionStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // CONTEXT UPDATE

      setUser(res.data.user);

      toast.success(res.data.message);

      // REDIRECT

      navigate("/products");

    }
    catch (err) {

      console.log(err);

      console.log(err.response?.data);

      toast.error(
        err.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (

    <div className="auth-container">

      <form
        className="auth-box"
        onSubmit={handleLogin}
      >

        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit" style={{ cursor: "pointer" }}>
          Login
        </button>

        <p>
          Don't have an account?
          <Link to="/register">
            {" "}Signup
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Login;