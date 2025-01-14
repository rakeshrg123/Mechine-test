import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Grid2,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  createVariant,
  getVariants,
  updateVariant,
  deleteVariant,
} from "../services/variantService";
import NavBar from "./Navbar";
import checkAuth from "./CheckAuth";

const VariantManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const use = JSON.parse(localStorage.getItem("user")); 
  
  const token = use.token ? use.token  : null; 

  const [color, setColor] = useState("");
  const [stock, setStock] = useState("");
  const [variants, setVariants] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState(null);

  useEffect(() => {
    getVariants(id,token)
      .then((response) => {
        setVariants(response.data.variants);
      })
      .catch((err) => setError(err.response.data.message));
  }, [id]);

  const handleAddOrUpdateVariant = (e) => {
    e.preventDefault();
    setLoading(true);

    if (editingVariantId) {
      // Update existing variant
      updateVariant(id, editingVariantId, { color, stock },token)
        .then((response) => {
          setVariants(
            variants.map((variant) =>
              variant._id === editingVariantId ? response.data.variant : variant
            )
          );
          resetForm();
        })
        .catch((err) => setError(err.response.data.message))
        .finally(() => setLoading(false));
    } else {
      // Create new variant
      createVariant(id, { color, stock },token)
        .then((response) => {
          setVariants([...variants, response.data.variant]);
          resetForm();
        })
        .catch((err) => setError(err.response.data.message))
        .finally(() => setLoading(false));
    }
  };

  const handleEditVariant = (variant) => {
    setEditingVariantId(variant._id);
    setColor(variant.color);
    setStock(variant.stock);
  };

  const handleDeleteVariant = (variantId) => {
    setLoading(true);
    deleteVariant(id, variantId,token)
      .then(() => {
        setVariants(variants.filter((variant) => variant._id !== variantId));
      })
      .catch((err) => setError(err.response.data.message))
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setColor("");
    setStock("");
    setEditingVariantId(null);
    setError("");
  };

  return (
    <>
      <NavBar />
      <Container
        maxWidth="sm"
        sx={{
          marginTop: 4,
          backgroundColor: "#fff7e6",
          padding: 4,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Paper elevation={3} sx={{ padding: 3, backgroundColor: "#fff" }}>
          <Typography
            variant="h5"
            align="center"
            sx={{ color: "#ff9800", fontWeight: "bold", marginBottom: 2 }}
          >
            Manage Variants
          </Typography>

          <form onSubmit={handleAddOrUpdateVariant}>
            <Grid2 container spacing={2}>
              <Grid2 item size={12}>
                <TextField
                  label="Color"
                  fullWidth
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  variant="outlined"
                  required
                />
              </Grid2>

              <Grid2 item size={12}>
                <TextField
                  label="Stock Quantity"
                  type="number"
                  fullWidth
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  variant="outlined"
                  required
                />
              </Grid2>

              {error && (
                <Grid2 item size={12}>
                  <Typography color="error">{error}</Typography>
                </Grid2>
              )}

              <Grid2 item size={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    backgroundColor: "#ff9800",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#e68900" },
                  }}
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : editingVariantId
                    ? "Update Variant"
                    : "Add Variant"}
                </Button>
              </Grid2>

              {editingVariantId && (
                <Grid2 item size={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={resetForm}
                    sx={{
                      color: "#ff9800",
                      borderColor: "#ff9800",
                      "&:hover": { backgroundColor: "#fff7e6" },
                    }}
                  >
                    Cancel Edit
                  </Button>
                </Grid2>
              )}
            </Grid2>
          </form>

          <Typography
            variant="h6"
            align="center"
            sx={{
              color: "#ff9800",
              fontWeight: "bold",
              marginTop: 3,
              marginBottom: 2,
            }}
          >
            Existing Variants
          </Typography>
          {variants.length > 0 ? (
            variants.map((variant) => (
              <Paper
                key={variant._id}
                sx={{
                  padding: 2,
                  marginBottom: 2,
                  backgroundColor: "#fff7e6",
                  border: "1px solid #ff9800",
                  borderRadius: 1,
                }}
              >
                <Typography>
                  <strong>Color:</strong> {variant.color} |{" "}
                  <strong>Stock Quantity:</strong> {variant.stock}
                </Typography>
                <Grid2 container spacing={1} sx={{ marginTop: 1 }}>
                  <Grid2 item size={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#ff9800",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#e68900" },
                      }}
                      onClick={() => handleEditVariant(variant)}
                    >
                      Edit
                    </Button>
                  </Grid2>
                  <Grid2 item size={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#f44336",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#d32f2f" },
                      }}
                      onClick={() => handleDeleteVariant(variant._id)}
                    >
                      Delete
                    </Button>
                  </Grid2>
                </Grid2>
              </Paper>
            ))
          ) : (
            <Typography>No variants available.</Typography>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default checkAuth(VariantManagement);
