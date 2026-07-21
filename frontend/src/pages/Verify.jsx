import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";

function Verify() {
  const { token } = useParams();

  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      const res = await axios.get(
        `https://quickart-jxc5.onrender.com/api/v1/user/verify/${token}`,
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Verification Failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{message}</h2>
      </div>
    </div>
  );
}

export default Verify;
