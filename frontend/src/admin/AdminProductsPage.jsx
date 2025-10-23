import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axios from "axios";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    reference: "",
    price: "",
    category: "",
    images: [],
    stock: "",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      setError(err);
      showSnackbar("Error loading products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        reference: product.reference,
        price: product.price,
        category: product.category,
        images: product.images || [],
        stock: product.stock,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        reference: "",
        price: "",
        category: "",
        images: [],
        stock: ""
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check total images won't exceed 5
    if (formData.images.length + files.length > 5) {
      showSnackbar(`Maximum 5 images allowed. You have ${formData.images.length} already.`, "error");
      return;
    }

    setUploading(true);

    try {
      const uploadFormData = new FormData();
      Array.from(files).forEach(file => {
        uploadFormData.append('images', file);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/upload-product-images`,
        uploadFormData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        const newImageUrls = response.data.images;
        
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImageUrls]
        }));

        showSnackbar(`Uploaded ${newImageUrls.length} image(s)`, "success");
      } else {
        showSnackbar(response.data.message || "Upload failed", "error");
      }
    } catch (err) {
      console.error('Upload error:', err);
      showSnackbar("Error uploading images", "error");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return {
        ...prev,
        images: newImages
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.reference || !formData.price || !formData.category || !formData.stock) {
      showSnackbar("Please fill in all required fields", "error");
      return;
    }

    if (formData.images.length === 0) {
      showSnackbar("Please upload at least one product image", "error");
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        reference: formData.reference,
        price: parseInt(formData.price),
        category: formData.category,
        images: formData.images,
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/admin/update/product/${editingProduct._id}`, 
          productData, 
          { withCredentials: true }
        );
        showSnackbar("Product updated successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/admin/add/product`, 
          productData, 
          { withCredentials: true }
        );
        showSnackbar("Product added successfully!");
      }

      handleCloseDialog();
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      showSnackbar("Error saving product", "error");
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/admin/delete/product/${productId}`, 
          { withCredentials: true }
        );
        showSnackbar("Product deleted successfully!");
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        showSnackbar("Error deleting product", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#ffffff] to-[#949494] text-white pb-20">
      {/* Header */}
      <div className="container mx-auto px-6 pt-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl brand-title">Product Management</h1>
          <Button
            variant="contained"
            onClick={() => handleOpenDialog()}
            style={{
              backgroundColor: '#000000',
              color: '#ffffff',
              padding: '10px 20px',
              textTransform: 'none',
              fontSize: '1.3rem'
            }}
          >
            <i className="fas fa-plus mr-2"></i>
            Add New Product
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="container mx-auto px-6">
        <div className="bg-[#000000] rounded-2xl p-6 shadow-lg border border-[#f8f3e9]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f8f3e9]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 text-xl mb-4">Error loading products</p>
              <Button
                onClick={fetchProducts}
                style={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: '1px solid #f8f3e9',
                  padding: '10px 20px',
                  textTransform: 'none'
                }}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-2xl">
                <thead>
                  <tr className="border-b border-white">
                    <th className="text-left p-4 creamy">Image</th>
                    <th className="text-left p-4 creamy">Name</th>
                    <th className="text-left p-4 creamy">Reference</th>
                    <th className="text-left p-4 creamy">Category</th>
                    <th className="text-left p-4 creamy">Price</th>
                    <th className="text-left p-4 creamy">Stock</th>
                    <th className="text-left p-4 creamy">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} className="border-b border-white hover:bg-[#141414] hover:cursor-pointer">
                      <td className="p-4">
                        {product.images && product.images.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {product.images.slice(0, 3).map((image, index) => (
                              <img 
                                key={index}
                                src={image} 
                                alt={`${product.name} ${index + 1}`} 
                                className="w-12 h-12 object-cover rounded fit-cover"
                              />
                            ))}
                            {product.images.length > 3 && (
                              <div className="w-12 h-12 bg-[#ffffff] flex items-center justify-center rounded text-xs">
                                +{product.images.length - 3}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-700 flex items-center justify-center rounded">
                            <i className="fas fa-image text-gray-400"></i>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-normal break-words capitalize">{product.name}</td>
                      <td className="px-4 py-3 whitespace-normal break-words capitalize">{product.reference}</td>
                      <td className="px-4 py-3 whitespace-normal break-words capitalize">{product.category}</td>
                      <td className="px-4 py-3 whitespace-normal break-words capitalize">{product.price} DZD</td>
                      <td className="px-4 py-3 whitespace-normal break-words capitalize">
                        <span className={`px-2 py-1 rounded-full text-md ${
                          product.stock > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                        }`}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-6">
                          <button
                            onClick={() => handleOpenDialog(product)}
                            className="text-blue-400 hover:text-blue-300 hover:cursor-pointer"
                            title="Edit"
                          >
                            <i className="fas fa-edit text-3xl"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-400 hover:text-red-300 hover:cursor-pointer"
                            title="Delete"
                          >
                            <i className="fas fa-trash text-3xl"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <div className="bg-[#000000] text-white px-4 py-8">
          <DialogTitle className="text-4xl creamy">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4 flex flex-col gap-8">
              {/* Name */}
              <TextField
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                fullWidth
                InputLabelProps={{ style: { color: '#f8f3e9', fontSize: '1.15rem' } }}
                inputProps={{ style: { color: 'white', fontSize: '1.3rem'} }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "#f8f3e9" },
                    "&:hover fieldset": { borderColor: "#d4af37 !important" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37 !important" },
                  },
                }}
              />

              {/* Description */}
              <TextField
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                required
                fullWidth
                InputLabelProps={{ style: { color: '#f8f3e9', fontSize: '1.15rem' } }}
                inputProps={{ style: { color: 'white', fontSize: '1.3rem', padding: '10px 14px' } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "#f8f3e9" },
                    "&:hover fieldset": { borderColor: "#d4af37 !important" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37 !important" },
                  },
                }}
              />

              {/* Reference */}

              <TextField
                label="Reference"
                name="reference"
                multiline
                value={formData.reference}
                onChange={handleInputChange}
                required
                fullWidth
                InputLabelProps={{ style: { color: '#f8f3e9', fontSize: '1.15rem' } }}
                inputProps={{ style: { color: 'white', fontSize: '1.3rem'} }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "#f8f3e9" },
                    "&:hover fieldset": { borderColor: "#d4af37 !important" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37 !important" },
                  },
                }}
              />

              {/* Price */}
              <TextField
                label="Price (DZD)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                fullWidth
                InputLabelProps={{ style: { color: '#f8f3e9', fontSize: '1.15rem' } }}
                inputProps={{ style: { color: 'white', fontSize: '1.3rem', } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "#f8f3e9" },
                    "&:hover fieldset": { borderColor: "#d4af37 !important" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37 !important" },
                  },
                }}
              />

              {/* Category */}
              <TextField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                fullWidth
                InputLabelProps={{ style: { color: '#f8f3e9', fontSize: '1.15rem' } }}
                inputProps={{ style: { color: 'white', fontSize: '1.3rem'} }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "#f8f3e9" },
                    "&:hover fieldset": { borderColor: "#d4af37 !important" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37 !important" },
                  },
                }}
              />

              {/* Multiple Images Upload */}
              <div className="space-y-4">
                <label className="block text-creamy text-2xl mb-2">
                  Product Images ({formData.images.length}/5)
                </label>
                
                {/* Image Previews */}
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-4 mb-4">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={imageUrl} 
                          alt={`Preview ${index + 1}`} 
                          className="w-24 h-24 object-cover rounded-lg border-2 border-creamy"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 transition-colors hover:cursor-pointer"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* File Upload */}
                <div className="flex items-center gap-4">
                  <label className={`flex items-center gap-2 px-4 py-3 ${
                    formData.images.length >= 5 ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#ffffff] cursor-pointer hover:bg-[#d8d8d8]'
                  } text-[#000000] border border-creamy rounded-lg transition-colors`}>
                    <i className="fas fa-cloud-upload-alt"></i>
                    {uploading ? "Uploading..." : `Choose Images (${formData.images.length}/5)`}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploading || formData.images.length >= 5}
                      className="hidden"
                    />
                  </label>
                  
                  {uploading && (
                    <div className="flex items-center gap-2 text-creamy">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-creamy"></div>
                      <span>Uploading...</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-400 text-sm">
                  You can upload up to 5 images. Max 5MB per image.
                </p>
              </div>

              {/* Stock */}
              <TextField
                label="Stock Quantity"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                required
                fullWidth
                InputLabelProps={{ style: { color: '#f8f3e9', fontSize: '1.15rem' } }}
                inputProps={{ style: { color: 'white', fontSize: '1.3rem', padding: '10px 14px' } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "#f8f3e9" },
                    "&:hover fieldset": { borderColor: "#d4af37 !important" },
                    "&.Mui-focused fieldset": { borderColor: "#d4af37 !important" },
                  },
                }}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              style={{
                backgroundColor: '#f8f3e9',
                color: '#000000',
                fontSize: '1.3rem',
                width: '170px'
              }}
              className="btn"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={uploading || formData.images.length === 0}
              style={{
                backgroundColor: uploading || formData.images.length === 0 ? '#555' : '#014713',
                color: '#ffffff',
                fontSize: '1.3rem',
                width: '220px'
              }}
              className="btn"
            >
              {uploading ? 'Processing...' : editingProduct ? 'Update' : 'Add'} Product
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}