import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, Grid2, Typography, Box, IconButton } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { createProduct,updateProduct } from "../services/productService";
import "../style/ProductForm.scss";
import NavBar from "./Navbar";
import { useLocation } from "react-router-dom";
import checkAuth from "./CheckAuth";

const ProductForm = ( ) => {
  const location = useLocation();
  const product = location.state?.product || null;
  console.log(product);
  
  const [name, setName] = useState(product ? product.name : "");
  const [price, setPrice] = useState(product ? product.price : "");
  const [description, setDescription] = useState(product ? product.description : "");
  const [variants, setVariants] = useState(product ? product.variants : [{ color: "", stock: 0 }]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth?.user?.token); 

  const handleAddVariant = () => {
    setVariants([...variants, { color: "", stock: 0 }]);
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = variants.map((variant, i) =>
      i === index ? { ...variant, [field]: value } : variant
    );
    setVariants(updatedVariants);
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = { name, description, price, variants };

    if (product) {
      // Update Product
      updateProduct(product._id, productData,token)
        .then(() => {
          setSuccessMessage("Product updated successfully!");
          setError(null);
        })
        .catch((err) => {
          console.error(err);
          setError(err.response?.data?.message || "Failed to update product.");
          setSuccessMessage(null);
        });
    } else {
      // Create Product
      createProduct(productData, token)
        .then(() => {
          setSuccessMessage("Product created successfully!");
          setError(null);

          // Reset form fields
          setName("");
          setPrice("");
          setDescription("");
          setVariants([{ color: "", stock: 0 }]);
        })
        .catch((err) => {
          console.error(err);
          setError(err.response?.data?.message || "Failed to create product.");
          setSuccessMessage(null);
        });
    }
  };
  return (
    <>
    <NavBar></NavBar>
    <Box className="product-form">
      <Typography variant="h4" className="form-title">
        {product ? "Update Product" : "Add Product"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          {/* Product Name */}
          <Grid2 item size={{ xs: 12 }}>
            <TextField
              label="Product Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              inputProps={{ minLength: 3, maxLength: 100 }}
            />
          </Grid2>

          {/* Description */}
          <Grid2 item size={{ xs: 12 }}>
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              inputProps={{ maxLength: 500 }}
            />
          </Grid2>

          {/* Price */}
          <Grid2 item size={{ xs: 12, md: 6 }}>
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              inputProps={{ min: 0 }}
            />
          </Grid2>

          {/* Variants */}
          <Grid2 item size={{ xs: 12 }}>
            <Typography variant="h6" className="section-title">
              Variants
            </Typography>
            {variants.map((variant, index) => (
              <Grid2 container spacing={2} key={index} className="variant-item">
                <Grid2 item size={{ xs: 5 }}>
                  <TextField
                    label="Color"
                    fullWidth
                    value={variant.color}
                    onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                    required
                  />
                </Grid2>
                <Grid2 item size={{ xs: 5 }}>
                  <TextField
                    label="Stock"
                    type="number"
                    fullWidth
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                    required
                    inputProps={{ min: 0 }}
                  />
                </Grid2>
                <Grid2 item size={2}>
                  <IconButton onClick={() => handleRemoveVariant(index)}>
                    <Remove />
                  </IconButton>
                </Grid2>
              </Grid2>
            ))}
            <Button
              startIcon={<Add />}
              onClick={handleAddVariant}
              className="add-variant-button"
            >
              Add Variant
            </Button>
          </Grid2>

          {/* Submit Button */}
          <Grid2 item size={{ xs: 12 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              className="submit-button"
            >
              {product ? "Update Product" : "Add Product"}
            </Button>
          </Grid2>
        </Grid2>

        {/* Error and Success Messages */}
        {error && <Typography className="error-message">{error}</Typography>}
        {successMessage && (
          <Typography className="success-message">{successMessage}</Typography>
        )}
      </form>
    </Box>
    </>
  );
};

export default checkAuth(ProductForm);
