import React, { useState } from "react";
import axios from "axios";
import "./UserLogin.css";
import Footer from "../Footer/Footer";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await axios.post('/api/user-login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('usertype', response.data.usertype);
      window.location.href = '/UserProfile';

    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="login-form">
        <h3>User Login</h3>

        <div className="login-fields">
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
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-grid">
          <button type="submit">Login</button>
        </div>

        <p className="forgot-password text-right">
          Don't have an account?{" "}
          <a href="/UserSignUp" className="signup-link">
            Sign up
          </a>
        </p>
      </form>
      <Footer />
    </div>
  );
};

export default UserLogin;
