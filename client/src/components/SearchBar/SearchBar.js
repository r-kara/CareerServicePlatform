import React from "react";

import "./SearchBar.css";
import Search from "./Search.js";

export default function SearchBar() {
  return (
    <section>
      <div className="SearchBar">
        <header className="SearchBar-header">
          <Search />
        </header>
      </div>
    </section>
    
  );
}


