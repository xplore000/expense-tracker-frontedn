import { useState,useEffect } from 'react';
import axios from "axios";
// material-ui
import {
  
  Box,
  Button,
  Grid,
  Stack,
  Typography
} from '@mui/material';

// project import
//import OrdersTable from './OrdersTable';
import IncomeAreaChart from './IncomeAreaChart';
import MonthlyBarChart from './MonthlyBarChart';
//import ReportAreaChart from './ReportAreaChart';
//import SalesColumnChart from './SalesColumnChart';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

// assets
//import { GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';


// avatar style


// sales report status


// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
 
  const [slot, setSlot] = useState('week');
  const [monthlyExpense, setMonthlyExpense] = useState(null);
  const [monthlyIncome, setMonthlyIncome] = useState(null); // State to hold the monthly expense

  // Function to fetch monthly expense data from the API

const fetchMonthlyExpense = async () => {
  try {
    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
    const currentYear = currentDate.getFullYear();

    // Fetch expenses for the current month
    const response = await axios.get(`http://localhost:3002/api/v1/get-expenses?user_id=6609b5b50b915f3b2267ad0b`);
    const expenses = response.data.expenses;

    // Filter expenses for the current month
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date); // Assuming there is a 'date' field in the expense object
      const expenseMonth = expenseDate.getMonth() + 1; // Months are 0-indexed, so add 1
      const expenseYear = expenseDate.getFullYear();
      return expenseMonth === currentMonth && expenseYear === currentYear;
    });

    // Calculate total monthly expense from the filtered expenses
    const totalMonthlyExpense = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
    setMonthlyExpense(totalMonthlyExpense); // Set the total monthly expense in the state
  } catch (error) {
    console.error('Error fetching monthly expense:', error);
  }
};

  const fetchMonthlyIncome = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3002/api/v1/get-incomes?user_id=6609b5b50b915f3b2267ad0b'
      );
      const incomes = response.data.incomes;
      // Get current month
      const currentMonth = new Date().getMonth() + 1;
      // Filter incomes for the current month
      const currentMonthIncomes = incomes.filter(income => {
        const incomeMonth = new Date(income.date).getMonth() + 1;
        return incomeMonth === currentMonth;
      });
      // Calculate total income for the current month
      const totalCurrentMonthIncome = currentMonthIncomes.reduce((total, income) => total + income.amount, 0);
      setMonthlyIncome(totalCurrentMonthIncome);
    } catch (error) {
      console.error('Error fetching monthly income:', error);
    }
  };
  useEffect(() => {
    fetchMonthlyExpense();
    fetchMonthlyIncome();
  }, [slot]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
      <AnalyticEcommerce
          title="Monthly Expense"
          count={monthlyExpense ? `$${monthlyExpense.toFixed(2)}` : 'Loading...'}
          // Adjust other props as per your component's requirements
        />      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
      <AnalyticEcommerce
          title="Monthly Income"
          count={monthlyIncome ? `$${monthlyIncome.toFixed(2)}` : 'Loading...'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
      <AnalyticEcommerce 
  title="Balance Money" 
  count={`$${(monthlyIncome - monthlyExpense).toFixed(2)}`} 
/>

      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Savings" count="0" />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Expenses & Incomes</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button
                size="small"
                onClick={() => setSlot('month')}
                color={slot === 'month' ? 'primary' : 'secondary'}
                variant={slot === 'month' ? 'outlined' : 'text'}
              >
                Month
              </Button>
              <Button
                size="small"
                onClick={() => setSlot('week')}
                color={slot === 'week' ? 'primary' : 'secondary'}
                variant={slot === 'week' ? 'outlined' : 'text'}
              >
                Week
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <IncomeAreaChart slot={slot} />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Income Overview</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="textSecondary">
                Income Statistics
              </Typography>
              <Typography variant="h3">{monthlyIncome ? `$${monthlyIncome.toFixed(2)}` : 'Loading...'}</Typography>
            </Stack>
          </Box>
          <MonthlyBarChart />
        </MainCard>
      </Grid>

      
      
      
    </Grid>
  );
};

export default DashboardDefault;
