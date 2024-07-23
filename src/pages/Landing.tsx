import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Banner from "../components/Body";
import EnhancedTable from "../components/EnhancedTable";
import { useNavigate } from "react-router-dom";
import { BookData } from '../components/tableUtils';

const Landing = () => {
  const [filterValue, setFilterValue] = useState<string>("");
  const [wishlist, setWishlist] = useState<BookData[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="App">
      <Header filterValue={filterValue} setFilterValue={setFilterValue} wishlist={wishlist} setWishlist={setWishlist} />
      <Banner />
      <EnhancedTable filterValue={filterValue} wishlist={wishlist} setWishlist={setWishlist} />
   
      <Footer />
    </div>
  );
};

export default Landing;
