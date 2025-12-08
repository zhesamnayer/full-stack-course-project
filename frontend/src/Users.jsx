import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { apiFetch } from "./utils/api";

export default function Users() {
  const baseUrl = sessionStorage.getItem("baseUrl");
  const token = sessionStorage.getItem("token");

  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role:"user",
  });

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const columns = [
    { field: "displayId", headerName: "ID", width: 70, align: "left", headerAlign: "left",
      renderHeader: () => (
        <strong>
          {'ID'}
        </strong>
        )
     },
    { field: "username", headerName: "Username", width: 100, editable: true, align: "left", headerAlign: "left",
      renderHeader: () => (
        <strong>
          {'Username'}
        </strong>
        )
     },
    { field: "password", headerName: "Password", width: 200, editable: true, align: "left", headerAlign: "left",
      renderHeader: () => (
        <strong>
          {'Password'}
        </strong>
        )
     },
    { field: "email", headerName: "Email", width: 300, editable: true, align: "left", headerAlign: "left",
      renderHeader: () => (
        <strong>
          {'Email'}
        </strong>
        )
     },
    { field: "role", headerName: "Role", width: 140, editable: true, align: "left", headerAlign: "left",
      renderHeader: () => (
        <strong>
          {'Role'}
        </strong>
        )
     },
  {
    field: "actions",
    headerName: "Actions",
    width: 390,
    renderHeader: () => (
      <strong>
        {'Actions'}
      </strong>
      ),
    renderCell: (params) => (
      <div style={{ display: "flex", gap: "10px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleUpdate(params.row)}
          sx={{ textTransform: "none" }}
        >
          Update
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={() => handleDelete(params.row.id)}
          sx={{ textTransform: "none" }}
        >
          Delete
        </Button>

        <Button
          variant="contained"
          color="warning"
          onClick={() => handleChangePassword(params.row)}
          sx={{ textTransform: "none" }}
        >
          Change Password
        </Button>

      </div>
    ),
    },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await apiFetch('/api/v1/users/list');

      if (!res.ok) throw new Error("Failed to fetch users");

      const fullData = await res.json();
      const data = fullData.ok || []; // make sure it's an array

      // setRows(data); // DataGrid expects rows with unique `id`
      const processed = data.map((row, index) => ({
      ...row,
      displayId: index + 1,
    }));

    setRows(processed);

    } catch (err) {
      setError(err.message || "Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = async() => {
    const newRecord = {
      username: formData.username,
      password: formData.password,
      role: role, // Use the role state instead of formData.role
      email: formData.email,
    };


    console.log("newRecord:", newRecord);
      try {
      // const payload = { ...row, amount: parseInt(row.amount, 10) };

      const res = await fetch(`${baseUrl}/api/v1/users/add`, {
        method: "POST",
        body: JSON.stringify(newRecord), // Send entire row info
      });

      const data = await res.json();
      
      if (data.error) {
        setSnackbarMessage(data.error);
        setShowToast(true);
      }
      
      if (data.ok) {
        setSnackbarMessage(data.ok || "Row added successfully!");
        setShowToast(true);
      }

      // Refresh rows
      fetchUsers();

      // Close popup and reset
      setFormData({ username: "", password: "", email: "" });
      setRole("users"); // Reset role to default value
      handleClose();
      
    } catch (err) {
      setSnackbarMessage(err.messaage);
      setShowToast(true);
    }
  };

  const handleDelete = async(id) => {
      try {
   
      const res = await fetch(`${baseUrl}/api/v1/users/delete?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      
      if (data.error) {
        setSnackbarMessage(data.error);
        setShowSnackbar(true);
      }
      
      setSnackbarMessage(data.ok || "Row deleted successfully!");
      setShowToast(true);

      // Refresh rows
      fetchUsers();
      
    } catch (err) {
      setSnackbarMessage(err.messaage);
      setShowSnackbar(true);
    }
  };

  const handleUpdate = async(row) => {
      try {
      const res = await fetch(`${baseUrl}/api/v1/users/update`, {
        method: "POST",
        body: JSON.stringify(row), // Send entire row info
      });

      const data = await res.json();
      
      if (data.error) {
        setSnackbarMessage(data.error);
        setShowSnackbar(true);
      }
      
      setSnackbarMessage(data.ok || "Row updated successfully!");
      setShowToast(true);

      // Refresh rows
      fetchUsers();
      
    } catch (err) {
      setSnackbarMessage(err.messaage);
      setShowSnackbar(true);
    }
  };

    const handleChangePassword = async(row) => {
      try {
      
        // console.log("row:", row);

      const credentials = {
        user_id : row.id,
        password: row.password
      };

      console.log("credentials:", credentials);

      const res = await fetch(`${baseUrl}/api/v1/users/change_password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      
      if (data.error) {
        setSnackbarMessage(data.error);
        setShowSnackbar(true);
      }
      
      setSnackbarMessage(data.ok || "Password chanaged successfully!");
      setShowToast(true);

      // Refresh rows
      fetchUsers();
      
    } catch (err) {
      setSnackbarMessage(err.messaage);
      setShowSnackbar(true);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
      }}
    >

      <div style={{ padding:"20px", width:"200px"}}>
        <Button variant="contained" onClick={handleOpen} sx={{ textTransform: "none" }}>
          New User
        </Button>
      </div>

      {/* POPUP FORM */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a new user</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
          />
            <TextField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          {/* <TextField
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
          /> */}
          <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                    value={role}
                    label="Role"
                    onChange={(e) => setRole(e.target.value)}
                >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                </Select>
            </FormControl>


        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleInsert}>
            Send
          </Button>
        </DialogActions>
      </Dialog>


    <div style={{ width:"1200px", padding:"20px"}}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            sortModel={[{ field: 'id', sort: 'asc' }]} // initial sort
            pageSizeOptions={[10, 25, 50]}
            showToolbar
          />
    </div>

 
            {/* Snackbar Notification */}
      <Snackbar
        open={showToast}
        autoHideDuration={2000}
        onClose={() => setShowToast(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />

    </Box>
  );
}
