import React, { useState } from "react";
import axios from "axios";
import "./UserSignUp.css";
import Footer from "../Footer/Footer";

export default function EmployerSignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/user-signup", {
        username,
        email,
        password,
        description,
        imageUrl,
      })
      .then((res) => {
        console.log("success");
        setSuccess(true);
        setError("");
      })
      .catch((err) => {
        console.log("error", err);
        setSuccess(false);
        setError("Error: " + err.response.data.message);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="signup-form">
        <h3>User Sign Up</h3>

        {success && (
          <div className="alert alert-success" role="alert">
            Successfully signed up!
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="signup-field">
          <label>Full Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="John Doe"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="signup-field">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="name@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="signup-field">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="d-grid">
          <button type="submit">Sign Up</button>
        </div>

        <p className="forgot-password text-right">
          Already registered{" "}
          <a href="/UserLogin" className="signup-link">
            Login
          </a>
        </p>
      </form>
      <Footer />
    </div>
  );
}
