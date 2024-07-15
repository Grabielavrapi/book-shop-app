import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
         {/* <div className="row pt--40 pb--40">
          <div className="col-md-4 mb-sm--30">
            <div className="method-box">
              <div className="method-box__icon">
                <i className="fa fa-phone"></i>
              </div>
              <div className="method-box__content">
                <h4>+88 123 456 7899</h4>
                <p>Free support line!</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-sm--30">
            <div className="method-box">
              <div className="method-box__icon">
                <i className="fa fa-envelope"></i>
              </div>
              <div className="method-box__content">
                <h4>Support@roadthemes.com</h4>
                <p>Orders Support!</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="method-box">
              <div className="method-box__icon">
                <i className="fa fa-clock"></i>
              </div>
              <div className="method-box__content">
                <h4>Mon - Fri / 8:00 - 18:00</h4>
                <p>Working Days/Hours!</p>
              </div>
            </div>
          </div>
        </div> */}
      
        <div className="col-12 text-center footer-logo">
          <img
            src="./src/assets/img/Screenshot_2024-07-15_003600.png"
            className="logo"
            alt="logo"
          ></img>
        </div>
      </div>
      <p>&copy; 2024 Book Shop App | All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
