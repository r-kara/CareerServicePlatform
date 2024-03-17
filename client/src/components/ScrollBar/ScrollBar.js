import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import "./ScrollBar.css";

const ScrollBar = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [selectedJobPosting, setSelectedJobPosting] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);

  useEffect(() => {
    fetch("/api/all-job-postings")
      .then((res) => res.json())
      .then((data) => {
        setJobPostings(data.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleJobPostingClick = (jobPosting) => {
    setSelectedJobPosting(jobPosting);
    document.getElementById("confirm-apply").style.display = "none";
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setCoverLetter(file);
  };

  const handleApplicationSubmit = () => {
    const formData = new FormData();
    formData.append("coverLetter", coverLetter);
    formData.append("jobPostingId", selectedJobPosting._id);
    formData.append("company", selectedJobPosting.company);
    formData.append("title", selectedJobPosting.title);
    formData.append("companyImageUrl", selectedJobPosting.imageUrl);
    formData.append("description", selectedJobPosting.description);

    document.getElementById("confirm-apply").style.display = "block";

    fetch("/api/application", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCoverLetter(null);
        setSelectedJobPosting(null);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="ScrollBarConainer">
      <div className="ScrollBox">
        <div className="itemScrollBarContainer">
          {jobPostings.map((jobPosting) => (
            <div
              className="itemInScrollBar on_hover"
              key={jobPosting._id}
              onClick={() => handleJobPostingClick(jobPosting)}
            >
              {jobPosting.imageUrl && (
                <div className="companyIcon">
                  <img
                    src={`uploads/${jobPosting.imageUrl}`}
                    width="35px"
                    height="35px"
                    alt="Company Icon"
                  />
                </div>
              )}
              <div className="itemInScrollBarInfo">
                {jobPosting.company} : {jobPosting.title}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="SelectedItem">
        {selectedJobPosting && (
          <div className="infoBox">
            <div className="companyIcon"></div>
            <span className="JobTitleInfoBox">
              Position Title: {selectedJobPosting.title}
            </span>
            <hr
              className="LineBreak"
              style={{
                backgroundColor: "seagreen",
                height: 2.5,
              }}
            />
            <span className="JobTitleInfoBox">
              Company: {selectedJobPosting.company}
            </span>
            <hr
              className="LineBreak"
              style={{
                backgroundColor: "seagreen",
                height: 2.5,
              }}
            />
            <span className="JobTitleInfoBox">
              Job Description:
              <div className="Description">
                <br />
                <p>{selectedJobPosting.description}</p>
              </div>
            </span>
            <hr
              className="LineBreak"
              style={{
                backgroundColor: "seagreen",
                height: 2.5,
              }}
            />

            <div className="JobTitleInfoBox">
              <span className="UploadCoverLetter">
                <span>Your Cover Letter:</span>
                <input
                  className="CoverLetter"
                  type="file"
                  name="coverLetter"
                  id="coverLetter"
                  onChange={handleFileUpload}
                />
              </span>
            </div>
            <span className="ApplyButton">
              <button
                className="Applyingbutton"
                type="button"
                onClick={handleApplicationSubmit}
              >
                Apply
              </button>
            </span>
            <hr
              className="LineBreak"
              style={{
                backgroundColor: "seagreen",
                height: 2.5,
              }}
            />
          </div>
        )}
        <p id="confirm-apply">Applied Successfully</p>
      </div>
    </div>
  );
};

export default ScrollBar;
