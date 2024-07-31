// src/components/PantryList.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { List, ListItem, ListItemText, IconButton, TextField, Box, Typography, Card, CardContent, CardActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SearchBar from './SearchBar';

function PantryList() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pantryItems'), (snapshot) => {
      const itemsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemsList);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'pantryItems', id));
    setItems(items.filter((item) => item.id !== id));
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditName(item.name);
    setEditQuantity(item.quantity);
  };

  const handleUpdate = async (id) => {
    if (editQuantity < 0) {
      setError('Quantity cannot be negative');
      return;
    }
    const itemDoc = doc(db, 'pantryItems', id);
    await updateDoc(itemDoc, {
      name: editName,
      quantity: parseInt(editQuantity),
    });
    setEditId(null);
    setEditName('');
    setEditQuantity('');
    setError('');
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <List>
        {filteredItems.map((item) => (
          <Card key={item.id} sx={{ mb: 2, boxShadow: 3 }}>
            <CardContent>
              <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {editId === item.id ? (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1 }}>
                    <TextField
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      fullWidth
                      variant="outlined"
                    />
                    <TextField
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(e.target.value)}
                      required
                      type="number"
                      fullWidth
                      variant="outlined"
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    <IconButton onClick={() => handleUpdate(item.id)}>
                      <SaveIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <ListItemText primary={item.name} secondary={`Quantity: ${item.quantity}`} />
                    <Box>
                      <IconButton onClick={() => handleEdit(item)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </>
                )}
              </ListItem>
            </CardContent>
          </Card>
        ))}
      </List>
    </div>
  );
}

export default PantryList;
