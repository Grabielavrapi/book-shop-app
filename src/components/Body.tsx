import React from "react";
import "./Body.css";

const Body = () => {
  return (
    <div className="banner">
      <div className="banner-content">
        <span className="welcome-text">
          <img
            className="vec-icon"
            src="src/assets/img/sub-title-vec.svg"
            alt="sub-title-vec"
          />{" "}
          Welcome To Book Shop App{" "}
          <img
            className="vec-icon"
            src="src/assets/img/sub-title-vec.svg"
            alt="sub-title-vec"
          />
        </span>
        <h1 className="banner-title">Find Your Best Books & Knowledge.</h1>
        <p className="banner-description">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </p>
        <a className="primary-btn2" href="/about">
          <i className="bi bi-arrow-up-right-circle"></i> See More
        </a>
      </div>
    </div>
  );
};

export default Body;
