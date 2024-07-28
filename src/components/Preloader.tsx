// src/components/BookPreloader.tsx

import React from 'react';
import './Preloader.css';

const BookPreloader = () => {
  return (
    <div id="preloader">
          
      <div className="book">
        <div className="inner">
          <div className="left"></div>
          <div className="middle"></div>
          <div className="right"></div>
        </div>
        <ul>
          {[...Array(19)].map((_, i) => (
            <li key={i}></li>
          ))}
        </ul>
      </div>
    
    </div>
    
  );
};

export default BookPreloader;
