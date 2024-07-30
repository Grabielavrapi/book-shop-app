import React, { useState, useMemo } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { NavLink, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Modal from "@mui/material/Modal";
import { useSelector, useDispatch } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { RootState } from "../store/store";
import { addToCart, removeFromCart } from "../store/cartSlice";
import { BookData } from "./tableUtils";
import "./Header.css";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

interface HeaderProps {
  filterValue: string;
  setFilterValue: (value: string) => void;
  wishlist: BookData[];
  setWishlist: React.Dispatch<React.SetStateAction<BookData[]>>;
}

function ResponsiveAppBar({
  filterValue,
  setFilterValue,
  wishlist,
  setWishlist,
}: HeaderProps) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleRemoveFromCart = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDarkMode(event.target.checked);
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.quantity * 19.99,
    0
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  const handleRemoveFromWishlist = (id: number) => {
    setWishlist((prevWishlist) => prevWishlist.filter((book) => book.id !== id));
  };

  const handleAddToCart = (book: BookData) => {
    dispatch(addToCart(book));
  };

  const handleEmailChange = async () => {
    try {
      const response = await axios.post("http://localhost:8080/update-email", { email });
      if (response.status === 200) {
        setSuccessMessage("Email updated successfully!");
      }
    } catch (error) {
      setErrorMessage("Failed to update email.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          bgcolor: darkMode ? "#120e1f" : "#fff",
          color: darkMode ? "white" : "black",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <img src="src/assets/img/logoo.png" className="loggo" alt="logo" />
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="open drawer"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {["Home", "Books"].map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <NavLink
                        to={page === "Home" ? "/" : `/${page.toLowerCase()}`}
                        style={{ textDecoration: "none", color: "#484848" }}
                      >
                        <Typography textAlign="center">{page}</Typography>
                      </NavLink>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
                {["Home", "Books"].map((page) => (
                  <NavLink
                    key={page}
                    to={page === "Home" ? "/" : `/${page.toLowerCase()}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{
                        my: 2,
                        color: "inherit",
                        display: "block",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                      }}
                    >
                      {page}
                    </Button>
                  </NavLink>
                ))}
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "rgb(237, 231, 246)",
                  borderRadius: 1,
                  p: 1,
                  maxWidth: "600px",
                  ml: "auto",
                  mr: "auto",
                }}
              >
                <SearchIcon sx={{ color: "#120e1f" }} />
                <InputBase
                  placeholder="Search by Title, Author, Keyword, ISBN..."
                  sx={{ ml: 1, flex: 1, color: "#120e1f" }}
                  value={filterValue || ""}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.4 }}>
              <IconButton
                size="large"
                aria-label="show wishlist"
                color="inherit"
                onClick={() => setWishlistOpen(true)}
              >
                <FavoriteIcon />
              </IconButton>
              <IconButton
                size="large"
                aria-label="show cart"
                color="inherit"
                onClick={() => setCartOpen(true)}
              >
                <Badge badgeContent={cartItems.length} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="User Avatar"
                    src="https://cdn-icons-png.flaticon.com/512/4675/4675250.png"
                    sx={{ width: 20, height: 20 }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    setEmailModalOpen(true);
                  }}
                >
                  <Typography textAlign="center">User Profile</Typography>
                </MenuItem>
                {token && (
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                )}
              </Menu>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch checked={darkMode} onChange={handleThemeChange} />
                  }
                  label=""
                  sx={{ ml: 2 }}
                />
              </FormGroup>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
      <Box>{/* Page content goes here */}</Box>

      <Modal
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: "0 4px 20px 0 rgba(102, 49, 255, .15)",
            p: 4,
            background: "linear-gradient(180deg, #eff6ff 0.55%, #dce0fc 98%)",
            borderColor: "#b1bacb",
            borderRadius: "10px",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setCartOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Shopping Cart
          </Typography>
          {cartItems.length === 0 ? (
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              No items in the cart.
            </Typography>
          ) : (
            <>
              {cartItems.map((item) => (
                <Box key={item.id} sx={{ mt: 2 }}>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <strong>{item.title}</strong> by {item.author}
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                    Quantity: {item.quantity}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                sx={{ mt: 2 }}
              >
                Checkout
              </Button>
            </>
          )}
        </Box>
      </Modal>

      <Modal
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        aria-labelledby="wishlist-modal-title"
        aria-describedby="wishlist-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: "0 4px 20px 0 rgba(102, 49, 255, .15)",
            p: 4,
            background: "linear-gradient(180deg, #eff6ff 0.55%, #dce0fc 98%)",
            borderColor: "#b1bacb",
            borderRadius: "10px",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setWishlistOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            id="wishlist-modal-title"
            variant="h6"
            component="h2"
            sx={{ fontSize: 20, fontWeight: 600, color: "rgb(30, 58, 138)" }}
          >
            Wishlist
          </Typography>
          {wishlist.length === 0 ? (
            <Typography id="wishlist-modal-description" sx={{ mt: 2 }}>
              No items in the wishlist.
            </Typography>
          ) : (
            wishlist.map((book) => (
              <Box key={book.id} sx={{ mt: 2 }}>
                <Typography id="wishlist-modal-description" sx={{ mt: 2 }}>
                  <strong>{book.title}</strong> by {book.author}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRemoveFromWishlist(book.id)}
                  sx={{ mr: 1 }}
                >
                  Remove
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddToCart(book)}
                >
                  Add to Cart
                </Button>
              </Box>
            ))
          )}
        </Box>
      </Modal>

      <Modal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        aria-labelledby="checkout-modal-title"
        aria-describedby="checkout-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: "0 4px 20px 0 rgba(102, 49, 255, .15)",
            p: 4,
            background: "linear-gradient(180deg, #eff6ff 0.55%, #dce0fc 98%)",
            borderColor: "#b1bacb",
            borderRadius: "10px",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setCheckoutOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="checkout-modal-title" variant="h6" component="h2">
            Checkout
          </Typography>
          <Typography id="checkout-modal-description" sx={{ mt: 2 }}>
            Total Amount: ${totalAmount.toFixed(2)}
          </Typography>
          <TextField
            fullWidth
            label="Card Number"
            type="number"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Expiry Date"
            type="text"
            placeholder="MM/YY"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="CVV"
            type="number"
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => alert("Payment Successful!")}
          >
            Pay Now
          </Button>
        </Box>
      </Modal>

      <Modal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        aria-labelledby="email-modal-title"
        aria-describedby="email-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: "0 4px 20px 0 rgba(102, 49, 255, .15)",
            p: 4,
            background: "linear-gradient(180deg, #eff6ff 0.55%, #dce0fc 98%)",
            borderColor: "#b1bacb",
            borderRadius: "10px",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setEmailModalOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="email-modal-title" variant="h6" component="h2">
            User Profile
          </Typography>
          <Typography id="email-modal-description" sx={{ mt: 2 }}>
            Hello, here you can change your email.
          </Typography>
          <TextField
            fullWidth
            label="New Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleEmailChange}
            sx={{ mt: 2 }}
          >
            Update Email
          </Button>
          {successMessage && (
            <Typography color="success.main" sx={{ mt: 2 }}>
              {successMessage}
            </Typography>
          )}
          {errorMessage && (
            <Typography color="error.main" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}
        </Box>
      </Modal>
    </ThemeProvider>
  );
}

export default ResponsiveAppBar;
