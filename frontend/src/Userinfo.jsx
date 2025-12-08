import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Avatar,
  Divider,
  Grid,
  Snackbar,
} from "@mui/material";
import { Person as PersonIcon, Lock as LockIcon, Email as EmailIcon, Badge as BadgeIcon } from "@mui/icons-material";
import { apiFetch } from "./utils/api";

export default function Userinfo() {
  const baseUrl = sessionStorage.getItem("baseUrl");
  const token = sessionStorage.getItem("token");

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    role: "",
    id: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [severity, setSeverity] = useState("success");

  // Fetch user info from API
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) {
        setLoadingUserInfo(false);
        return;
      }

      try {
        const response = await apiFetch('/api/v1/userinfo');

        if (response.ok) {
          const data = await response.json();
          setUserInfo({
            username: data.ok.username || "",
            email: data.ok.email || "",
            role: data.ok.role || "",
            id: data.id || data.user_id || "",
          });
        } else {
          console.error("Failed to fetch user info:", response.status);
          setSnackbarMessage("Failed to load user information");
          setSeverity("error");
          setShowToast(true);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setSnackbarMessage("Network error while loading user information");
        setSeverity("error");
        setShowToast(true);
      } finally {
        setLoadingUserInfo(false);
      }
    };

    fetchUserInfo();
  }, [token, baseUrl]);

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdatePassword = async () => {
    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setSnackbarMessage("All password fields are required");
      setSeverity("error");
      setShowToast(true);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSnackbarMessage("New passwords don't match");
      setSeverity("error");
      setShowToast(true);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setSnackbarMessage("New password must be at least 6 characters long");
      setSeverity("error");
      setShowToast(true);
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch('/api/v1/change_password', {
        method: "POST",
        body: JSON.stringify({
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword,
          new_password_repeat: passwordForm.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbarMessage("Password updated successfully!");
        setSeverity("success");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setSnackbarMessage(data.error || "Failed to update password");
        setSeverity("error");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setSnackbarMessage("Network error. Please try again.");
      setSeverity("error");
    } finally {
      setLoading(false);
      setShowToast(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/back.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: 600,
        width: "100%",
        padding: "20px",
        // height: "100%",
        // overflowY: "auto",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          color: "white",
          textAlign: "center",
          marginBottom: "30px",
          fontWeight: "bold",
        }}
      >
        User Information
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {/* User Information Card */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={10}
            sx={{
              padding: 4,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 80,
                  height: 80,
                  mb: 2,
                }}
              >
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {userInfo.username || "User"}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              {loadingUserInfo ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Loading user information...
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box display="flex" alignItems="center" mb={2}>
                    <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Username
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {userInfo.username || "Not available"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {userInfo.email || "Not available"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <BadgeIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Role
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {userInfo.role || "Not available"}
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Change Password Card */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={10}
            sx={{
              padding: 4,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Avatar
                sx={{
                  bgcolor: 'secondary.main',
                  width: 60,
                  height: 60,
                  mb: 2,
                }}
              >
                <LockIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" color="secondary">
                Change Password
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                fullWidth
                type="password"
                label="New Password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleUpdatePassword}
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
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
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar Notification */}
      <Snackbar
        open={showToast}
        autoHideDuration={4000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowToast(false)}
          severity={severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
