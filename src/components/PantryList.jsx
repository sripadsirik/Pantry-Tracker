// src/components/PantryList.jsx
import React, { useEffect, useState } from 'react';
import { db, storage } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { List, ListItem, ListItemText, IconButton, Box, Typography, Card, CardContent, Button, CardMedia, TextField, Grid, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SearchBar from './SearchBar';
import AddItemForm from './AddItemForm';
import { searchRecipe } from '../utils/searchRecipe';

function PantryList() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [error, setError] = useState('');
  const [recipes, setRecipes] = useState([]);

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
    const itemDoc = doc(db, 'pantryItems', id);
    const itemSnapshot = await getDoc(itemDoc);

    if (itemSnapshot.exists()) {
      const itemData = itemSnapshot.data();
      if (itemData.imageUrl) {
        const imageRef = ref(storage, itemData.imageUrl);
        await deleteObject(imageRef)
          .then(() => {
            console.log("Image deleted successfully");
          })
          .catch((error) => {
            console.error("Error deleting image: ", error);
          });
      }
      await deleteDoc(itemDoc)
        .then(() => {
          setItems(items.filter((item) => item.id !== id));
        })
        .catch((error) => {
          console.error("Error deleting document: ", error);
        });
    }
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

  const handleSearchRecipe = async () => {
    const pantryItems = items.map(item => item.name);
    const recipeResults = await searchRecipe(pantryItems);
    setRecipes(recipeResults);
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
                    {item.imageUrl && (
                      <CardMedia
                        component="img"
                        sx={{ width: 100, height: 100, objectFit: 'cover', mr: 2 }}
                        image={item.imageUrl}
                        alt={item.name}
                      />
                    )}
                    <ListItemText primary={item.name} secondary={`Quantity: ${item.quantity}`} />
                    {item.classification && (
                      <Typography variant="body2" color="textSecondary">
                        Classification: {item.classification}
                      </Typography>
                    )}
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
      <Button onClick={handleSearchRecipe} variant="contained" color="primary" sx={{ mt: 4 }}>
        Search Recipes
      </Button>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {recipes.map((recipe, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ boxShadow: 3 }}>
              <CardMedia
                component="img"
                sx={{ height: 140 }}
                image={recipe.image}
                alt={recipe.label}
              />
              <CardContent>
                <Typography variant="h6">{recipe.label}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {recipe.ingredients.join(', ')}
                </Typography>
                <Button
                  size="small"
                  color="primary"
                  href={recipe.url}
                  target="_blank"
                  sx={{ mt: 2 }}
                >
                  View Recipe
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* <AddItemForm /> */}
    </div>
  );
}

export default PantryList;
