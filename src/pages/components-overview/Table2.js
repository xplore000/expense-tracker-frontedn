import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import AddExpensePopup from '../../components/AddExpensePopup'; // Import the AddExpensePopup component
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import EditIcon from '@mui/icons-material/Edit';  // Import jspdf-autotable

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));



export default function CustomizedTables() {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const tableRef = useRef(null);
  const fetchUpdatedExpenses = async () => {
    try {
      const storedUserId = "6609b5b50b915f3b2267ad0b";
      const response = await axios.get(`http://localhost:3002/api/v1/get-expenses?user_id=${storedUserId}`);
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };
  

  useEffect(() => {
    const fetchIncomeData = async()=>{
      try {
        axios.get('http://localhost:3002/api/v1/get-incomes?user_id=6609b5b50b915f3b2267ad0b')
      .then(response => {
        const apiData = response.data.incomes;
        console.log('API Data:', apiData);
        setIncomes(response.data.incomes)})
      } catch (error) {
        console.error("Error fetching expenses:", error);
          return [];
      }
    }
    const fetchData = async () => {
      try {
        const storedUserId = "6609b5b50b915f3b2267ad0b";
        const response = await axios.get(`http://localhost:3002/api/v1/get-expenses?user_id=${storedUserId}`);
        setExpenses(response.data.expenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        return [];
      }
    };
    fetchData(setExpenses);
    fetchIncomeData(setIncomes)
  }, []);

  const handleDeleteRow = async (expenseId) => {
    try {
      await axios.delete(`http://localhost:3002/api/v1/delete-expense/${expenseId}`);
      setExpenses(expenses.filter((expense) => expense._id !== expenseId));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF(); // Create a new instance of jsPDF
  
    // Calculate total expense for the current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Get the current month (January is 0)
    const totalExpenseCurrentMonth = expenses
      .filter(expense => new Date(expense.date).getMonth() + 1 === currentMonth)
      .reduce((total, expense) => total + expense.amount, 0);
  
   // Calculate total income for the current month
  const totalIncomeCurrentMonth = incomes
  .filter(income => new Date(income.date).getMonth() + 1 === currentMonth)
  .reduce((total, income) => total + income.amount, 0);
  
    // Define table content from expenses data
    const tableContent = expenses.map(expense => [expense.title, expense.category, expense.amount, new Date(expense.date).toLocaleDateString("en-US")]);
  
    // Add heading to the PDF
    doc.text("Expense Tracker Weekly Report", 10, 10); // Text, x, y
  
    // Add total expense and income to the PDF
  doc.text(`Total Expense (Current Month): $${totalExpenseCurrentMonth.toFixed(2)}`, 10, 20); // Text, x, y
  doc.text(`Total Income (Current Month): $${totalIncomeCurrentMonth.toFixed(2)}`, 10, 30); // Text, x, y
  
    // Add the table to the PDF using autoTable
    autoTable(doc, {
      head: [['Title', 'Category', 'Amount', 'Date']], // Table header
      body: tableContent, // Table rows
      startY: 40, // Start table below the heading and total expense/income
      theme: 'grid', // Apply grid theme to the table (optional)
      styles: {
        font: 'helvetica', // Font style (optional)
        fontStyle: 'bold', // Font style (optional)
        fontSize: 10, // Font size (optional)
        textColor: [0, 0, 0], // Text color (optional)
        lineWidth: 0.2, // Line width for grid theme (optional)
      },
      margin: { top: 15 }, // Add margin to the top of the table (optional)
    });
  
    // Save the PDF
    doc.save(`Weekly Expense Report.pdf${currentDate}.pdf`);
  };
  return (
    <div>
      <AddExpensePopup onUpdateExpenses={fetchUpdatedExpenses} />
      <div style={{ position: 'relative' }}>
      <Button variant="contained" onClick={downloadPDF} style={{ 
          bottom: '44px',
          left: '125px'
        }}>Download PDF</Button>
      </div>
      <TableContainer component={Paper}>
        <div ref={tableRef}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell align="right">Category</StyledTableCell>
                <StyledTableCell align="right">Amount</StyledTableCell>
                <StyledTableCell align="right">Date</StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <StyledTableRow key={expense._id}>
                  <StyledTableCell component="th" scope="row">
                    {expense.title}
                  </StyledTableCell>
                  <StyledTableCell align="right">{expense.category}</StyledTableCell>
                  <StyledTableCell align="right">{expense.amount}</StyledTableCell>
                  <StyledTableCell align="right">{new Date(expense.date).toLocaleDateString("en-US")}</StyledTableCell>
                  <StyledTableCell align="right">
                  
                    <Button variant="outlined" color="secondary" onClick={() => handleDeleteRow(expense._id)}>
                      <DeleteIcon />
                    </Button>
                    <span style={{ marginRight: '10px' }}></span>
                    <Button variant="outlined" color="primary" onClick={() => handleEditRow(expense._id)}><EditIcon /></Button>
                  </StyledTableCell>
                  
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TableContainer>
    </div>
  );
}