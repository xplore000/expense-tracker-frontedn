import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import Expense from "./Expense"; // Importing Expense component
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";

const TableComponent = () => {
  const [expenses, setExpenses] = useState([]);
  const [showExpensePopup, setShowExpensePopup] = useState(false);
  const [filterBy, setFilterBy] = useState(null); 
  const [showFilterDropdown, setShowFilterDropdown] = useState(false); // Track whether the filter dropdown is shown
 // Track the current filtering method// Track the current filtering method

  const fetchData = async () => {
    try {
      const storedUserId = '6609b5b50b915f3b2267ad0b';

      const response = await axios.get(
        `http://localhost:3002/api/v1/get-expenses?user_id=${storedUserId}`
      );
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (expenseId) => {
    try {
      await axios.delete(`http://localhost:3002/api/v1/delete-expense/${expenseId}`);
      message.success("Expense Deleted");
      setExpenses(expenses.filter((expense) => expense._id !== expenseId));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleAddProductClick = () => {
    setShowExpensePopup(true);
  };

  const handleFilter = (filterType) => {
    let filteredExpenses = [...expenses];

    switch (filterType) {
      case "high":
        filteredExpenses = filteredExpenses.sort((a, b) => b.amount - a.amount);
        break;
      case "low":
        filteredExpenses = filteredExpenses.sort((a, b) => a.amount - b.amount);
        break;
      case "old":
        filteredExpenses = filteredExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "new":
        filteredExpenses = filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      default:
        break;
    }

    setExpenses(filteredExpenses);
    setFilterBy(filterType);
  };

  return (
    <section className="p-6">
      {showExpensePopup && <Expense onClose={() => setShowExpensePopup(false)} />}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-6">
          <Button
            variant="contained"
            onClick={handleAddProductClick}
            sx={{ mr: 2 }}
          >
            Add Expense
          </Button>
          {/* Dropdown button for filtering */}
          <div className="relative">
            <Button
              variant="contained"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              endIcon={<MoreVertIcon />}
            >
              Filter
            </Button>
            {/* Dropdown menu */}
            <Menu
              anchorEl={showFilterDropdown}
              open={Boolean(showFilterDropdown)}
              onClose={() => setShowFilterDropdown(false)}
            >
              <MenuItem
                onClick={() => handleFilter("high")}
                selected={filterBy === "high"}
              >
                High
              </MenuItem>
              <MenuItem
                onClick={() => handleFilter("low")}
                selected={filterBy === "low"}
              >
                Low
              </MenuItem>
              <MenuItem
                onClick={() => handleFilter("old")}
                selected={filterBy === "old"}
              >
                Old to New
              </MenuItem>
              <MenuItem
                onClick={() => handleFilter("new")}
                selected={filterBy === "new"}
              >
                New to Old
              </MenuItem>
            </Menu>
          </div>
        </div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>
                    {new Date(expense.date).toLocaleDateString("en-US")}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleDelete(expense._id)}
                      aria-label="delete"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </section>
  );
};

export default TableComponent;
