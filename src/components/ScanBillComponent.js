import React, { useState,useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import axios from 'axios';

import TextField from '@mui/material/TextField';
const fileTypes = ["jpg", "png", "gif","jpeg"];

import Button from '@mui/material/Button';




export default function ScanBillComponent({ onExpenseAdded }) {
  const [file, setFile] = useState(null);
  const [TotalExpense ,setTotalExpense] = useState(0);
  const [newBillName, setNewBillName] = useState("");
  const [title, setTitle] = useState("");

  const handleChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };
  

  const handleNameChange = (event) => {
    setNewBillName(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        alert('Please select a file.');
        return;
      }

      if (!newBillName) {
        alert('Please enter a new bill name.');
        return;
      }

      if (!title) {
        alert('Please enter a title.');
        return;
      }

      const category = "scan";
      const userId = '6609b5b50b915f3b2267ad0b';
      const formData = new FormData();
      const finalFileName = `${newBillName}_${userId}`;
      formData.append('file', file, finalFileName);
      console.log(TotalExpense)
      // Upload file
      const uploadResponse = await axios.post('http://localhost:3002/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("file Uploaded :", uploadResponse.data);
      
      // Fetch expense data
      const expenseResponse = await axios.get('http://localhost:3002/api/v1/text-detection');

      // Calculate total expense
      let total = 0;
      expenseResponse.data.forEach((expense) => {
        if (expense.Type && expense.Type.Text==='PRICE' && expense.ValueDetection && expense.ValueDetection.Text) {
          total += parseFloat(expense.ValueDetection.Text);
        }
      });

      // Save expense data to MongoDB
      const expenseData = {
        user_id: userId,
        category: category,
        bill_name: newBillName,
        title: title,
        amount: total
      };
      await axios.post('http://localhost:3002/api/v1/add-expense', expenseData);

      // Update total expense state
      setTotalExpense(total);
      onExpenseAdded();
      // Display alert for successful upload
      alert('File uploaded successfully! Total Expense: $' + total.toFixed(2));
    } catch (error) {
      console.error('Error:', error);
      alert('Error uploading file');
    }
  };

  useEffect(() => {
    const label = document.querySelector("label[for='fileInput']");
    if (label) {
      label.textContent = "Upload Bill";
    }
  }, []);
  return (
    <Card>
      <CardContent style={{ textAlign: 'center' }}>
        <form>
          <TextField
            type="text"
            placeholder="Enter new bill name"
            value={newBillName}
            onChange={handleNameChange}
            style={{ marginBottom: '10px' }}
          />
          <br />
          <TextField
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={handleTitleChange}
            style={{ marginBottom: '10px' }}
          />
          <br />
          <input
            type="file"
            id="fileInput"
            accept={fileTypes.map(type => `.${type}`).join(',')}
            onChange={handleChange}
          />
          <br />
          {file && (
            <div>
              <p>Selected file: {file.name}</p>
            </div>
          )}
          <br />
          <Button type="button" variant="contained" onClick={handleUpload}>Upload & Calculate Expense</Button>
        </form>
      </CardContent>
    </Card>
  );
}
