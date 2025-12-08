import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  Container,
  Link
} from "@mui/material";
import { Person, Email, Lock } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { apiFetch } from "./utils/api";

const Signup = () => {

  const [form, setForm] = useState({
    username: "",
    password: "",
    password_confirmation:"",
    email: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Update form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (form.password != form.password_confirmation ) {
        setMessage("Passwords do not match!");
        setLoading(false);
    }else{
      try {
        const response = await apiFetch('/api/v1/signup', {
          method: "POST",
          body: JSON.stringify(form),
        });
  
        const signupData = await response.json();
  
        if (response.ok) {
          setSuccess(true);
          setMessage("Account created successfully! Signing you in...");
  
          // Automatically log in the user after successful signup
          try {
            const loginResponse = await apiFetch('/api/v1/login', {
              method: "POST",
              body: JSON.stringify({
                username: form.username,
                password: form.password,
              }),
            });
  
            const loginData = await loginResponse.json();
  
            if (loginResponse.ok) {
              const token = loginData.token;
              sessionStorage.setItem("token", token);
              window.location.href = "/";
            } else {
              setMessage("Account created successfully! Please sign in manually.");
            }
          } catch (loginError) {
            console.error("Auto-login error:", loginError);
            setMessage("Account created successfully! Please sign in manually.");
          }
        } else {
          setMessage(signupData.error || "Signup failed. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
   
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/back-login.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            borderRadius: 3,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 3,
            }}
          >
            Finance Management
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: <Lock sx={{ color: 'action.active', mr: 1 }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              fullWidth
              label="Password Confirmation"
              type="password"
              variant="outlined"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: <Lock sx={{ color: 'action.active', mr: 1 }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {message && (
              <Alert
                severity={success ? "success" : "error"}
                sx={{ borderRadius: 2 }}
              >
                {message}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 10px 2px rgba(102, 126, 234, .3)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;