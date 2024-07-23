import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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

function AuthForm({ isSignUp, handleSubmit, toggleSignUp }: { isSignUp: boolean, handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void, toggleSignUp: () => void }) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        backgroundColor: 'rgb(237, 231, 246)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        borderRadius: 2,
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: '#3f51b5' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        {isSignUp ? 'Sign Up' : 'Login'}
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="usernameOrEmail"
          label="Username or Email"
          name="usernameOrEmail"
          autoComplete="username"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        {isSignUp && (
          <>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="current-password"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="role"
              label="Role (admin or user)"
              type="text"
              id="role"
              autoComplete="role"
            />
          </>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
          }}
        >
          {isSignUp ? 'Sign Up' : 'Login'}
        </Button>
        <Link href="#" variant="body2" onClick={toggleSignUp} sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Link>
        <Copyright sx={{ mt: 5 }} />
      </Box>
    </Box>
  );
}

export default function SignInSide() {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const usernameOrEmail = data.get('usernameOrEmail') as string;
    const password = data.get('password') as string;
    const role = isSignUp ? (data.get('role') as string) : '';

    if (isSignUp) {
      const confirmPassword = data.get('confirmPassword') as string;
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      localStorage.setItem('user', JSON.stringify({ usernameOrEmail, password, role }));
      alert("User registered successfully! Please log in.");
      navigate('/'); // Navigate to login page after successful registration
    } else {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser.usernameOrEmail && storedUser.password && storedUser.usernameOrEmail === usernameOrEmail && storedUser.password === password) {
        localStorage.setItem('token', 'dummy-token'); // Simulating token storage
        navigate('/landing');
      } else {
        alert("Wrong credentials!");
      }
    }
  };

  const toggleSignUp = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
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
      </Grid>
    </ThemeProvider>
  );
}
