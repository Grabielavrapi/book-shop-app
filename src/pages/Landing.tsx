import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Banner from "../components/Body";
import EnhancedTable from "../components/EnhancedTable";
import { useNavigate } from "react-router-dom";
import { BookData } from '../components/tableUtils';

const Landing = () => {
  const [filterValue, setFilterValue] = useState<string>("");
  const [wishlist, setWishlist] = useState<BookData[]>([]);
  const [books, setBooks] = useState<BookData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:8080/books');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data.books);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBooks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="App">
      <Header filterValue={filterValue} setFilterValue={setFilterValue} wishlist={wishlist} setWishlist={setWishlist} />
      <Banner />
      <EnhancedTable filterValue={filterValue} wishlist={wishlist} setWishlist={setWishlist} rows={books} setRows={setBooks} />
      <Footer />
    </div>
  );
};

export default Landing;
