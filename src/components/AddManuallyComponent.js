import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function AddManuallyComponent({ onCancel, onExpenseAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    amount: 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = '6609b5b50b915f3b2267ad0b';
      if (!userId) {
        console.error('User ID not found in localStorage');
        return;
      }

      const expenseData = { ...formData, user_id: userId };

      await axios.post('http://localhost:3002/api/v1/add-expense', expenseData);

      // Reset form after successful submission
      setFormData({ title: '', category: '', amount: 0 });

      // Notify the parent component that an expense has been added
      onExpenseAdded();

      // Show success toast
      toast.success('Expense added successfully');
    } catch (error) {
      console.error('Error adding expense:', error.message);
      // Show error toast
      toast.error('Failed to add expense. Please try again later.');
    }
  };

  return (
    <Card>
      <CardContent>
        <h2>Add Expense Manually</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            id="title"
            name="title"
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <TextField
            id="category"
            name="category"
            label="Category"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <TextField
            id="amount"
            name="amount"
            label="Amount"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
          <Button type="button" onClick={onCancel} variant="contained" style={{ marginLeft: '8px' }}>
            Cancel
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
