import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Entry() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signup");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response);
        if (response.status === 200) {
          navigate("/dashboard");
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          localStorage.removeItem("token");

          navigate("/signup");
        }
      }
    };
    verifyToken();
  }, []);

  return <div>Loading...</div>;
}
