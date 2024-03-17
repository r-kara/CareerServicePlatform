import React from "react";
import { Link } from "react-router-dom";
import "./SignUpOption.css";

export default function SignUpOption() {
  return (
    <section className="SignUpSection">
      <div className="SignUpOption">
        <h1 className="SignUpTitle">Welcome !</h1>
        <p>Please select your status</p>
        <div className="SignUpBtn">
          <button className="SignUpBtn-item"><Link to="/UserSignUp">User</Link></button>
          <button className="SignUpBtn-item"><Link to="/EmployerSignUp">Employer</Link></button>
        </div>

      </div>
    </section>

  );
}
