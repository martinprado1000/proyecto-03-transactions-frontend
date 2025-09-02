import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// import Stack from "@mui/material/Stack";
// import Copyright from "src/components/customIcons/Copyright";
// import ChartUserByCountry from "./ChartUserByCountry";
// import CustomizedTreeView from "./CustomizedTreeView";
// import CustomizedDataGrid from "./CustomizedDataGrid";
// import PageViewsBarChart from "./PageViewsBarChart";
// import SessionsChart from "./SessionsChart";
//import StatCard, { type StatCardProps } from "./StatCard";

import HighlightedCard from "./HighlightedCard";
import StatCard, { type StatCardProps } from "./StatCard";
import { useTransactionsContext } from "src/contexts/TransactionsContext";
import { useEffect } from "react";

export default function DashboardTransactionsMainGrid() {

  const { getStatistics, statisticsMonth } = useTransactionsContext();

  useEffect(() => {
    getStatistics()
  }, [])

  useEffect(() => {
  if (statisticsMonth) {
  }
}, [statisticsMonth])

  const data: StatCardProps[] = [
  {
    title: "Income",
    value: "U$A",
    interval: "Last 30 days",
    trend: "up",
    data: statisticsMonth ? statisticsMonth.income.map((d) => d.amount) : [],
  },
  {
    title: "Egress",
    value: "U$A",
    interval: "Last 30 days",
    trend: "down",
    data: statisticsMonth ? statisticsMonth.egress.map((d) => d.amount) : [],
  },
  {
    title: "All transactions",
    value: "U$A",
    interval: "Last 30 days",
    trend: "neutral",
    data: statisticsMonth ? statisticsMonth.all.map((d) => d.amount) : [],
  },
];
  

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Statistics
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>

        {/* <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid> */}
      </Grid>



      {/* <Copyright sx={{ my: 4 }} /> */}
    </Box>
  );
}
