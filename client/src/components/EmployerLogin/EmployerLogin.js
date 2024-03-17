import React, { useState } from "react";
import axios from "axios";
import "./EmployerLogin.css";
import Footer from "../Footer/Footer";

const EmployerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/employer-login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("cname", response.data.cname);
      localStorage.setItem("email", response.data.email);
      window.location.href = "/employers";
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="login-form">
        <h3>Employer Login</h3>

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-grid">
          <button type="submit">Login</button>
        </div>

        <p className="forgot-password text-right">
          Don't have an account?{" "}
          <a href="/EmployerSignUp" className="signup-link">
            Sign up
          </a>
        </p>
      </form>
      <Footer />
    </div>
  );
};

export default EmployerLogin;
