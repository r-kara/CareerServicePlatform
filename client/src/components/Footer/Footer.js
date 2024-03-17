import React, { useState } from "react";
import axios from "axios"; // assuming you have axios installed

import "./Footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/api/mailing-lists", { email });
      alert("Thanks for subscribing!");
    } catch (error) {
      console.error(error);
      alert("Failed to subscribe, please try again later.");
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div className="footer-top-container">
      <div className="Home-Job-Employer-container">
        <a href="foo">Home</a>
        <a href="foo">Jobs</a>
        <a href="foo">Employers</a>
      </div>
      <div className="About-Terms-Container a-About-Terms-Container">
        <a href="foo">About</a>
        <a href="foo">Terms &amp; Conditions</a>
        <a href="foo">Contact</a>
      </div>
      <div className="subscribe-container">
        <form onSubmit={handleSubmit}>
          <legend>Subscribe to the mailing list:</legend>
          <input
            type="text"
            className="subscribe-input"
            value={email}
            onChange={handleEmailChange}
          ></input>
          <button className="subscribe-btn" type="submit">Subscribe</button>
        </form>
      </div>
    </div>
  );
}
