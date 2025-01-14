import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Alert,
  Paper,
  useMediaQuery,
  useTheme,
  InputLabel,
} from "@mui/material";
import { useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../services/productService";
import NavBar from "./Navbar";
import checkAuth from "./CheckAuth";

const AdminDashbord = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState({});
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth?.user?.user || null);
  const { loading: authLoading } = useSelector((state) => state.auth.user);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch products on mount
  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch products.");
        setLoading(false);
      });
  }, []);

  // Handle delete product
  const handleDelete = (productId) => {
    deleteProduct(productId)
      .then(() => {
        setProducts(products.filter((product) => product._id !== productId));
        alert("Product deleted successfully.");
      })
      .catch(() => alert("Failed to delete product."));
  };

  const handleEdit = (product) => {
    navigate("/edit-product", { state: { product } });
  };

  // Loading or error states
  if (loading || authLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const isAdmin = user?.role === "admin";

  return (
    <>
    <NavBar></NavBar>
    <Container maxWidth="lg" className="product-list-container" style={{ backgroundColor: "#fff" }}>
      <TableContainer component={Paper} style={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Variant</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <Typography variant="h6" style={{ color: "#FF7F32" }}>
                    {product.name}
                  </Typography>
                </TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>
                  <Typography variant="h6" color="primary">
                    ${product.price}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" color="primary">
                    {product.variants.map((variant) => (
                        variant.stock
                    ))}
                  </Typography>
                </TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel id={`color-label-${product._id}`}>Color</InputLabel>
                    <Select
                      labelId={`color-label-${product._id}`}
                      value={selectedVariant[product._id]?.color || ""}
                      onChange={(e) =>
                        setSelectedVariant({
                          ...selectedVariant,
                          [product._id]: { color: e.target.value },
                        })
                      }
                      label="Color"
                    >
                      {product.variants.map((variant) => (
                        <MenuItem key={variant._id} value={variant.color}>
                          {variant.color}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <div style={{ display: "flex", flexDirection: isSmallScreen ? "column" : "row" }}>
                    {isAdmin && (
                      <>
                          <Button
                            variant="outlined"
                            color="error"
                            style={{marginRight:'8px'}}
                            
                          >
                            <Link style={{textDecoration:'none',color:'#FF7F32'}} to={`/variant-managment/${product._id}`}>Variant management</Link>
                            
                          </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleEdit(product)}
                          style={{
                            marginRight: isSmallScreen ? "0" : "8px",
                            marginBottom: isSmallScreen ? "8px" : "0",
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
    </>
  );
};

export default checkAuth( AdminDashbord);
