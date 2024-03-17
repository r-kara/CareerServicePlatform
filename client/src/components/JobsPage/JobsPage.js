import React from "react";
import "./JobsPage.css";
import SearchBar from "../SearchBar/SearchBar.js";
import NavigBar from "../NavigBar/NavigBar";
import Footer from "..//Footer/Footer.js";
import { Stack } from "react-bootstrap";

import ScrollBar from "../ScrollBar/ScrollBar";
import useRequireAuth from "../useRequireAuth.js";

const JobsPage = () => {
  const isAuthenticated = useRequireAuth();

  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="JobsPageContainer">
      <div className="JobsContent">
        <div className="searchBarContainer">
          <SearchBar />
        </div>
        <div className="ScrollBarContainer">
          <ScrollBar />
        </div>
      </div>
      <Footer />
      <div></div>
    </div>
  );
};

export default JobsPage;
