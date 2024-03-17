import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavigBar from "./components/NavigBar/NavigBar";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import EmployerSignup from "./pages/EmployerSignup";
import UserSignup from "./pages/UserSignup";
import SignUpOption from "./pages/SignUpOption";
import EmployerLogin from "./pages/EmployerLogin";
import UserLogin from "./pages/UserLogin";
import LoginOption from "./pages/LoginOption";
import EmployerProfilePage from "./pages/EmployerProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import Admin from "./pages/Admin";

  
  export default App;

  function App() {
    return (
      <div className="App">
          <Router>
              <NavigBar />
              <Routes>
                  <Route exact path="/" element={<Home />}/>
                  <Route path='/jobs' element={<Jobs />}/>
                  <Route path='/employers' element={<EmployerProfilePage />}/>
                  <Route path='/login' element={<Login />}/>
                  <Route path='/signupoption' element={<SignUpOption />}/>
                  <Route path='/employersignup' element={<EmployerSignup />}/>
                  <Route path='/usersignup' element={<UserSignup />}/>
                  <Route path='/loginoption' element={<LoginOption />}/>
                  <Route path='/employerlogin' element={<EmployerLogin />}/>
                  <Route path='/userlogin' element={<UserLogin />}/>
                  <Route path='/employerprofile' element={<EmployerProfilePage />}/>
                  <Route path='/userprofile' element={<UserProfilePage />}/>
                  <Route path='/admin' element={<Admin />}/>
              </Routes>
          </Router>
 

      </div>
    );
  }
