import { useState, useEffect } from "react";
import PieChartExpenses from "./DonutchartExpenses";
import PieChartIncomes from "./DonutchartIncomes";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { apiFetch } from "./utils/api";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
// import Card from '@mui/material/Card';

export default function Dashboard() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalTodayInvoices, setTotalTodayInvoices] = useState(0);

  const [from, setFrom] = useState(dayjs().startOf("month"));

  useEffect(() => {
    fetchSummary(from);
    fetchTodayInvoices();
  }, []);

  const fetchSummary = async (fromDate) => {

    const start = fromDate.startOf("month").unix();
    const end = fromDate.endOf("month").unix();

    // console.log("from ", start);
    // console.log("to ", end.unix());

    try {

      // Fetch summary
      const summmaryRes = await apiFetch(`/api/v1/summary?from=${start}&to=${end}`);
      const summmaryData = await summmaryRes.json();
      
      const incomeTotal = summmaryData.ok.incomes || 0;
      const expenseTotal = summmaryData.ok.expenses || 0;

      setTotalIncome(incomeTotal);
      setTotalExpenses(expenseTotal);

    } catch (error) {
      console.error("Error loading summary:", error);
    }
  };

  const fetchTodayInvoices = async () => {

    const fromDate = dayjs();
    const start = fromDate.startOf("day").unix();
    const end = fromDate.endOf("day").unix();

    try {

      // Fetch Total Today invoices
      const summmaryRes = await apiFetch(`/api/v1/upcoming_expenses/list?from=${start}&to=${end}`);
      const summmaryData = await summmaryRes.json();
      
      const incomeTotal = summmaryData.ok.reduce((sum, item) => sum + item.amount, 0) || 0;

      setTotalTodayInvoices(incomeTotal);

    } catch (error) {
      console.error("Error loading summary:", error);
    }
  };

  return (
        <Box
          sx={{
            minHeight: '100vh',
            backgroundImage: 'url(/back.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            // overflowY: "auto",
            height: "100%",
            width: "100%",
          }}
        >
          <div style={{ width: "200px", display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px", backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "10px", borderRadius: "12px", margin: "10px" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                      value={from}
                      onChange={(newValue) =>  {
                        const v = newValue.clone();
                        setFrom(v); 
                        fetchSummary(v);
                      }}

                      label={'month'}
                      openTo="month"
                      views={['year', 'month']}

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

            {/* Summary Boxes */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px" }}>
              {/* Total Income Box */}
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
                  €{totalIncome.toFixed(2)}
                </div>
              </div>

              {/* Total Expenses Box */}
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
                <h3 style={{ margin: "0 0 15px 0", color: "#1976d2", textAlign: "center" }}>Total Expenses</h3>
                <div style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#f44336"
                }}>
                  €{totalExpenses.toFixed(2)}
                </div>
              </div>

            {/* Total Today Invoices Box */}
            <div style={{
                width: "250px",
                backgroundColor:       totalTodayInvoices === 0
                ? "rgba(255, 255, 255, 0.95)"
                : "rgba(255, 0, 0, 0.4)",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <h3 style={{ margin: "0 0 15px 0", color: "#1976d2", textAlign: "center" }}>Today Invoices</h3>
                
                {totalTodayInvoices == 0 ? (
                    <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#666", textAlign: "center" }}>
                      You have no upcoming payment today
                  </div>
                ): (
                    <div style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: "#f44336"
                    }}>
                      €{totalTodayInvoices.toFixed(2)}
                    </div>
                )
              }
              </div>

            </div>
            
            {/* Charts */}
            <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{padding:"30px"}} sx={{ backgroundColor: "white", borderRadius: "10px" }}>
                <PieChartIncomes date={from} />
                  <Typography
                    variant="body1"
                    align="center"
                    sx={{ mt: 1, color: "white", padding: "0px 160px 0px 0px" }}
                  >
                    Incomes Summary
                  </Typography>
              </div>

              <div style={{padding:"30px"}} sx={{ backgroundColor: "white", borderRadius: "5px" }}>
                  <PieChartExpenses date={from} />
                  <Typography
                    variant="body1"
                    align="center"
                    sx={{ mt: 1, color: "white", padding: "0px 160px 0px 0px" }}
                  >
                  Expenses Summary
                </Typography>
              </div>

            </div>

        </Box>
  );
}