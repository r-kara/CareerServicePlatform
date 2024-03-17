import React from "react";
import { Container } from "react-bootstrap";
import "./HomeContent.css";
import Footer from "../Footer/Footer";

const HomeContent = () => {
  return (
    <div className="OuterContainer">
      <div className="home">
        <div className="joinus">
          <h3>Join Us</h3>
          <span> A future full of possibilities </span>
          <div>
            <a href="/jobs" className="btn">
              Find Jobs
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomeContent;
