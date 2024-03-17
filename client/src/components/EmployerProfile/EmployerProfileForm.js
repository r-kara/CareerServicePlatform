import React, { useState } from "react";
import handleLogout from "../logout";
import "./EmployerProfile.css";
import Footer from "../Footer/Footer.js";

const EmployerProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pic, setPic] = useState();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [description, setDescription] = useState();
  const [imageUrl, setImageUrl] = useState();

  return (
    <div>
      <div className="profile-container">
        <h1 className="profile-header">Welcome to your Employer Profile !</h1>
        <div className="employer-profile">
          <div className="info-pic">
            <img id="employer-pic-display" />
            <input
              type="file"
              accept="image/*"
              id="employer-profile-pic"
              hidden
            />
            <label for="employer-profile-pic" className="upload-pic-btn">
              Upload Logo!
            </label>
          </div>
          <div className="info-section">
            <form className="user-info">
              <h3>Company Information</h3>

              <div className="info-item">
                <label>Company Name</label>
                <input type="text" placeholder="John Doe" />
              </div>

              <div className="info-item">
                <label>Email address</label>
                <input type="email" placeholder="name@example.com" />
              </div>

              <div className="info-item">
                <label>Password</label>
                <input type="password" placeholder="Password" />
              </div>

              <div className="info-item">
                <label>Description</label>
                <input type="text" placeholder="ex: IT" />
              </div>

              <div className="update-info-btn">
                <button type="submit">Update Information</button>
              </div>
            </form>

            <div className="applications-section">
              <h3>My Job Postings (What was in employers page)</h3>
              <p>List of jobs + buttons to add/delete/modify</p>
            </div>
            <div className="logout-btn">
              <button className={StyleSheet.white_btn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployerProfile;
