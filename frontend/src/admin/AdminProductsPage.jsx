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
import { useNavigate } from "react-router-dom";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    reference: "",
    price: "",
    priceEuro: "",
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

  useEffect(() => { fetchProducts(); }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        reference: product.reference,
        price: product.price,
        priceEuro: product.priceEuro,
        category: product.category,
        images: product.images || [],
        stock: product.stock,
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: "", description: "", reference: "", price: "", priceEuro: "", category: "", images: [], stock: "" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (formData.images.length + files.length > 5) {
      showSnackbar(`Maximum 5 images allowed. You have ${formData.images.length} already.`, "error");
      return;
    }
    setUploading(true);
    try {
      const uploadFormData = new FormData();
      Array.from(files).forEach(file => uploadFormData.append('images', file));
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/upload-product-images`,
        uploadFormData,
        { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (response.data.success) {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...response.data.images] }));
        showSnackbar(`Uploaded ${response.data.images.length} image(s)`, "success");
      } else {
        showSnackbar(response.data.message || "Upload failed", "error");
      }
    } catch (err) {
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
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !formData.reference.trim() || !formData.category.trim() || formData.stock === "") {
      showSnackbar("Please fill in all required fields", "error");
      return;
    }
    /* if (formData.images.length === 0) {
      showSnackbar("Please upload at least one product image", "error");
      return;
    } */
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        reference: formData.reference,
        price: parseInt(formData.price),
        priceEuro: parseInt(formData.priceEuro) || 15,
        category: formData.category,
        images: formData.images,
        stock: parseInt(formData.stock),
      };
      if (editingProduct) {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/update/product/${editingProduct._id}`, productData, { withCredentials: true });
        const updated = res.data?.product ?? { ...editingProduct, ...productData };
        setProducts(prev => prev.map(p => p._id === editingProduct._id ? updated : p));
        showSnackbar("Product updated successfully!");
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/add/product`, productData, { withCredentials: true });
        const created = res.data?.product
        setProducts(prev => [created, ...prev]);
        showSnackbar("Product added successfully!");
      }
      handleCloseDialog();
    } catch (err) {
      showSnackbar("Error saving product", "error");
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/delete/product/${productId}`, { withCredentials: true });
        setProducts(prev => prev.filter(p => p._id !== productId));
        showSnackbar("Product deleted successfully!");
      } catch (err) {
        showSnackbar("Error deleting product", "error");
      }
    }
  };

  useEffect(() => {
    let filtered = products;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
    }
    setFilteredProducts(filtered);
  }, [products, searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    navigate('/products', { replace: true });
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      "& fieldset": { borderColor: "#f8f3e9" },
      "&:hover fieldset": { borderColor: "#d4af37 !important" },
      "&.Mui-focused fieldset": { borderColor: "#d4af37 !important" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#ffffff] to-[#949494] text-white pb-20">
      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-4xl brand-title">Product Management</h1>
          <Button
            variant="contained"
            onClick={() => handleOpenDialog()}
            style={{ backgroundColor: '#000000', color: '#ffffff', padding: '10px 20px', textTransform: 'none', fontSize: '1rem', whiteSpace: 'nowrap' }}
          >
            <i className="fas fa-plus mr-2"></i>Add New Product
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="container mx-auto px-4 sm:px-6 mb-8">
        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-transparent border-2 border-[#3B3B3B] text-[#3B3B3B] placeholder-[#3B3B3B] outline-0 text-base sm:text-xl"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3B3B3B] hover:text-[#000000] font-bold text-xl hover:cursor-pointer">✕</button>
            )}
          </div>
        </div>
        {searchQuery && (
          <div className="text-center mt-4">
            <p className="brand-title text-base sm:text-lg">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found for "{searchQuery}"
              {filteredProducts.length === 0 && " - Try a different search term"}
            </p>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-[#000000] rounded-2xl p-4 sm:p-6 shadow-lg border border-[#f8f3e9]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f8f3e9]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 text-xl mb-4">Error loading products</p>
              <Button onClick={fetchProducts} style={{ backgroundColor: '#000000', color: '#ffffff', border: '1px solid #f8f3e9', padding: '10px 20px', textTransform: 'none' }}>Try Again</Button>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-lg">
                  <thead>
                    <tr className="border-b border-white">
                      {["Image", "Name", "Reference", "Category", "Price", "Euro", "Stock", "Actions"].map(h => (
                        <th key={h} className="text-left p-4 creamy">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product._id} className="border-b border-white hover:bg-[#141414] hover:cursor-pointer">
                        <td className="p-4">
                          {product.images?.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {product.images.slice(0, 3).map((img, i) => (
                                <img key={i} src={img} loading="lazy" alt={`${product.name} ${i + 1}`} className="w-12 h-12 object-cover rounded" />
                              ))}
                              {product.images.length > 3 && (
                                <div className="w-12 h-12 bg-white flex items-center justify-center rounded text-black text-xs font-bold">+{product.images.length - 3}</div>
                              )}
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-700 flex items-center justify-center rounded"><i className="fas fa-image text-gray-400"></i></div>
                          )}
                        </td>
                        <td className="px-4 py-3 capitalize text-white">{product.name.length > 20 ? product.name.slice(0, 20) + ".." : product.name}</td>
                        <td className="px-4 py-3 capitalize">{product.reference}</td>
                        <td className="px-4 py-3 capitalize">{product.category}</td>
                        <td className="px-4 py-3">{product.price} DZD</td>
                        <td className="px-4 py-3">{product.priceEuro} €</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-sm ${product.stock > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-4">
                            <button onClick={() => handleOpenDialog(product)} className="text-blue-400 hover:text-blue-300 hover:cursor-pointer" title="Edit"><i className="fas fa-edit text-2xl"></i></button>
                            <button onClick={() => handleDelete(product._id)} className="text-red-400 hover:text-red-300 hover:cursor-pointer" title="Delete"><i className="fas fa-trash text-2xl"></i></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredProducts.map(product => (
                  <div key={product._id} className="bg-[#141414] rounded-xl p-4 border border-gray-700">
                    <div className="flex gap-3 mb-3">
                      {product.images?.length > 0 && (
                        <img src={product.images[0]} loading="lazy" alt={product.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold capitalize truncate">{product.name}</h3>
                        <p className="text-gray-400 text-sm">{product.reference}</p>
                        <p className="text-gray-400 text-sm capitalize">{product.category}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-between items-center">
                      <div className="flex gap-3 text-sm">
                        <span className="text-white">{product.price} DZD</span>
                        <span className="text-gray-400">{product.priceEuro} €</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${product.stock > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-3 pt-3 border-t border-gray-700">
                      <button onClick={() => handleOpenDialog(product)} className="flex-1 text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2 text-sm py-1">
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="flex-1 text-red-400 hover:text-red-300 flex items-center justify-center gap-2 text-sm py-1">
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-400 text-lg">No products found</div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <div className="bg-[#000000] text-white px-2 sm:px-4 py-6 sm:py-8">
          <DialogTitle className="text-2xl sm:text-4xl creamy">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4 flex flex-col gap-6">
              {[
                { label: "Product Name", name: "name" },
                { label: "Reference", name: "reference" },
                { label: "Category", name: "category" },
              ].map(({ label, name }) => (
                <TextField key={name} label={label} name={name} value={formData[name]} onChange={handleInputChange} required fullWidth
                  InputLabelProps={{ style: { color: '#f8f3e9' } }}
                  inputProps={{ style: { color: 'white', fontSize: '1.1rem' } }}
                  sx={textFieldSx}
                />
              ))}

              <TextField label="Description" name="description" multiline rows={4} value={formData.description} onChange={handleInputChange} required fullWidth
                InputLabelProps={{ style: { color: '#f8f3e9' } }}
                inputProps={{ style: { color: 'white', fontSize: '1.1rem', padding: '10px 14px' } }}
                sx={textFieldSx}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField label="Price (DZD)" name="price" type="number" value={formData.price} onChange={handleInputChange} required fullWidth
                  InputLabelProps={{ style: { color: '#f8f3e9' } }}
                  inputProps={{ style: { color: 'white', fontSize: '1.1rem' } }}
                  sx={textFieldSx}
                />
                <TextField label="Price (Euro)" name="priceEuro" type="number" value={formData.priceEuro} onChange={handleInputChange} fullWidth
                  InputLabelProps={{ style: { color: '#f8f3e9' } }}
                  inputProps={{ style: { color: 'white', fontSize: '1.1rem' } }}
                  sx={textFieldSx}
                />
              </div>

              <TextField label="Stock Quantity" name="stock" type="number" value={formData.stock} onChange={handleInputChange} required fullWidth
                InputLabelProps={{ style: { color: '#f8f3e9' } }}
                inputProps={{ style: { color: 'white', fontSize: '1.1rem' } }}
                sx={textFieldSx}
              />

              {/* Images */}
              <div className="space-y-3">
                <label className="block text-creamy text-lg sm:text-xl">Product Images ({formData.images.length}/5)</label>
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {formData.images.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt={`Preview ${i + 1}`} loading="lazy" className="w-20 h-20 object-cover rounded-lg border-2 border-[#f8f3e9]" />
                        <button type="button" onClick={() => removeImage(i)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 hover:cursor-pointer">×</button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5 rounded-b-lg">{i + 1}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-4">
                  <label className={`flex items-center gap-2 px-4 py-2.5 text-sm ${formData.images.length >= 5 ? 'bg-gray-500 cursor-not-allowed' : 'bg-white cursor-pointer hover:bg-gray-200'} text-black rounded-lg transition-colors`}>
                    <i className="fas fa-cloud-upload-alt"></i>
                    {uploading ? "Uploading..." : `Choose Images (${formData.images.length}/5)`}
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading || formData.images.length >= 5} className="hidden" />
                  </label>
                  {uploading && (
                    <div className="flex items-center gap-2 text-creamy">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#f8f3e9]"></div>
                      <span className="text-sm">Uploading...</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-400 text-xs">Up to 5 images. Max 5MB per image.</p>
              </div>
            </form>
          </DialogContent>
          <DialogActions className="flex flex-col sm:flex-row gap-2 px-4 pb-4">
            <Button onClick={handleCloseDialog} style={{ backgroundColor: '#f8f3e9', color: '#000000', fontSize: '1rem', minWidth: '140px' }}>Cancel</Button>
            <Button onClick={handleSubmit}
              style={{ backgroundColor: uploading || formData.images.length === 0 ? '#555' : '#014713', color: '#ffffff', fontSize: '1rem', minWidth: '160px' }}>
              {uploading ? 'Processing...' : editingProduct ? 'Update' : 'Add'} Product
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>{snackbarMessage}</Alert>
      </Snackbar>
    </div>
  );
}