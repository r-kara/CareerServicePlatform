import React, { useState, useEffect } from "react";
import { Container, Table, Button, Form, Dropdown } from "react-bootstrap";
import axios from "axios";
import "./EmployerDashboard.css";
import useRequireAuth from "../useRequireAuth";
import Footer from "../Footer/Footer.js";

const EmployerDashboard = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(false);

  const [selectedJobPosting, setSelectedJobPosting] = useState(null);
  const [applications, setApplications] = useState([]);

  const company = localStorage.getItem("cname");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("/api/job-posting", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setJobPostings(response.data.data))
      .catch((error) => console.error(error));
  }, []);

  const handleCreateJobPosting = (event) => {
    event.preventDefault();
    const newJobPosting = { company, title, description };
    axios
      .post("/api/job-postings", newJobPosting)
      .then((response) => setJobPostings([...jobPostings, response.data]))
      .catch((error) => console.error(error));
    setTitle("");
    setDescription("");
  };

  const handleDeleteJobPosting = (id) => {
    axios
      .delete(`/api/job-postings/${id}`)
      .then(() =>
        setJobPostings(jobPostings.filter((posting) => posting._id !== id))
      )
      .catch((error) => console.error(error));
  };

  const handleSaveJobPostings = () => {
    jobPostings.forEach((posting) => {
      axios
        .patch(`/api/job-postings/${posting._id}`, posting)
        .catch((error) => console.error(error));
    });
    setEditing({});
  };

  const handleJobPostingSelect = (event) => {
    const jobPostingId = event.target.value;

    axios
      .get(`/api/application/${jobPostingId}`)
      .then((response) => {
        setApplications(response.data);
        setSelectedJobPosting(jobPostingId);
      })
      .catch((error) => console.error(error));
  };

  const handleDownload = (fileUrl) => {
    window.open(`/uploads/${fileUrl}`);
  };

  const isAuthenticated = useRequireAuth();

  if (!isAuthenticated) {
    return null;
  }

  const handleReject = (applicationId) => {
    axios
      .patch(`/api/application/${applicationId}`, { status: "rejected" })
      .then(() => {
        const updatedApplications = applications.data.map((application) =>
          application._id === applicationId
            ? { ...application, status: "rejected" }
            : application
        );
        setApplications({ data: updatedApplications });
        setTimeout(() => {
          const updatedApplications = applications.data.filter(
            (application) => application._id !== applicationId
          );
          setApplications({ data: updatedApplications });
        }, 1000);
      })
      .catch((error) => console.error(error));
  };

  const handleInterview = (applicationId) => {
    axios
      .patch(`/api/application/${applicationId}`, { status: "interview" })
      .then(() => {
        const updatedApplications = applications.data.map((application) =>
          application._id === applicationId
            ? { ...application, status: "interview" }
            : application
        );
        setApplications({ data: updatedApplications });
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <div className="emp-dashboard">
        <Form onSubmit={handleCreateJobPosting} className="add-posting-form">
          <Form.Group controlId="formTitle" className="add-posting-section">
            <Form.Label>Job Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter job title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Form.Group>
          <Form.Group
            controlId="formDescription"
            className="add-posting-section"
          >
            <Form.Label>Job Description</Form.Label>
            <div></div>
            <Form.Control
              as="textarea"
              placeholder="Enter job description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="add-posting-btn">
            Create Job Posting
          </Button>
        </Form>
        <h3>My Job Postings</h3>
        <Table striped bordered hover className="postings-table">
          <thead>
            <tr className="postings-table-head">
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobPostings.map((posting) => (
              <tr key={posting._id} className="postings-table-body">
                <td>
                  <Form.Control
                    type="text"
                    value={posting.title}
                    onChange={(event) => {
                      const updatedPostings = jobPostings.map((p) =>
                        p._id === posting._id
                          ? { ...p, title: event.target.value }
                          : p
                      );
                      setJobPostings(updatedPostings);
                    }}
                  />
                </td>
                <td>
                  <Form.Control
                    as="textarea"
                    value={posting.description}
                    onChange={(event) => {
                      const updatedPostings = jobPostings.map((p) =>
                        p._id === posting._id
                          ? { ...p, description: event.target.value }
                          : p
                      );
                      setJobPostings(updatedPostings);
                    }}
                  />
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteJobPosting(posting._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="4" className="text-center">
                <Button
                  variant="primary"
                  onClick={handleSaveJobPostings}
                  className="postings-table-btn"
                >
                  Save Modifications
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
        <Form>
          <Form.Group controlId="jobPostingSelect">
            <h3 id="my-applicatants-title">My Applicants</h3>
            <Form.Label>Select a job posting: </Form.Label>
            <Form.Control
              className="form-control-dropdown"
              as="select"
              onChange={handleJobPostingSelect}
            >
              <option value="">Choose...</option>
              {jobPostings.map((jobPosting) => (
                <option key={jobPosting._id} value={jobPosting._id}>
                  {jobPosting.title}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
        {selectedJobPosting && (
          <Table striped bordered hover className="applicants-table-display">
            <thead>
              <tr className="applicants-table-head">
                <th>Applicant</th>
                <th>Email</th>
                <th>Cover Letter</th>
                <th>Resume</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.data.map((application) => (
                <tr
                  key={application._id}
                  className={
                    application.status === "interview"
                      ? "table-success"
                      : application.status === "rejected"
                      ? "table-danger"
                      : ""
                  }
                  id="applicants-table-body"
                >
                  <td>
                    <img
                      src={`/uploads/${application.imageUrl}`}
                      alt=" "
                      width="50"
                      height="50"
                    />
                    {application.username}
                  </td>
                  <td>{application.email}</td>
                  <td>
                    {application.coverLetter && (
                      <Button
                        variant="secondary"
                        onClick={() => handleDownload(application.coverLetter)}
                      >
                        Download
                      </Button>
                    )}
                  </td>
                  <td>
                    {application.resume && (
                      <Button
                        variant="secondary"
                        onClick={() => handleDownload(application.resume)}
                      >
                        Download
                      </Button>
                    )}
                  </td>
                  <td>{application.description}</td>
                  <td>
                    {application.status === "new" && (
                      <>
                        <Button
                          variant="success"
                          onClick={() => handleInterview(application._id)}
                        >
                          Interview
                        </Button>{" "}
                        <Button
                          variant="danger"
                          onClick={() => handleReject(application._id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
