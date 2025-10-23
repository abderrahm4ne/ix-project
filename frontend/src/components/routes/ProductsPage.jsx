import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchQuery(decodeURIComponent(searchParam));
    }
  }, [location]);

  useEffect(() => {
    const fetchProducts = async () => {
      try{
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`)
        setProducts(res.data)
      }
      catch(err){
        setError(err);
        console.error('error occured :', err)
      }
      finally{
        setLoading(false);
      }
    }

    fetchProducts();
  }, [])

  // Filter products based on category and search query
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "ALL") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  const getCart = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  const addToCart = (product) => {
    const cart = getCart()

    const existing = cart.find( item => item._id === product._id);
    if(existing){
      existing.quantity += product.quantity || 1;
    }
    else {
      cart.push({ ...product, quantity: product.quantity || 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    showSnackbar(`${product.name} added to cart!`, "success");
  }

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    // Remove search query from URL without page reload
    navigate('/products', { replace: true });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#ffffff] to-[#949494] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl creamy mb-4">error occured please try again..</h2>
          <Button 
            style={{ 
              backgroundColor: '#2c0101', 
              color: '#f8f3e9',
              border: '1px solid #f8f3e9',
              padding: '10px 20px', 
              textTransform: 'none'
            }}
            onClick={() => navigate('/')}
          >
            HOME PAGE
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#ffffff] to-[#949494] brand-title pb-20">
      
      {/* Hero Section */}
      <div className="container mx-auto px-6 mb-16 mt-10 text-center ">
          <h2 className="text-4xl md:text-6xl font-logo mb-6 brand-title" style={{ textShadow: '-1px -3px 6px rgba(0, 0, 0, 0.3)' }}>
            Our Collections
          </h2>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-6 mb-8">
        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 rounded-full bg-transparent border-2 border-[#3B3B3B] text-[#3B3B3B] placeholder-[#3B3B3B] outline-0 focus:ring-0.5 text-2xl"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#3B3B3B] hover:text-[#000000] transition-colors font-bold text-2xl hover:cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        {/* Search Results Info */}
        {searchQuery && (
          <div className="text-center mt-4">
            <p className="brand-title text-lg">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found for "{searchQuery}"
              {filteredProducts.length === 0 && " - Try a different search term"}
            </p>
          </div>
        )}
      </div>

      {/* Category Filters */}
      <div className="container justify-center mx-auto px-6 mb-12">
        <div className="flex flex-wrap justify-center items-baseline space-x-4 space-y-3 md:space-x-8 font-routes ">
          {["ALL", "DOUCHETTE", "COLOGNE", "AVABO", "DOUCHETTE ENCASTRE", "ROBINET DE BAIN"].map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full btn transition-all text-xl ${
                selectedCategory === category 
                  ? "bg-[#f8f3e9] text-[#2c0101]" 
                  : "brand-title border border-creamy"
              }`}
              onClick={() => {setSelectedCategory(category)}}
              style={{boxShadow:"-2px 2px 2px rgba(0, 0, 0, 0.3)"}}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          { 
            loading ? (
              <div className="col-span-full text-center">
                <h1 className="text-2xl brand-title">Loading products...</h1>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center">
                <h2 className="text-2xl brand-title mb-4">
                  {searchQuery ? "No products found matching your search" : "No products available"}
                </h2>
                {searchQuery && (
                  <Button 
                    style={{ 
                      backgroundColor: '#2c0101', 
                      color: '#f8f3e9',
                      border: '1px solid #f8f3e9',
                      padding: '10px 20px', 
                      textTransform: 'none'
                    }}
                    onClick={clearSearch}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              filteredProducts.map(product => (
                <NavLink key={product._id} to={`/products/${product.category}/${product.slug}`} className="bg-[#dbdbdb] rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border-1 border-[#000000] px-3 py-10">
                  <div className="bg-white">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-full h-64 object-contain rounded-xl "
                    />
                  </div>
                  
                  <div className="p-6 flex flex-col justify-between h-75">
                    <div>
                      <h3 className="text-2xl brand-title mb-2 group-hover:text-[#f8f3e9] transition-colors h-17">
                        {product.name}
                      </h3>
                      <p className="text-black font-bold text-xl line-clamp-3 mb-2 h-8">
                        REFERENCE : {product.reference}
                      </p>
                      <p className="brand-title text-xl line-clamp-3 h-20">
                        <span className="font-bold">DETAILS : </span>{product.description}
                      </p>
                      <p className="brand-title text-md line-clamp-3 ">
                        <span className="font-bold">CATEGORY : </span>{product.category}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <span className="text-2xl font-bold text-red-600">{product.price} DZD</span>
                      <button 
                        className="px-5 bg-[#3B3B3B] py-3 rounded-full text-[#ffffff] hover:bg-[#2b2b2b] transition-all btn hover:cursor-pointer text-xl"
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </NavLink>
              ))
            )
          }
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 mt-20 text-center">
        <h3 className="text-4xl tracking-tight titles-font mb-3 brand-title" style={{ textShadow: '-1px -3px 6px rgba(255, 255, 255, 0.8)' }}>
          Can't Find What You're Looking For?
        </h3>
        <p className="text-gray-300 max-w-2xl brand-title mx-auto mb-8 font-routes">
          Our collection is constantly evolving. Contact us for special orders or to inquire about exclusive pieces not shown online.
        </p>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#3B3B3B',
            textTransform: 'none',
            padding: '12px 30px',
            fontSize: '1.4rem',
            color: '#f8f3e9',
            transition: 'transform 0.1s ease',
            '&:hover': {
              transform: 'scale(0.99)',
              backgroundColor: '#3B3B3B',
            },
          }}
          onClick={() => navigate('/contact')}
        >
          Contact Us
        </Button>
      </div>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%', fontSize:"1.5rem" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}