import { BsSearch } from "react-icons/bs";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Search() {
  const [searchResult, setSearchResult] = useState([]);
  const [key, setKey] = useState("");

  useEffect(() => {
    const search = async () => {
      try {
        if (!key.trim()) {
          setSearchResult([]);
          return;
        }

        const res = await axios.get("/api/job-postings", {
          params: { key: key, limit: 5 },
        });
        setSearchResult(res.data.data);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    search();
  }, [key]);

  return (
    <form>
      <div className="search-wrapper">
        <div>
          <input
            type="text"
            className="form-control search-input-box"
            placeholder="   Searching..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <button className="search-btn">
            <BsSearch />
          </button>
        </div>
        {searchResult && searchResult.length > 0 && (
          <div className="search-result">
            {searchResult.map((jobPostings) => (
              <div className="result-item" key={jobPostings._id}>
                {/* <div className="job-posting-img">
                  <img src={jobPostings.imageUrl} alt="" />
                </div> */}

                <div className="job-posting-info">
                  <p className="company">
                    {jobPostings.company} : {jobPostings.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
