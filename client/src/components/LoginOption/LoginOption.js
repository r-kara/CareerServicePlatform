import React from "react";
import { Link } from "react-router-dom";
import "./LoginOption.css";

// export default function LoginOption() {
//   return (
//     <section className="loginSection">
//       <div className="LoginOption">
//         <h1 className="LoginOptTitle">You need to login !</h1>
//         <p>Please select your status</p>
//         <div className="loginBtn">
//         <button className="loginBtn-item"><Link to ="/EmployerLogin">Employer</Link></button>
//         <button className="loginBtn-item"><Link to ="/UserLogin">Student</Link></button>
//         </div>
//       </div>
//     </section>

//   );
// }

const LoginOption = () => {
  return (
    <section className="loginSection">
      <div className="LoginOption">
        <h1 className="LoginOptTitle">You need to login !</h1>
        <p>Please select your status</p>
        <div className="loginBtn">
          <button className="loginBtn-item"><Link to="/UserLogin">User</Link></button>
          <button className="loginBtn-item"><Link to="/EmployerLogin">Employer</Link></button>
        </div>
      </div>
    </section>

  );
}
export default LoginOption;