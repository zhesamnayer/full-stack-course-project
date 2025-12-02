import PieChartExpenses from "./DonutchartExpenses";
import PieChartIncomes from "./DonutchartIncomes";
import PieChartSummary from "./DonutchartSummary";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

export default function Dashboard() {

  return (
        <Box
          sx={{
            minHeight: '100vh',
            backgroundImage: 'url(/back.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: "20px",
            display: "flex",
          }}
        >
            {/* <h2 style={{ color: "white" }}>Last month</h2> */}
            
            <div style={{padding:"50px"}} sx={{ backgroundColor: "white", borderRadius: "5px" }}>
                <PieChartExpenses />
                <Typography
                variant="body1"
                align="center"
                sx={{ mt: 1, color: "white" }}
                >
                Expenses Summary
              </Typography>
            </div>
            <div style={{padding:"50px"}} sx={{ backgroundColor: "white", borderRadius: "10px" }}>
              <PieChartIncomes />
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ mt: 1, color: "white" }}
                >
                  Incomes Summary
                </Typography>
            </div>

            <div style={{padding:"50px"}} sx={{ backgroundColor: "white", borderRadius: "10px" }}>
              <PieChartSummary />
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ mt: 1, color: "white" }}
                >
                  Summary
                </Typography>
            </div>

        </Box>
  );
}