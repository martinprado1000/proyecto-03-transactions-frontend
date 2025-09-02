import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";
import { format } from "date-fns";
import { useTransactionsContext } from "src/contexts/TransactionsContext";

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

export default function SessionsChart() {
  const theme = useTheme();
  const { statisticsMonth } = useTransactionsContext();

  if (!statisticsMonth) {
    return null; // o un skeleton loader
  }

  // Armamos labels (fechas últimos 30 días)
  const labels =
    statisticsMonth.income?.map((d) => format(new Date(d.date), "MMM d")) ?? [];

  // Series con income / egress / all
  const series = [
    {
      id: "income",
      label: "Income",
      showMark: false,
      curve: "linear",
      stack: "total",
      area: true,
      data: statisticsMonth.income.map((d) => d.amount),
    },
    {
      id: "egress",
      label: "Egress",
      showMark: false,
      curve: "linear",
      stack: "total",
      area: true,
      data: statisticsMonth.egress.map((d) => d.amount),
    },
    {
      id: "all",
      label: "All Transactions",
      showMark: false,
      curve: "linear",
      stack: "total",
      area: true,
      data: statisticsMonth.all.map((d) => d.amount),
    },
  ];

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Transactions Overview
        </Typography>
        <Stack sx={{ justifyContent: "space-between", mb: 1 }}>
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', flexGrow: '1', gap: 1 }}
          >
            <Typography variant="h4" component="p">
              {statisticsMonth.all.reduce((acc, d) => acc + d.amount, 0)} U$A
            </Typography>
            <Chip size="small" color="success" label="+0%" />
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Income / Egress / All - Last 30 days
            </Typography>
          </Stack>
          {/* <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Income / Egress / All - últimos 30 días
          </Typography> */}
        </Stack>

        <LineChart
          xAxis={[
            {
              scaleType: "point",
              data: labels,
              tickInterval: (index, i) => (i + 1) % 5 === 0,
            },
          ]}
          series={series}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiAreaElement-series-income": {
              fill: "url('#income')",
            },
            "& .MuiAreaElement-series-egress": {
              fill: "url('#egress')",
            },
            "& .MuiAreaElement-series-all": {
              fill: "url('#all')",
            },
          }}
          slotProps={{
            legend: {
              hidden: false, // mostramos leyenda para distinguir
            },
          }}
        >
          <AreaGradient color={theme.palette.success.main} id="income" />
          <AreaGradient color={theme.palette.error.main} id="egress" />
          <AreaGradient color={theme.palette.primary.main} id="all" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
