import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { useTransactionsContext } from 'src/contexts/TransactionsContext';

export default function PageViewsBarChart() {
  const theme = useTheme();
  const { statisticsMonth } = useTransactionsContext();

  if (!statisticsMonth || !statisticsMonth.sixMonth) {
    return null; // o un Skeleton loader
  }

  const colorPalette = [
    (theme.vars || theme).palette.primary.dark,
    (theme.vars || theme).palette.primary.main,
  ];

  // Extraigo labels (meses) y valores
  const months = statisticsMonth.sixMonth.map((item: any) => item.month);
  const incomes = statisticsMonth.sixMonth.map((item: any) => item.income);
  const egresses = statisticsMonth.sixMonth.map((item: any) => item.egress);

  // Totales (ejemplo para mostrar arriba de la card)
  const totalIncome = incomes.reduce((acc: number, val: number) => acc + val, 0);
  const totalEgress = egresses.reduce((acc: number, val: number) => acc + val, 0);

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Income vs Egress (last 6 months)
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
              justifyContent: 'space-between', flexGrow: '1'
            }}
          >
            <Typography variant="h4" component="p">
              ${totalIncome - totalEgress}
            </Typography>
            <Chip
              size="small"
              color={totalIncome >= totalEgress ? 'success' : 'error'}
              label={`${((totalIncome - totalEgress) / (totalEgress || 1) * 100).toFixed(1)}%`}
            />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Totals from the last 6 months
          </Typography>
          </Stack>

        </Stack>

        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'band',
              categoryGapRatio: 0.5,
              data: months,
            },
          ]}
          series={[
            {
              id: 'income',
              label: 'Income',
              data: incomes,
              stack: 'A',
            },
            {
              id: 'egress',
              label: 'Egress',
              data: egresses,
              stack: 'A',
            },
          ]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: false, // muestro leyenda para distinguir Income/Egress
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
