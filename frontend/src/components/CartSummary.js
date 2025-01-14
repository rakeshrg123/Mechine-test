import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Edit, Delete, ClearAll } from "@mui/icons-material"; // Material UI Icons
import { getCart, removeCartItem, checkout, updateCartItem, clearCart } from "../services/cartService";
import "../style/cart.scss";
import { useSelector } from "react-redux";
import NavBar from "./Navbar";
import checkAuth from "./CheckAuth";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null); // To track item being edited
  const [quantity, setQuantity] = useState(1);
  
  // Retrieve user information from localStorage
  const user = JSON.parse(localStorage.getItem("user")); 
  const userId = user ? user.user._id : null; // Get user ID from localStorage
  const token = user ? user.token : null;  // Get user token from localStorage

  useEffect(() => {
    // If the user is not logged in, don't fetch the cart and show an error
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await getCart(userId, token);
        setCart(response.cart); // Set the cart data
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch cart items.");
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId, token]);

  // Checkout Handler
  const handleCheckout = async () => {
    try {
      await checkout(userId, token);
      alert("Checkout successful!");
      setCart(null);
    } catch (err) {
      alert("Failed to complete checkout. Please try again.");
    }
  };

  // Remove item from cart handler
  const handleRemoveItem = async (productId, variantId) => {
    try {
      await removeCartItem(userId, productId, variantId, token);
      setCart({
        ...cart,
        items: cart.items.filter(
          (item) => item.productId !== productId || item.variantId !== variantId
        ),
      });
      alert("Item removed successfully!");
    } catch (err) {
      alert("Failed to remove item. Please try again.");
    }
  };

  // Edit cart item quantity handler
  const handleEditItem = (item) => {
    setEditItem(item);
    setQuantity(item.quantity);
  };

  // Save edited item
  const handleSaveEdit = async () => {
    try {
      await updateCartItem(userId, { itemId: editItem.id, quantity }, token);
      setCart({
        ...cart,
        items: cart.items.map((item) =>
          item.id === editItem.id ? { ...item, quantity } : item
        ),
      });
      alert("Item updated successfully!");
      setEditItem(null);
    } catch (err) {
      alert("Failed to update item. Please try again.");
    }
  };

  // Clear all items from the cart
  const handleClearCart = async () => {
    try {
      await clearCart(userId, token);
      setCart({ items: [] });
      alert("Cart cleared successfully!");
    } catch (err) {
      alert("Failed to clear cart. Please try again.");
    }
  };

  if (loading) return <CircularProgress className="cart-loader" />;
  if (error) return <Alert severity="error">{error}</Alert>;

  // Show message if cart is empty
  if (!cart || cart.items.length === 0) {
    return (
      <Typography variant="h6" align="center" className="cart-empty-message">
        Your cart is empty.
      </Typography>
    );
  }

  return (
    <>
      <NavBar />
      <Container maxWidth="md" className="cart-container">
        <Typography variant="h4" gutterBottom align="center" className="cart-heading">
          Your Cart
        </Typography>

        <TableContainer component={Card} className="cart-table-container">
          <Table>
            <TableHead>
              <TableRow className="cart-table-header">
                <TableCell>Product</TableCell>
                <TableCell>Variant</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.items.map((item) => (
                <TableRow key={item.variantId}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.variantName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="edit"
                      className="cart-action-button"
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit className="edit-icon" />
                    </IconButton>
                    <IconButton
                      aria-label="remove"
                      className="cart-action-button"
                      onClick={() => handleRemoveItem(item.productId, item.variantId)}
                    >
                      <Delete className="remove-icon" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" align="right" className="cart-total-price">
          Total: $
          {cart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          ).toFixed(2)}
        </Typography>

        <Button
          variant="contained"
          fullWidth
          onClick={handleCheckout}
          className="cart-checkout-button"
        >
          Checkout
        </Button>

        <Button
          variant="outlined"
          fullWidth
          onClick={handleClearCart}
          className="cart-clear-button"
          startIcon={<ClearAll />}
        >
          Clear Cart
        </Button>

        {editItem && (
          <Dialog open onClose={() => setEditItem(null)}>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogContent>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditItem(null)}>Cancel</Button>
              <Button onClick={handleSaveEdit} variant="contained" color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Container>
    </>
  );
};

export default checkAuth(Cart);
