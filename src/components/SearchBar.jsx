// src/components/SearchBar.jsx
import React from 'react';
import { TextField } from '@mui/material';

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <TextField
      label="Search Items"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      fullWidth
    />
  );
}

export default SearchBar;
