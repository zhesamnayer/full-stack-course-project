import { useEffect, useState } from "react";
import { PieChart } from '@mui/x-charts/PieChart';
import { apiFetch } from "./utils/api";

export default function PieChartExpenses({date}) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDataFromBackend(date);
  }, [date]);

  const fetchDataFromBackend = async ( date ) => {

    const start = date.startOf("month");
    const end = date.endOf("month");
    // console.log("in PieChartExpenses start is ", start.unix());

    try {
      const res = await apiFetch(`/api/v1/expenses/summary?from=${start.unix()}&to=${end.unix()}`);
      const data = await res.json();
      
      if (data.ok == null) {
        console.log("no expense data");
        setChartData([]);
      } else {
        const formatted = data.ok.map(item => ({
          label: item.category,
          value: item.amount
        }));
  
        setChartData(formatted);
      }
      
    } catch (error) {
      console.error("Error loading chart data:", error);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
      <PieChart
        series={[{

          animation: true,

          data: chartData.map((item, index) => ({
            id: item.label,
            value: item.value,
            color: `hsl(${index * 45}, 70%, 50%)`
          })),
          innerRadius: 60,
          outerRadius: 120,
          paddingAngle: 2,
          cornerRadius: 4,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          highlightConfig: { innerRadius: 60, additionalRadius: 10 },
          valueFormatter: (item) => `${item.id}  €${item.value}`,
        }]}
        width={300}
        height={300}
        slotProps={{
          legend: { hidden: true },
        }}
        sx={{
          '& .MuiChartsLegend-root': {
            display: 'none !important',
          },
          '& .MuiChartsLegend-container': {
            display: 'none !important',
          },
        }}
      />
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxHeight: "300px",
        overflowY: "auto"
      }}>
        {chartData.map((item, index) => (
          <div key={item.label} style={{
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
              backgroundColor: `hsl(${index * 45}, 70%, 50%)`,
              flexShrink: 0
            }}></div>
            <div style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#333",
              flex: 1
            }}>
              {item.label}
            </div>
            <div style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#f44336"
            }}>
              €{item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
