import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import { ShoppingCart, AddCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/authSlice'; 
import { getCartCount } from '../services/cartService'; 

const NavBar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);

  const user = useSelector((state) => state.auth?.user?.user || null);

  // Dispatch to trigger logout action
  const dispatch = useDispatch();

  const isMobile = useMediaQuery('(max-width:600px)');

  // Fetch cart count when user is available
  useEffect(() => {
    if (user && user._id) {
      getCartCount(user._id)
        .then((res) => {
          setCartCount(res.data.count);
        })
        .catch((error) => console.error("Error fetching cart count:", error));
    }
  }, [user]);

  // Handle Drawer open and close
  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  // Handle logout action
  const handleLogout = () => {
    dispatch(removeUser());
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#ff9800', color: 'white' }}>
      <Toolbar>
        {/* Brand Name */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="#" style={{ textDecoration: 'none', color: 'white' }}>
            E-Commerce
          </Link>
        </Typography>

        {/* Links for Normal Users */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Only show List Products button if user is logged in */}
            {user && (
              <Button color="inherit" component={Link} to="/list-product">
                List Products
              </Button>
            )}

            {/* Conditional Links for Logged-in Users */}
            {user ? (
              <>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
                {user.role === 'admin' && (
                  <>
                    <Button color="inherit" component={Link} to="/admin-dashboard">
                      Admin Dashboard
                    </Button>
                    <Button color="inherit" component={Link} to="/add-product">
                      <AddCircle /> Add Product
                    </Button>
                  </>
                )}
              </>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            )}

            {/* Cart Icon */}
            <IconButton color="inherit" component={Link} to="/cart">
              <Badge badgeContent={cartCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </div>
        )}

        {/* Mobile Drawer */}
        {isMobile && (
          <IconButton color="inherit" onClick={toggleDrawer}>
            ☰
          </IconButton>
        )}

        <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer}>
          <List>
            <ListItem button component={Link} to="/list-products">
              <ListItemText primary="List Products" />
            </ListItem>
            {user ? (
              <>
                <ListItem button onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItem>
                {user.role === 'admin' && (
                  <>
                    <ListItem button component={Link} to="/admin-dashboard">
                      <ListItemText primary="Admin Dashboard" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/add-product">
                      <ListItemText primary="Add Product" />
                    </ListItem>
                  </>
                )}
              </>
            ) : (
              <ListItem button component={Link} to="/login">
                <ListItemText primary="Login" />
              </ListItem>
            )}
            <ListItem button component={Link} to="/cart">
              <ListItemText primary={`Cart (${cartCount})`} />
            </ListItem>
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
