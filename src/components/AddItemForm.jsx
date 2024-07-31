// src/components/AddItemForm.jsx
import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function AddItemForm() {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity < 0) {
      setError('Quantity cannot be negative');
      return;
    }
    if (itemName && quantity) {
      try {
        await addDoc(collection(db, 'pantryItems'), {
          name: itemName,
          quantity: parseInt(quantity),
        });
        setItemName('');
        setQuantity('');
        setError('');
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
      <TextField
        label="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        required
        fullWidth
        variant="outlined"
      />
      <TextField
        label="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
        type="number"
        fullWidth
        variant="outlined"
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button type="submit" variant="contained" color="primary">
        Add Item
      </Button>
    </Box>
  );
}

export default AddItemForm;
