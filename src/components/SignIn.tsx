import AuthForm from '../components/AuthForm';
import * as React from 'react';
import { useNavigate, Route, Routes, Navigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
  },
});

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="">
        Book Shop
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignIn() {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const role = isSignUp ? (data.get('role') as string) : '';

    if (isSignUp) {
      const confirmPassword = data.get('confirmPassword') as string;
      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        toast.error("Invalid email format");
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      try {
        const response = await fetch('http://localhost:8080/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, role }),
        });
        if (response.ok) {
          toast.success("User registered successfully! Please log in.");
          setIsSignUp(false);
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Sign up failed");
        }
      } catch (error) {
        toast.error("Sign up failed. Please try again later.");
      }
    } else {
      try {
        const response = await fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);
          navigate('/landing');
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Login failed");
        }
      } catch (error) {
        toast.error("Login failed. Please try again later.");
      }
    }
  };

  const toggleSignUp = () => {
    setIsSignUp((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/books');
  };

  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  return (
    <ThemeProvider theme={defaultTheme}>
      <ToastContainer />
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url("https://static.vecteezy.com/system/resources/previews/027/100/867/large_2x/banner-with-a-pink-background-and-long-shadows-featuring-orange-books-or-notebooks-with-lavender-free-photo.jpg")',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'bottom',
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}
        >
          <AuthForm isSignUp={isSignUp} handleSubmit={handleSubmit} toggleSignUp={toggleSignUp} />
        </Grid>
        {isAuthenticated && (
          <Button
            onClick={handleLogout}
            variant="contained"
            color="secondary"
            sx={{ position: 'absolute', top: 16, right: 16 }}
          >
            Logout
          </Button>
        )}
      </Grid>
    </ThemeProvider>
  );
}

// Mock Components for the Routes
function BooksList() {
  return <div>BooksList Component</div>;
}

function Cart() {
  return <div>Cart Component</div>;
}

function Checkout() {
  return <div>Checkout Component</div>;
}

function CreateBook() {
  return <div>CreateBook Component</div>;
}

function EditBook() {
  return <div>EditBook Component</div>;
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: JSX.Element }) {
  const userRole = localStorage.getItem('role');
  return userRole === 'admin' ? children : <Navigate to="/books" />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignIn />} />
      <Route path="/books" element={<BooksList />} />
      <Route path="/landing" element={<div>Landing Component</div>} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/createBook"
        element={
          <AdminRoute>
            <CreateBook />
          </AdminRoute>
        }
      />
      <Route
        path="/editBook/:id"
        element={
          <AdminRoute>
            <EditBook />
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/books" />} />
    </Routes>
  );
}
