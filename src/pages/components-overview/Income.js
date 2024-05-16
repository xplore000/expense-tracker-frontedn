import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
const Income = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showExtraIncomeForm, setShowExtraIncomeForm] = useState(false);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '',
    title: '',
    category: '',
    amount: 0
  });

  useEffect(() => {
    // Fetch user_id from localStorage when the component mounts
    const storedUserId = '6609b5b50b915f3b2267ad0b';
    if (storedUserId) {
      setUserId(storedUserId);
      setFormData({ ...formData, user_id: storedUserId });
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleAddIncome = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3002/api/v1/add-income', formData)
      .then((response) => {
        if (response.status === 200) {
          setMonthlyIncome(formData.amount);
          setShowModal(false);
          displayAlert('Income added successfully');
          setFormData({
            user_id: '',
            title: '',
            category: '',
            amount: 0
          });
        } else {
          throw new Error('Failed to add income');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleEditIncome = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3002/api/v1/edit-income/${formData.id}`, formData)
      .then((response) => {
        if (response.status === 200) {
          setMonthlyIncome(formData.amount);
          setShowModal(false);
          alert('Income updated successfully');
          setFormData({
            user_id: '',
            title: '',
            category: '',
            amount: 0
          });
        } else {
          throw new Error('Failed to update income');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleUpdateMonthlyIncome = () => {
    axios
      .get(`http://localhost:3002/api/v1/get-incomes?user_id=${userId}`)
      .then((response) => {
        if (response.status === 200) {
          const incomes = response.data.incomes;
          console.log(incomes);
          // your logic for updating monthly income
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1;
          const currentYear = currentDate.getFullYear();

          // Filter income records for the current month
          const currentMonthIncome = incomes.filter((income) => {
            const incomeDate = new Date(income.date);
            return incomeDate.getMonth() + 1 === currentMonth && incomeDate.getFullYear() === currentYear;
          });
          console.log(monthlyIncome);

          if (currentMonthIncome.length > 0) {
            // If there are income records for the current month, use the first record to populate the form fields for editing
            const firstIncomeRecord = currentMonthIncome[0];
            setFormData({
              id: firstIncomeRecord._id, // Storing the ID of the income record being edited
              user_id: userId,
              title: firstIncomeRecord.title,
              category: firstIncomeRecord.category,
              amount: firstIncomeRecord.amount
            });
          } else {
            throw new Error('Failed to fetch income details');
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to fetch income details');
      });
  };

  const handleUpdateIncome = () => {
    setShowModal(true);
  };
  const handleAddExtraIncome = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3002/api/v1/add-extra-income', formData)
      .then((response) => {
        if (response.status === 200) {
          alert('Extra income added successfully');
          setShowExtraIncomeForm(false)
          setFormData({
            user_id: '',
            title: '',
            category: '',
            amount: 0
          });
        } else {
          throw new Error('Failed to add extra income');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  const onClose = () => {
    setShowModal(false);
    setShowExtraIncomeForm(false)
    setFormData({
      user_id: userId,
      title: '',
      category: '',
      amount: 0
    });
  };

  const handleExtraIncome = () => {
    setShowExtraIncomeForm(true);
  };
  return (
    <>
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={handleUpdateIncome}>
          Set Monthly Income
        </Button>
        <Button variant="contained" onClick={handleUpdateMonthlyIncome}>
          Update Monthly Income
        </Button>
        <Button variant="contained" onClick={handleExtraIncome}>
          Add Extra Income
        </Button>
      </Stack>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-full max-w-md p-5 bg-gray-100 dark:bg-gray-100 border border-gray-300 dark:border-gray-700 shadow-md rounded-lg">
            <button onClick={onClose} className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">{formData.id ? 'Edit' : 'Add'} Income</h2>
            <form onSubmit={formData.id ? handleEditIncome : handleAddIncome}>
              <div className="mb-5">
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-white::placeholder"
                  placeholder="Title"
                  required
                  style={{ '::placeholder': { color: 'white' } }}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 text-white"
                  placeholder="Category"
                  required
                  style={{ '::placeholder': { color: 'white' } }}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 text-white"
                  placeholder="Amount"
                  required
                />
              </div>
              <Button
                type="submit"
                variant="outlined"
                className="w-full py-2 px-4 bg-primary-500 text-gray rounded-lg transition duration-300 hover:bg-gray-200 focus:outline-none focus:bg-primary-600"
              >
                {formData.id ? 'Edit' : 'Add'} Income
              </Button>
            </form>
          </div>
        </div>
      )}
      {showExtraIncomeForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-full max-w-md p-5 bg-gray-100 dark:bg-gray-100 border border-gray-300 dark:border-gray-700 shadow-md rounded-lg">
            <button onClick={onClose} className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">Add Extra Income</h2>
            <form onSubmit={handleAddExtraIncome}>
              <div className="mb-5">
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-white::placeholder"
                  placeholder="Title"
                  required
                  style={{ '::placeholder': { color: 'white' } }}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 text-white"
                  placeholder="Category"
                  required
                  style={{ '::placeholder': { color: 'white' } }}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 text-white"
                  placeholder="Amount"
                  required
                />
              </div>
              <Button
                type="submit"
                variant="outlined"
                className="w-full py-2 px-4 bg-primary-500 text-gray rounded-lg transition duration-300 hover:bg-gray-200 focus:outline-none focus:bg-primary-600"
              >
                Add Income
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Income;
