import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axios from "axios";

export default function ProductPage() {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${slug}`);
        const prod = res.data;
        console.log(prod)
        if (prod) {
          setProduct(prod);
          // Fetch related products
          const relatedRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/products/category/${prod.category}`
          );
          const related = relatedRes.data.filter(p => p._id !== prod._id);
          setRelatedProducts(related);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError(err);
        console.error('Error fetching product:', err);
        showSnackbar("Error loading product", "error");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }

  }, [slug]);


  const getCart = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  };

  const addToCart = (product, qty) => {
  if (product) {

    const cart = getCart();
    const existing = cart.find(item => item._id === product._id);
    
    if (existing) {
      existing.quantity += qty;
      setQuantity(qty);
    } else {
      cart.push({ ...product, quantity: qty });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    showSnackbar(`${qty} ${product.name} added to cart!`, "success");
  }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#ffffff] to-[#949494] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#f8f3e9]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#ffffff] to-[#949494] brand-title flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl creamy mb-4">Product Not Found</h2>
          <p className="text-gray-300 mb-6">The product you're looking for doesn't exist.</p>
          <Button 
            style={{ 
              backgroundColor: '#dbdbdb', 
              color: '#000000',
              border: '1px solid #000000',
              padding: '10px 20px', 
              textTransform: 'none'
            }}
            onClick={() => navigate('/products')}
          >
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const allImages = product.images?.length
  ? [product.mainImage, ...product.images]
  : [product.mainImage];

  const productImages = [...new Set(allImages)];

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#ffffff] to-[#949494] brand-title pb-20">

      {/* Breadcrumb */}
      <div className="container mx-auto px-6 pt-10">
        <nav className="text-md text-black mb-6">
          <button 
            onClick={() => navigate('/products')}
            className="hover:text-[#111111] transition-colors hover:cursor-pointer"
          >
            Products
          </button>
          <span className="mx-2">/</span>
          <button 
            onClick={() => navigate(`/products?category=${product.category}`)}
            className="hover:text-creamy transition-colors capitalize hover:cursor-pointer"
          >
            {product.category}
          </button>
          <span className="mx-2">/</span>
          <span className="text-creamy hover:cursor-pointer">{product.name}</span>
        </nav>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-10 mb-16">

          {/* Product Images */}
          <div className="lg:w-1/2">
            <div className="bg-[#dbdbdb] rounded-2xl p-6 shadow-lg"
            style={{boxShadow:"-3px 3px 2px rgba(0, 0, 0, 0.3)"}}>
              <div className="bg-white rounded-md">
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-100 rounded-lg mb-4 object-contain"
                  />
              </div>
              
              {productImages.length  > 1 && (
                <div className="flex gap-4 justify-center">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg border-1 ${
                        selectedImage === index ? 'border-orange-400' : 'border-white'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-contain small-images bg-white rounded-md"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 ">
            <div className=" bg-gradient-to-r from-[#ffffff] to-[#949494] rounded-2xl p-6 shadow-lg" style={{boxShadow:"-3px 3px 2px rgba(0, 0, 0, 0.3)"}}>
              <h1 className="text-3xl md:text-4xl brand-title mb-2">{product.name}</h1>
              <h3 className="text-xl font-bold text-black mr-4 mb-3">REFERENCE : {product.reference}</h3>
              <h3 className="text-xl md:text-xl brand-title "><span className="font-bold">DETAILS : </span>{product.description}</h3>
              <h3 className="text-xl md:text-xl brand-title mb-8"><span className="font-bold">CATEGORY : </span>{product.category}</h3>

              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold text-red-600 mr-4">{product.price} DZD</span>
                {product.stock ? (
                  <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-md">In Stock</span>
                ) : (
                  <span className="bg-red-900 text-red-300 px-3 py-1 rounded-full text-md">Out of Stock</span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center mb-6">
                <span className="mr-4 text-xl brand-title font-bold">Quantity:</span>
                <div className="flex items-center border border-[#000000] rounded-full">
                  <button 
                    className="w-10 h-10 flex items-center justify-center text-creamy hover:bg-[#949494] hover:text-[#2c0101] transition-colors rounded-l-full hover:cursor-pointer"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="w-12 text-center text-lg font-bold">{quantity}</span>
                  <button 
                    className="w-10 h-10 flex items-center justify-center text-creamy hover:bg-[#949494] hover:text-[#2c0101] transition-colors rounded-r-full hover:cursor-pointer"
                    onClick={incrementQuantity}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="contained"
                  disabled={!product.stock}
                  onClick={() => addToCart(product, quantity)}
                  sx={{
                    backgroundColor: product.stock ? '#750202' : '#333232',
                    color: '#f8f3e9',
                    padding: '12px 24px',
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    flex: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: product.stock ? '#a50303' : '#444', // darker red or gray
                    },
                  }}
                >
                  {product.stock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                
                <Button 
                  variant="outlined"
                  onClick={() => navigate('/contact')}
                  sx={{ 
                    color: '#f8f3e9',
                    backgroundColor: "#333232",
                    padding: '12px 24px', 
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    flex: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#4a4a4a',
                    },
                  }}
                >
                  Contact About Product
                </Button>
              </div>

            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-16 border-t-1 border-[#000000] pt-10">
            <h2 className="text-5xl font-logo brand-title mb-8 text-center">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map(relatedProduct => (
                <div 
                  key={relatedProduct._id}
                  className="bg-gradient-to-r from-[#ffffff] to-[#949494] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-[#000000] cursor-pointer px-3 py-4"
                  onClick={() => navigate(`/products/${relatedProduct.category}/${relatedProduct.slug}`)}
                >
                  <div className="bg-white">
                    <img
                      src={relatedProduct.mainImage}
                      alt={relatedProduct.name}
                      className="w-full h-70 object-contain"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold creamy mb-2 brand-title">
                      {relatedProduct.name}
                    </h3>
                    <p className="brand-title text-sm mb-4 line-clamp-2">
                      {relatedProduct.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold brand-title">{relatedProduct.price} DZD</span>
                      <button className=" brand-title hover:text-[#080000] transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Snackbar for notifications */}
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