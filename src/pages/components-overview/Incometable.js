import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import axios from 'axios';
  // Import jspdf-autotable

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
  const [incomes, setIncomes] = useState([]);
  const tableRef = useRef(null);
  

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
    fetchIncomeData(setIncomes)
  }, []);
  return (
    <div>
      <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
        <div ref={tableRef}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell align="right">Category</StyledTableCell>
                <StyledTableCell align="right">Amount</StyledTableCell>
                <StyledTableCell align="right">Date</StyledTableCell>
              
                
              </TableRow>
            </TableHead>
            <TableBody>
              {incomes.map((income) => (
                <StyledTableRow key={income._id}>
                  <StyledTableCell component="th" scope="row">
                    {income.title}
                  </StyledTableCell>
                  <StyledTableCell align="right">{income.category}</StyledTableCell>
                  <StyledTableCell align="right">{income.amount}</StyledTableCell>
                  <StyledTableCell align="right">{new Date(income.date).toLocaleDateString("en-US")}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TableContainer>
    </div>
  );
}