import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginOption from "./LoginOption/LoginOption";

const useRequireAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/LoginOption");
      } else {
        const { exp } = JSON.parse(atob(token.split(".")[1]));
        if (Date.now() >= exp * 1000) {
          navigate("/LoginOption");
        } else {
          setIsAuthenticated(true);
        }
      }
      setIsLoading(false);
    };

    checkAuthentication();
  }, [navigate]);

  return isAuthenticated;
};

export default useRequireAuth;
