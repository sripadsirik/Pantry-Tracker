// src/App.jsx
import React from 'react';
import { ThemeProvider, CssBaseline, Container, Typography, Box, Paper } from '@mui/material';
import AddItemForm from './components/AddItemForm';
import PantryList from './components/PantryList';
import theme from './theme';
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper style={{ minHeight: '100vh', padding: '2rem', backgroundColor: theme.palette.background.default }}>
        <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
            <Typography variant="h1" align="center" gutterBottom>
              Pantry Tracker
            </Typography>
            <AddItemForm />
            <PantryList />
          </Box>
        </Container>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
