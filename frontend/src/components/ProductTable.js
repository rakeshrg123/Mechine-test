import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Grid2,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { fetchProducts} from "../services/productService";
import { addToCart } from "../services/cartService";
import "../style/ProductList.scss";
import NavBar from "./Navbar";
import { useSelector } from "react-redux";
import checkAuth from "./CheckAuth";

const ListingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const user = useSelector((state) => state.auth?.user?.user || null);

  const use = JSON.parse(localStorage.getItem("user")); 
  
  const token = use.token ? use.token  : null; 

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Fetch products with search query
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const response = await fetchProducts(searchQuery,token);
        setProducts(response.products);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products.");
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [searchQuery]);

  const handleAddToCart = async (productId) => {
    const product = products.find((product) => product._id === productId);
    console.log(product);
    
    const variant = product.variants.find(
      (variant) => variant.color === selectedVariant.color
    );
  
    if (!variant) {
      alert("Please select a variant.");
      return;
    }
  
    try {
      const userId = user._id
      await addToCart(userId, productId, variant._id, quantity,token);
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      alert(error.message);
    }
  };
  
  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
    <NavBar></NavBar>
    <Container maxWidth="lg" className="product-list-container">
      {/* Search Bar */}
      <FormControl fullWidth margin="normal">
        <TextField
          label="Search Products"
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          fullWidth
          sx={{ backgroundColor: '#f5f5f5' }}
        />
      </FormControl>

      {products.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center" style={{ marginTop: "20px" }}>
          No products found.
        </Typography>
      ) : (
        <Grid2 container spacing={2}>
          {products.map((product) => (
            <Grid2 item size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
              <Card className="product-card" sx={{ display: 'flex', flexDirection: 'column', padding: '20px', borderRadius: '8px', boxShadow: 3 }}>
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '15px' }}>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', marginBottom: '15px' }}>
                    ${product.price}
                  </Typography>

                  {/* Variant Selection */}
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Color</InputLabel>
                    <Select
                      value={selectedVariant.color || ""}
                      onChange={(e) =>
                        setSelectedVariant({
                          ...selectedVariant,
                          color: e.target.value,
                        })
                      }
                      required
                      sx={{ backgroundColor: '#f5f5f5' }}
                    >
                      {product.variants.map((variant) => (
                        <MenuItem key={variant.id} value={variant.color}>
                          {variant.color}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Quantity Input */}
                  <TextField
                    type="number"
                    label="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputProps={{ inputProps: { min: 1 } }}
                    sx={{ backgroundColor: '#f5f5f5', marginBottom: '15px' }}
                  />

                  {/* Add to Cart Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleAddToCart(product._id)}
                    sx={{
                      backgroundColor: '#1976d2',
                      '&:hover': {
                        backgroundColor: '#115293',
                      },
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      )}
    </Container>
    </>
  );
};

export default checkAuth(ListingProducts);
