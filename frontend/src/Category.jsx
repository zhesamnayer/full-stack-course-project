import { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Snackbar from "@mui/material/Snackbar";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { apiFetch } from "./utils/api";

export default function Category() {

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Category type selection
  const [categoryType, setCategoryType] = useState("income");

  const handleOpen = () => {
    setIsEditing(false);
    setEditingRow(null);
    setFormData({ name: "" });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setCategoryType(newType);
    fetchCategories(newType);
  };

  const columns = [
    { field: "displayId", headerName: "ID", width: 70, align: "left", headerAlign: "left",
      renderHeader: () => (
      <strong>
        {'ID'}
      </strong>
      )
     },
    { field: "name", headerName: "Name", width: 300, align: "left", headerAlign: "left",
        renderHeader: () => (
      <strong>
        {'Name'}
      </strong>
      )
     },
  {
    field: "actions",
    headerName: "Actions",
    width: 250,
    renderHeader: () => (
      <strong>
        {'Actions'}
      </strong>
      ),
    renderCell: (params) => (
      <div style={{ display: "flex", gap: "10px",justifyContent: "left", }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleUpdateClick(params.row)}
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
      </div>
    ),
    },
  ];

  const fetchCategories = async (type = categoryType) => {
    try {
      setLoading(true);

      const res = await apiFetch(`/api/v1/categories/list?type=${type}`);

      if (!res.ok) throw new Error("Failed to fetch categories");

      const fullData = await res.json();
      const data = fullData.ok || []; // make sure it's an array

      // setRows(data); // DataGrid expects rows with unique `id`
      const processed = data.map((row, index) => ({
      ...row,
      displayId: index + 1,
    }));

    setRows(processed);

    } catch (err) {
      setError(err.message || "Error loading categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async() => {
    if (isEditing) {
      await handleUpdate();
    } else {
      await handleInsert();
    }
  };

  const handleInsert = async() => {
    const newRecord = {
      name: formData.name,
      type: categoryType,
    };
      try {
      // const payload = { ...row, amount: parseInt(row.amount, 10) };

      const res = await apiFetch('/api/v1/categories/add', {
        method: "POST",
        body: JSON.stringify(newRecord),
      });

      const data = await res.json();

      if (data.error) {
        setSnackbarMessage(data.error);
        setShowToast(true);
      }

      setSnackbarMessage(data.ok || "Category added successfully!");
      setShowToast(true);

      // Refresh rows
      fetchCategories();

      // Close popup and reset
      setFormData({ name: "" });
      handleClose();

    } catch (err) {
      setSnackbarMessage(err.message || "Error adding category");
      setShowToast(true);
    }
  };

  const handleDelete = async(id) => {
      try {

      const res = await apiFetch(`/api/v1/categories/delete?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.error) {
        setSnackbarMessage(data.error);
        setShowToast(true);
      }

      setSnackbarMessage(data.ok || "Category deleted successfully!");
      setShowToast(true);

      // Refresh rows
      fetchCategories();

    } catch (err) {
      setSnackbarMessage(err.message || "Error deleting category");
      setShowToast(true);
    }
  };

  const handleUpdateClick = (row) => {
    setIsEditing(true);
    setEditingRow(row);
    setFormData({
      name: row.name,
    });
    setOpen(true);
  };

  const handleUpdate = async() => {
    try {
      const payload = {
        id: editingRow.id,
        name: formData.name,
        type: categoryType,
      };

      const res = await apiFetch('/api/v1/categories/update', {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.error) {
        setSnackbarMessage(data.error);
        setShowToast(true);
      } else {
        setSnackbarMessage(data.ok || "Category updated successfully!");
        setShowToast(true);

        // Refresh rows
        fetchCategories();

        // Close popup and reset
        handleClose();
      }

    } catch (err) {
      setSnackbarMessage(err.message || "Error updating category");
      setShowToast(true);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/back.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: "100%",
        width: "100%",
        overflowY: "auto",
      }}
    >

      <div style={{ padding:"20px", width:"400px"}}>

        <h2 style={{ color: "white" }}>Your categories</h2>

        <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "20px", backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "10px", borderRadius: "12px", margin: "10px" }}>
          <FormControl style={{ minWidth: "150px" }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={categoryType}
              label="Type"
              onChange={handleTypeChange}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "8px" }}
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" onClick={handleOpen} sx={{ textTransform: "none" }}>
            New Category
          </Button>
        </div>
      </div>

      {/* POPUP FORM */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? "Update category" : "Add a new category"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>

        <DialogActions >
          <Button onClick={handleClose} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ textTransform: "none" }}>
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>


    <div style={{ width:"1000px", padding:"20px"}}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            sortModel={[{ field: 'id', sort: 'asc' }]} // initial sort
            pageSizeOptions={[10, 25, 50]}
            showToolbar
            // columnHeaderHeight={50}
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
