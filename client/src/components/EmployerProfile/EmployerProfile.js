import React, { useState, useEffect } from "react";
import axios from "axios";
import handleLogout from "../logout";
import "./EmployerProfile.css";
import useRequireAuth from "../useRequireAuth";
import EmployerDashboard from "./EmployerDashboard";
import Footer from "../Footer/Footer.js";

const EmployerProfile = () => {

    const [employerProfile, setEmployerProfile] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        axios
            .get("/api/employerprofile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => setEmployerProfile(response.data.data))
            .catch((error) => console.error(error));
    }, []);

    const handleSaveEmployerProfile = (event) => {
        event.preventDefault();

        axios
            .patch("/api/employerprofile", {
                username: employerProfile.username,
                email: employerProfile.email,
                password: employerProfile.password,
                description: employerProfile.description,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => console.error(error));
    };

    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("logo", file);
        axios
            .post("/api/logo", formData, {
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

    const isAuthenticated = useRequireAuth();

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div>
            <div className="profile-container">
                <h1 className="profile-header">Welcome to your Employer Profile !</h1>
                <div className="employer-profile">
                    <div className="info-pic">
                        <img id="employer-pic-display" src={`/uploads/${employerProfile.imageUrl}`} />
                        <p>Add your Logo!</p>
                        <input type="file" accept="image/*" id="employer-profile-pic" onChange={handleLogoUpload} />
                    </div>
                    <div className="info-section">
                        {<form className="user-info">
                            <h3>Company Information</h3>
                            <div className="info-item">
                                <label>Company Name:</label>
                                <label>{employerProfile.cname}</label>
                            </div>
                            <div className="info-item">
                                <label>Email address</label>
                                <input type="email" placeholder={employerProfile.email}
                                    onChange={(event) =>
                                        setEmployerProfile({ ...employerProfile, email: event.target.value })
                                    }
                                />
                            </div>
                            <div className="info-item">
                                <label>Password</label>
                                <input type="password" placeholder="Password"
                                    onChange={(event) =>
                                        setEmployerProfile({ ...employerProfile, password: event.target.value })
                                    }
                                />
                            </div>
                            <div className="info-item">
                                <label>Description</label>
                                <input type="text" placeholder={employerProfile.description}
                                    onChange={(event) =>
                                        setEmployerProfile({ ...employerProfile, description: event.target.value })
                                    }
                                />
                            </div>
                            <div className="update-info-btn">
                                <button type="button" onClick={handleSaveEmployerProfile}>Update Information</button>
                            </div>
                        </form>}

                        <div className="applications-section">
                            <h3>Create a Job Posting</h3>
                            <EmployerDashboard />
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
    )
};

export default EmployerProfile;