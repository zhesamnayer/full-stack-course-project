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
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { apiFetch, convertUnixtoRFC3339 } from "./utils/api";
import { PieChart } from '@mui/x-charts/PieChart';


export default function Incomes() {

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({
    date: dayjs(),
    amount: "",
    description: "",
    category: "",
  });

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Categories
  const [categories, setCategories] = useState([]);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  // Date range filters
  const [from, setFrom] = useState(dayjs().startOf("month"));
  const [to, setTo] = useState(dayjs());

  // Summary data
  const [totalAmount, setTotalAmount] = useState(0);
  const [categorySums, setCategorySums] = useState({});

  const handleOpen = () => {
    setIsEditing(false);
    setEditingRow(null);
    setIsAddingNewCategory(false); // Reset category adding state
    setFormData({ date: dayjs(), amount: "", description: "", category: "" });
    fetchCategories(); // Fetch categories when opening dialog
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const columns = [
    { field: "displayId", headerName: "ID", width: 50, align: "left", headerAlign: "left",
      renderHeader: () => (
      <strong>
        {'ID'}
      </strong>
      )
     },
     { field: "time", headerName: "Time", width: 110, align: "left", headerAlign: "left",
      renderHeader: () => (
      <strong>
        {'Time'}
      </strong>
      ),
      renderCell: (params) => {
        return convertUnixtoRFC3339(params.value)
      }
     },
    { field: "amount", headerName: "Amount", width: 100, type: "number", align: "left", headerAlign: "left",
        renderHeader: () => (
      <strong>
        {'Amount'}
      </strong>
      )
     },
     { field: "category", headerName: "Category", width: 140, align: "left", headerAlign: "left",
      renderHeader: () => (
      <strong>
        {'Category'}
      </strong>
      )
     },
    { field: "description", headerName: "Description", width: 300, align: "left", headerAlign: "left",
       renderHeader: () => (
      <strong>
        {'Description'}
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

  const fetchIncomes = async () => {
    try {
      setLoading(true);

      const res = await apiFetch(`/api/v1/incomes/list?from=${from.unix()}&to=${to.unix()}`);

      if (!res.ok) throw new Error("Failed to fetch incomes");

      const fullData = await res.json();
      const data = fullData.ok || []; // make sure it's an array

      // setRows(data); // DataGrid expects rows with unique `id`
      const processed = data.map((row, index) => ({
      ...row,
      displayId: index + 1,
      }));

      // const sortedData = [...processed].sort((a, b) => b.value - a.value);

      setRows(processed);

    } catch (err) {
      setError(err.message || "Error loading incomes");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiFetch('/api/v1/categories/list?type=income');
      if (!res.ok) throw new Error("Failed to fetch categories");

      const data = await res.json();
      const categoryList = data.ok || [];
      setCategories(categoryList);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };

  const handleGetReport = () => {
    fetchIncomes();
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
      time: formData.date.startOf('D').unix(),
      amount: Number(formData.amount),
      description: formData.description,
      category: formData.category,
    };
      try {
      // const payload = { ...row, amount: parseInt(row.amount, 10) };

      const res = await apiFetch('/api/v1/incomes/add', {
        method: "POST",
        body: JSON.stringify(newRecord), // Send entire row info
      });

      const data = await res.json();

      if (data.error) {
        setSnackbarMessage(data.error);
        setShowToast(true);
      }

      setSnackbarMessage(data.ok || "Row added successfully!");
      setShowToast(true);

      fetchIncomes();

      setFormData({ date: dayjs().startOf('D'), amount: "", description: "", category: "" });
      handleClose();

    } catch (err) {
      setSnackbarMessage(err.message || "Error adding row");
      setShowToast(true);
    }
  };

  const handleDelete = async(id) => {
      try {
   
      const res = await apiFetch(`/api/v1/incomes/delete?id=${id}`, {
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
      fetchIncomes();
      
    } catch (err) {
      setSnackbarMessage(err.messaage);
      setShowSnackbar(true);
    }
  };

  const handleUpdateClick = (row) => {
    setIsEditing(true);
    setEditingRow(row);
    setIsAddingNewCategory(false); // Reset category adding state
    setFormData({
      date: dayjs.unix(row.time), // Convert Unix timestamp to dayjs
      amount: row.amount.toString(),
      description: row.description,
      category: row.category,
    });
    setOpen(true);
  };

  const handleUpdate = async() => {
    try {
      const payload = {
        id: editingRow.id,
        time: formData.date.unix(),
        amount: Number(formData.amount),
        description: formData.description,
        category: formData.category,
      };

      const res = await apiFetch('/api/v1/incomes/update', {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.error) {
        setSnackbarMessage(data.error);
        setShowToast(true);
      } else {
        setSnackbarMessage(data.ok || "Row updated successfully!");
        setShowToast(true);

        // Refresh rows
        fetchIncomes();

        // Close popup and reset
        handleClose();
      }

    } catch (err) {
      setSnackbarMessage(err.message || "Error updating row");
      setShowToast(true);
    }
  };

  // Calculate summary data whenever rows change
  useEffect(() => {
    const total = rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
    setTotalAmount(total);

    const categoryTotals = {};
    rows.forEach(row => {
      const category = row.category || 'Uncategorized';
      const amount = parseFloat(row.amount) || 0;
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });
    setCategorySums(categoryTotals);

      // const sortedData = [...categoryTotals].sort((a, b) => b.value - a.value);
      // setCategorySums(sortedData);

  }, [rows]);

  useEffect(() => {
    fetchIncomes();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/back.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // backgroundSize: "contain",
        backgroundRepeat: 'repeat',
        height: "100%",
        width: "100%",
        overflowY: "auto",
      }}
    >

    <div style={{ padding:"20px", width:"100px"}}>
        <h2 style={{ color: "white", padding: 0, margin: 0 }}>Incomes</h2>
    </div>
      
      
      {/* POPUP FORM */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? "Update income record" : "Add a new income"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

          <FormControl fullWidth sx={{ mt: 1, mb: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={formData.date}
                onChange={(newValue) => setFormData({ ...formData, date: newValue })}
                maxDate={dayjs()}
                sx={{
                  '& .MuiInputLabel-root': {
                    backgroundColor: 'white',
                    padding: '0 8px',
                    marginLeft: '-4px',
                  },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                  }
                }}
              />
            </LocalizationProvider>
          </FormControl>

          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            {isAddingNewCategory ? (
              <TextField
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Enter new category name"
                fullWidth
              />
            ) : (
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => {
                  if (e.target.value === "__add_new__") {
                    setIsAddingNewCategory(true);
                    setFormData({ ...formData, category: "" });
                  } else {
                    setFormData({ ...formData, category: e.target.value });
                  }
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
                <MenuItem value="__add_new__">
                  <em>+ new category</em>
                </MenuItem>
              </Select>
            )}
          </FormControl>
          {isAddingNewCategory && (
            <Button
              onClick={() => {
                setIsAddingNewCategory(false);
                setFormData({ ...formData, category: "" });
              }}
              sx={{ mt: 1, textTransform: "none" }}
            >
              ← Back to category list
            </Button>
          )}
        </DialogContent>

        <DialogActions >
          <Button onClick={handleClose} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ textTransform: "none" }}>
            {isEditing ? "Update" : "Send"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DATE RANGE CONTROLS */}
      <div style={{ width: "1160px",display:"flex", gap: "20px", alignItems: "center", flexWrap: "wrap", backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "20px", borderRadius: "12px", margin: "20px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"}}>
          <div style={{ minWidth:"200px"}}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                      label="from"
                      value={from}
                      onChange={(newValue) => setFrom(newValue)}
                      sx={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          '& .MuiInputBase-root': {
                              backgroundColor: "white",
                          },
                          '& .MuiOutlinedInput-root': {
                              backgroundColor: "white",
                          }
                      }}
                  />
              </LocalizationProvider>
          </div>

          <div style={{ minWidth:"200px"}}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                      label="to"
                      value={to}
                      onChange={(newValue) => setTo(newValue)}
                      maxDate={dayjs()}
                      sx={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          '& .MuiInputBase-root': {
                              backgroundColor: "white",
                          },
                          '& .MuiOutlinedInput-root': {
                              backgroundColor: "white",
                          }
                      }}
                      />
              </LocalizationProvider>
          </div>

          <div style={{ minWidth:"150px"}}>
              <Button
                  variant="contained"
                  onClick={handleGetReport}
                  sx={{
                      textTransform: "none",
                      backgroundColor: "#1976d2",
                      color: "white",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      '&:hover': {
                          backgroundColor: "#1565c0",
                      }
                  }}
              >
                  View
              </Button>
          </div>
      </div>

      {/* SUMMARY BOX */}
      <div style={{ display: "flex", gap: "20px", margin: "20px", width: "100%", justifyContent: "flex-start"}}>
          {/* Total Amount Box */}
          <div style={{
              width: "250px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
          }}>
              <h3 style={{ margin: "0 0 15px 0", color: "#1976d2", textAlign: "center" }}>Total Income</h3>
              <div style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#4caf50"
              }}>
                  €{totalAmount.toFixed(2)}
              </div>
          </div>

          {/* Category Breakdown Box */}
          <div style={{
              width: "850px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              padding: "20px"
          }}>
              <h3 style={{ margin: "0 0 15px 0", color: "#1976d2" }}>Income by category</h3>
              <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "300px"
              }}>
                  {Object.keys(categorySums).length === 0 ? (
                      <div style={{
                          textAlign: "center",
                          color: "#666",
                          fontStyle: "italic",
                          padding: "20px"
                      }}>
                          No income recorded yet
                      </div>
                  ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                          <PieChart
                              series={[{

                                  // data: [...]

                                  data: Object.entries(categorySums).map(([category, amount], index) => ({
                                      id: category,
                                      value: amount,
                                      // label: category,
                                      color: `hsl(${index * 45}, 70%, 50%)`
                                  })),
                                  innerRadius: 60,
                                  outerRadius: 120,
                                  paddingAngle: 2,
                                  cornerRadius: 4,
                                  highlightScope: { faded: 'global', highlighted: 'item' },
                                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                  highlightConfig: { innerRadius: 60, additionalRadius: 10 }
                              }]}
                              width={300}
                              height={300}
                          />
                          <div style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "12px",
                              maxHeight: "300px",
                              overflowY: "auto"
                          }}>
                              {Object.entries(categorySums).map(([category, amount], index) => (
                                  <div key={category} style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      padding: "4px 8px",
                                      borderRadius: "4px",
                                      backgroundColor: "rgba(255, 255, 255, 0.8)"
                                  }}>
                                      <div style={{
                                          width: "12px",
                                          height: "12px",
                                          borderRadius: "2px",
                                          backgroundColor: `hsl(${120 + index * 30}, 70%, 50%)`,
                                          flexShrink: 0
                                      }}></div>
                                      <div style={{
                                          fontSize: "14px",
                                          fontWeight: "500",
                                          color: "#333",
                                          flex: 1
                                      }}>
                                          {category}
                                      </div>
                                      <div style={{
                                          fontSize: "14px",
                                          fontWeight: "bold",
                                          color: "#4caf50"
                                      }}>
                                          €{amount.toFixed(2)}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
          </div>
      </div>

      {/* NEW INCOME BUTTON */}
      <div style={{ width: "1160px", padding:"20px", margin: "20px", backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"}}>
        <Button variant="contained" onClick={handleOpen} sx={{ textTransform: "none" }}>
          New Income
        </Button>
      </div>

      <div style={{ width:"1200px", padding: "0px 20px 20px 20px", borderRadius: "12px", overflow: "hidden"}}>
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
