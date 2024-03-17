import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import handleLogout from "../logout";
import "./UserProfile.css";
import useRequireAuth from "../useRequireAuth";
import UserLogin from "../UserLogin/UserLogin";
import Footer from "../Footer/Footer.js";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("/api/userprofile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setUserProfile(response.data.data))
      .catch((error) => console.error(error));
  }, []);

  const handleSaveUserProfile = (event) => {
    event.preventDefault();

    axios
      .patch(
        "/api/userprofile",
        {
          username: userProfile.username,
          email: userProfile.email,
          password: userProfile.password,
          description: userProfile.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => console.error(error));
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("resume", file);
    axios
      .post("/api/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => console.error(error));
  };

  const handlePicUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("pic", file);
    axios
      .post("/api/pic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => console.error(error));
  };

  const [applications, setApplications] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDone(true);
        setApplications(response.data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const isAuthenticated = useRequireAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <div className="profile-container">
        <h1 className="profile-header">Welcome to your Profile !</h1>

        <div className="user-profile" key={userProfile._id}>
          <div className="info-pic">
            <img
              id="user-pic-display"
              src={`/uploads/${userProfile.imageUrl}`}
            />
            <p>Add your Picture!</p>
            <input
              type="file"
              accept="image/*"
              id="user-profile-pic"
              onChange={handlePicUpload}
            />
          </div>

          <div className="info-section">
            <form className="user-info">
              <h3>Personal Information</h3>

              <div className="info-item">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder={userProfile.username}
                  onChange={(event) => {
                    setUserProfile({
                      ...userProfile,
                      username: event.target.value,
                    });
                  }}
                />
              </div>

              <div className="info-item">
                <label>Email address</label>
                <input
                  type="email"
                  placeholder={userProfile.email}
                  onChange={(event) =>
                    setUserProfile({
                      ...userProfile,
                      email: event.target.value,
                    })
                  }
                />
              </div>

              <div className="info-item">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(event) =>
                    setUserProfile({
                      ...userProfile,
                      password: event.target.value,
                    })
                  }
                />
              </div>

              <div className="info-item">
                <label>Description</label>
                <input
                  type="text"
                  placeholder={userProfile.description}
                  onChange={(event) =>
                    setUserProfile({
                      ...userProfile,
                      description: event.target.value,
                    })
                  }
                />
              </div>

              <div className="update-info-btn">
                <button type="submit" onClick={handleSaveUserProfile}>
                  Update Information
                </button>
              </div>
            </form>

            <div className="info-item-btn">
              <label>Upload your resume!</label>
              <input type="file" onChange={handleResumeUpload} />
              <div className="current-resume-link">
                <label>
                  Current resume:
                  <span
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() =>
                      (window.location.href = `/uploads/${userProfile.resume}`)
                    }
                  >
                    {userProfile.resume}
                  </span>
                </label>
              </div>
            </div>

            <div>
              <h3>My Applications</h3>

              <Table striped bordered hover className="my-applications-section">
                <thead>
                  <tr className="applications-table-head">
                    <th>Company</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {done &&
                    applications.map((application) => (
                      <tr
                        key={application._id}
                        className={
                          application.status === "interview"
                            ? "table-success"
                            : application.status === "rejected"
                            ? "table-danger"
                            : ""
                        }
                        id="applications-table-body"
                      >
                        <td>
                          <img
                            src={`/uploads/${application.companyImageUrl}`}
                            alt=" "
                            width="50"
                            height="50"
                          />
                          {application.company}
                        </td>
                        <td>{application.title}</td>
                        <td>{application.companyDescription}</td>
                        <td>{application.status}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
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

export default UserProfile;
