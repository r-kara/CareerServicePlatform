import React, { useState, useEffect } from "react";
import "./NavigBar.css";
import { NavLink } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { FaBars, FaBell } from "react-icons/fa";
import axios from "axios";
import handleLogout from "../logout";

const NavigBar = () => {
  const userType = localStorage.getItem("usertype");
  const companyName = localStorage.getItem("cname");
  console.log(userType);

  const [notification, setNotification] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getNotificationStatus = async () => {
      try {
        const response = await axios.get("/api/notification", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotification(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getNotificationStatus();
  }, []);

  const handleNotificationClick = async () => {
    try {
      await axios.post("/api/removenotification", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotification(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (userType === "user") {
      return (
      <Navbar className="navbar">
        <Container className="container">
          <div className="logo">
            <Navbar.Brand href="/">Hiremap</Navbar.Brand>
          </div>
          <div className="nav-elements">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/jobs">Jobs</Link>
                  </li>
  
                  <li>
                    <NavDropdown
                      title={
                        <span>
                          <i className="fas fa-user"></i>
                        </span>
                      }
                      id="basic-nav-dropdown"
                    >
                      <NavDropdown.Item>
                        {" "}
                        <Link to="/userprofile">User</Link>
                      </NavDropdown.Item>
                      <NavDropdown.Item>
                        {" "}
                        <Link to="/" onClick={handleLogout}>Logout</Link>
                      </NavDropdown.Item>
                    </NavDropdown>
                  </li>
                  <li>
                  <Link to="/userprofile">
                    <FaBell
                      className={
                        notification
                          ? "notification-bell notification-bell-red"
                          : "notification-bell"
                      }
                      onClick={handleNotificationClick}
                    />
                  </Link>
                </li>
                </ul>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    );
  } else if(userType === "employer" || companyName){
    return (
      <Navbar className="navbar">
        <Container className="container">
          <div className="logo">
            <Navbar.Brand href="/">Hiremap</Navbar.Brand>
          </div>
          <div className="nav-elements">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/jobs">Jobs</Link>
                  </li>
  
                  <li>
                    <NavDropdown
                      title={
                        <span>
                          <i className="fas fa-user"></i>
                        </span>
                      }
                      id="basic-nav-dropdown"
                    >
                      <NavDropdown.Item>
                        {" "}
                        <Link to="/employerprofile">Employer</Link>
                      </NavDropdown.Item>
                      <NavDropdown.Item>
                        {" "}
                        <Link to="/" onClick={handleLogout}>Logout</Link>
                      </NavDropdown.Item>
                    </NavDropdown>
                  </li>
                </ul>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    );
  } else{
    return (
      <Navbar className="navbar">
        <Container className="container">
          <div className="logo">
            <Navbar.Brand href="/">Hiremap</Navbar.Brand>
          </div>
          <div className="nav-elements">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/jobs">Jobs</Link>
                  </li>
  
                  <li>
                    <NavDropdown
                      title={
                        <span>
                          <i className="fas fa-user"></i>
                        </span>
                      }
                      id="basic-nav-dropdown"
                    >
                      <NavDropdown.Item>
                        {" "}
                        <Link to="/employerprofile">Employer</Link>
                      </NavDropdown.Item>
                      <NavDropdown.Item>
                        {" "}
                        <Link to="/userprofile">User</Link>
                      </NavDropdown.Item>
                    </NavDropdown>
                  </li>
                </ul>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    );
  }

};

export default NavigBar;

/*
  <li><NavDropdown 
      title={<span><i className='fas fa-user'></i></span>} id="basic-nav-dropdown">
      <NavDropdown.Item> <Link to="/LoginOption">Login</Link></NavDropdown.Item>
      <NavDropdown.Item> <Link to="/SignUpOption">Sign Up</Link></NavDropdown.Item>
    </NavDropdown></li>
  */