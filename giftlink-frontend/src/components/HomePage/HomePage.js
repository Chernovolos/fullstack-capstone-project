import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-page d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="content text-center p-5 rounded">
              <h1 className="display-4 mb-4">Welcome to GiftLink</h1>

              <h2 className="h2 mb-4">Share Gifts and Joy!</h2>

              <p className="lead mb-5">
                "Sharing is the essence of community. It is through giving that
                we enrich and perpetuate both our lives and the lives of
                others."
              </p>

              <Link to="/app" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
