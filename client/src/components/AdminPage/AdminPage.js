import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Dropdown } from "react-bootstrap";
import axios from "axios";
import "./AdminPage.css";

const AdminPage = () => {
  const [id, setid] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userrole, setUserRole] = useState('');
  const [permissions, setPermissions] = useState('');
  const [employers, setEmployers] = useState([]);
  const [users, setUsers] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [mailingList, setMailingList] = useState([]);

  useEffect(() => {
    axios
      .get("/api/all-mailing-list")
      .then((response) => {
        setMailingList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await axios.get("/api/all-applications");
      setApplications(res.data.data);
    };
    fetchApplications();
  }, []);

  useEffect(() => {
    const fetchJobPostings = async () => {
      const response = await axios.get("/api/all-job-postings");
      setJobPostings(response.data.data);
    };
    fetchJobPostings();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/all-users");
        setUsers(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const fetchEmployers = async () => {
      const response = await fetch('/api/all-employers');
      const data = await response.json();
      setEmployers(data.data);
    };
    fetchEmployers();
  }, []);

  const handleLogin = async () => {
    const response = await fetch('/api/admin-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      alert('Invalid credentials');
      return;
    }

    const data = await response.json();
    console.log(data);

    setid(data._id);
    setUsername(data.username);
    setPassword(data.password);
    setUserRole(data.userrole);
    setPermissions(data.permissions);
    setIsLoggedIn(true);
  };

  const handleUpdateProfile = async () => {
    const response = await fetch(`/api/admin-profile/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, userrole, permissions }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to update admin profile');
    }
  
    return response.json();
  };

  return (
    <div className="admin-container">
      <h1 className="admin-header">Admin Page</h1>
      {!isLoggedIn && (
        <>
        <div className="admin-log">
            <div className="admin-log-line">
              <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              </label>
            </div>
            <div className="admin-log-line">
              <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </label>
            </div>
            <button onClick={handleLogin}>Login</button>
        </div>
        </>
      )}
      {isLoggedIn && (
        <>
        <div className="admin-profile">
          <h1>Admin Information</h1>
          <div className="admin-profile-field">
            <label>
              Username:
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
          </div>
          <div className="admin-profile-field">
            <label>
              Password:
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
          </div>
          <div className="admin-profile-field">
          <label>
              User Role:
              <input type="text" value={userrole} onChange={(e) => setUserRole(e.target.value)} />
            </label>
          </div>
          <div className="admin-profile-field">
            <label>
              Permissions:
              <input type="text" value={permissions} onChange={(e) => setPermissions(e.target.value)} />
            </label>
          </div>
          <button onClick={handleUpdateProfile}>Update Profile</button> 
      </div>


      <div className="db-section">
      <h1>All Employers</h1>
      <table className="table-main">
        <thead>
          <tr className="table-sections">
            <th>Company Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>User Type</th>
            <th>Description</th>
            <th>Image URL</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {employers.map((employer) => (
            <tr key={employer._id}>
              <td><Form.Control type="text" value={employer.cname}/></td>
              <td><Form.Control type="text" value={employer.email}/></td>
              <td><Form.Control type="text" value={employer.password}/></td>
              <td><Form.Control type="text" value={employer.usertype}/></td>
              <td><Form.Control as="textarea" value={employer.description}/></td>
              <td><Form.Control type="text" value={employer.imageUrl}/></td>
              <td>
                  <Button>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <div className="table-update-btn">
            <button type="submit">
                Update Information
            </button>
        </div>
      </table>

      <h1>All Users</h1>
      <table className="table-main">
        <thead>
          <tr className="table-sections">
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
            <th>User Type</th>
            <th>Description</th>
            <th>Image URL</th>
            <th>Notification</th>
            <th>Resume</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {users.map((user) => (
            <tr key={user._id}>
              <td><Form.Control type="text" value={user.username}/></td>
              <td><Form.Control type="text" value={user.email}/></td>
              <td><Form.Control type="text" value={user.password}/></td>
              <td><Form.Control type="text" value={user.usertype}/></td>
              <td><Form.Control as="textarea" value={user.description}/></td>
              <td><Form.Control type="text" value={user.imageUrl}/></td>
              <td><Form.Control type="text" value={user.notification ? "Yes" : "No"}/></td>
              <td><Form.Control type="text" value={user.resume}/></td>
              <td>
                  <Button>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <div className="table-update-btn">
            <button type="submit">
                Update Information
            </button>
        </div>
    </table>

    <h1>Job Postings</h1>
    <table className="table-main">
      <thead>
        <tr className="table-sections">
          <th>Company</th>
          <th>Title</th>
          <th>Image URL</th>
          <th>Description</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody className="table-body">
        {jobPostings.map((jobPosting) => (
          <tr key={jobPosting._id}>
            <td><Form.Control type="text" value={jobPosting.company}/></td>
            <td><Form.Control type="text" value={jobPosting.title}/></td>
            <td><Form.Control type="text" value={jobPosting.imageUrl}/></td>
            <td><Form.Control as="textarea" value={jobPosting.description}/></td>
            <td>
              <Button>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
      <div className="table-update-btn">
            <button type="submit">
                Update Information
            </button>
      </div>
    </table>

    <h1>Applications</h1>
    <table className="table-main">
        <thead>
          <tr className="table-sections">
            <th>Status</th>
            <th>Job Posting ID</th>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Description</th>
            <th>Image URL</th>
            <th>Resume</th>
            <th>Cover Letter</th>
            <th>Company</th>
            <th>Title</th>
            <th>Company Image URL</th>
            <th>Company Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {applications.map((application) => (
            <tr key={application._id}>
              <td><Form.Control type="text" value={application.status}/></td>
              <td><Form.Control type="text" value={application.jobPostingId}/></td>
              <td><Form.Control type="text" value={application.userId}/></td>
              <td><Form.Control type="text" value={application.username}/></td>
              <td><Form.Control type="text" value={application.email}/></td>
              <td><Form.Control type="text" value={application.description}/></td>
              <td><Form.Control type="text" value={application.imageUrl}/></td>
              <td><Form.Control type="text" value={application.resume}/></td>
              <td><Form.Control type="text" value={application.coverLetter}/></td>
              <td><Form.Control type="text" value={application.company}/></td>
              <td><Form.Control type="text" value={application.title}/></td>
              <td><Form.Control type="text" value={application.companyImageUrl}/></td>
              <td><Form.Control as="textarea" value={application.companyDescription}/></td>
              <td>
                <Button>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <div className="table-update-btn">
            <button type="submit">
                Update Information
            </button>
        </div>
      </table>

      <h1>Mailing List</h1>
      <table className="table-main">
      <thead>
        <tr className="table-sections">
          <th>Email</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody className="table-body">
        {mailingList.map((entry) => (
          <tr key={entry._id}>
            <td><Form.Control type="text" value={entry.email}/></td>
            <td>
              <Button>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
      <div className="table-update-btn">
          <button type="submit">
              Update Information
          </button>
      </div>
    </table>
    </div>
        </>
        
      )}
    </div>
  );
};

export default AdminPage;