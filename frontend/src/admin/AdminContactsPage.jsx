import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

export default function AdminContactsPage() {
  const [messages, setMessages] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('messages');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [dialogData, setDialogData] = useState(null);

  // Filter states
  const [messageFilter, setMessageFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all');

  // Pagination states
  const [messagesPage, setMessagesPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);

      const messagesRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/show-messages`,
        { withCredentials: true }
      );
      
      const ordersRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/show-orders`,
        { withCredentials: true }
      );

      console.log(ordersRes)

      setMessages(messagesRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      showSnackbar("Error loading data", "error");
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered and paginated messages
  const filteredMessages = messages.filter(message => {
    if (messageFilter === 'all') return true;
    if (messageFilter === 'read') return message.read;
    if (messageFilter === 'unread') return !message.read;
    return true;
  });

  const paginatedMessages = filteredMessages.slice(
    (messagesPage - 1) * itemsPerPage,
    messagesPage * itemsPerPage
  );

  // Filtered and paginated orders
  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'all') return true;
    return order.status === orderFilter;
  });

  const paginatedOrders = filteredOrders.slice(
    (ordersPage - 1) * itemsPerPage,
    ordersPage * itemsPerPage
  );

  // Pagination handlers
  const handleMessagesPageChange = (newPage) => {
    setMessagesPage(newPage);
  };

  const handleOrdersPageChange = (newPage) => {
    setOrdersPage(newPage);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setMessagesPage(1);
  }, [messageFilter]);

  useEffect(() => {
    setOrdersPage(1);
  }, [orderFilter]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const deleteMessage = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/delete-message/${messageId}`, { withCredentials: true });
        setMessages(messages.filter(msg => msg._id !== messageId));
        showSnackbar("Message deleted successfully");
      } catch (err) {
        console.error('Error deleting message:', err);
        showSnackbar("Error deleting message", "error");
      }
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}`, { status: newStatus }, { withCredentials: true });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      showSnackbar("Order status updated");
    } catch (err) {
      console.error('Error updating order:', err);
      showSnackbar("Error updating order", "error");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900 text-yellow-300';
      case 'processing': return 'bg-blue-900 text-blue-300';
      case 'completed': return 'bg-green-900 text-green-300';
      case 'cancelled': return 'bg-red-900 text-red-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const handleOpenDialog = (type, data) => {
    setDialogType(type);
    setDialogData(data);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogData(null);
    setDialogType(null);
  };

  const deleteOrder = async (id) => {
    
    try{
      const ordersRes = await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/orders/${id}`,
        { withCredentials: true }
      )
      alert('order deleted successfully');
    } catch(err){
      console.log({ error: "error occured" + err.message});
    }
  }

  // Calculate total pages
  const totalMessagesPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const totalOrdersPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#ffffff] to-[#949494] text-white pb-20">
      {/* Header */}
      <div className="container mx-auto px-6 pt-10">
        <h1 className="text-4xl brand-title mb-8">Admin Orders and Contacts</h1>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-6 py-3 text-3xl hover:cursor-pointer ${
              activeTab === 'messages' 
                ? 'brand-title border-b-2 border-creamy' 
                : 'text-gray-400 hover:text-creamy'
            }`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
          <button
            className={`px-6 py-3 text-3xl hover:cursor-pointer ${
              activeTab === 'orders' 
                ? 'brand-title border-b-2 border-creamy' 
                : 'text-gray-400 hover:text-creamy'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6">
        {activeTab === 'messages' ? (
          <div className="bg-[#000000] rounded-2xl p-6 shadow-lg border border-[#f8f3e9]">
            {/* Messages Header with Filter */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <h2 className="text-3xl creamy">Customer Messages</h2>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">

                <FormControl
                  size="small"
                  sx={{
                    minWidth: 200,
                    "& .MuiInputLabel-root": { color: "#f8f3e9" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#d4af37" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#f8f3e9" },
                      "&:hover fieldset": { borderColor: "#d4af37" },
                      "&.Mui-focused fieldset": { borderColor: "#d4af37" },
                    },
                    "& .MuiSelect-select": { color: "#f8f3e9" },
                    "& .MuiSvgIcon-root": { color: "#f8f3e9" },
                  }}
                >
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    value={messageFilter}
                    label="Filter by Status"
                    onChange={(e) => setMessageFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Messages</MenuItem>
                    <MenuItem value="unread">Unread Only</MenuItem>
                    <MenuItem value="read">Read Only</MenuItem>
                  </Select>
                </FormControl>

                <div className="text-creamy text-lg">
                  Showing {paginatedMessages.length} of {filteredMessages.length} messages
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f8f3e9]"></div>
              </div>
            ) : filteredMessages.length === 0 ? ( 
              <div className="text-center py-12">
                <p className="text-gray-400 text-4xl">No messages found</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {paginatedMessages.map(message => (
                    <div key={message._id} className={`border border-gray-700 rounded-lg p-4 ${
                      !message.read ? 'bg-[#3a0202]' : ''
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-3xl font-semibold creamy">{message.name}</h3>
                          <p className="text-gray-400 text-xl">{message.email}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-400 text-sm">{formatDate(message.createdAt)}</span>
                          {!message.read && (
                            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-4">{message.subject}</p>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => deleteMessage(message._id)}
                          style={{
                            backgroundColor: '#490101',
                            color: '#f8f3e9',
                            border: '1px solid #f8f3e9',
                            padding: '4px 12px',
                            fontSize: '1.2rem',
                            textTransform: 'none'
                          }}
                          className="rounded-md btn"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleOpenDialog("message", message)}
                          style={{
                            backgroundColor: '#070147',
                            color: '#f8f3e9',
                            border: '1px solid #f8f3e9',
                            padding: '4px 12px',
                            fontSize: '1.2rem',
                            textTransform: 'none'
                          }}
                          className="rounded-md btn">
                          See More
                        </button>
                        
                      </div>
                    </div>
                  ))}
                </div>

                {/* Messages Pagination */}
                {totalMessagesPages > 1 && (
                  <div className="flex justify-center items-center space-x-4 mt-6">
                    <button
                      onClick={() => handleMessagesPageChange(messagesPage - 1)}
                      disabled={messagesPage === 1}
                      className={`px-4 py-2 rounded-lg ${
                        messagesPage === 1 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-[#2c0101] hover:bg-[#3a0202]'
                      } text-white border border-[#f8f3e9]`}
                    >
                      Previous
                    </button>
                    
                    <span className="text-creamy text-lg">
                      Page {messagesPage} of {totalMessagesPages}
                    </span>
                    
                    <button
                      onClick={() => handleMessagesPageChange(messagesPage + 1)}
                      disabled={messagesPage === totalMessagesPages}
                      className={`px-4 py-2 rounded-lg ${
                        messagesPage === totalMessagesPages 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-[#2c0101] hover:bg-[#3a0202]'
                      } text-white border border-[#f8f3e9]`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="bg-[#000000] rounded-2xl p-6 shadow-lg border border-[#f8f3e9]">
            {/* Orders Header with Filter */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <h2 className="text-3xl creamy">Customer Orders</h2>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <FormControl
                  size="small"
                  sx={{
                    minWidth: 200,
                    "& .MuiInputLabel-root": { color: "#f8f3e9" }, // default color
                    "& .MuiInputLabel-root.Mui-focused": { color: "#d4af37" }, // when focused
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#f8f3e9" },
                      "&:hover fieldset": { borderColor: "#d4af37" },
                      "&.Mui-focused fieldset": { borderColor: "#d4af37" },
                    },
                    "& .MuiSelect-select": { color: "#f8f3e9" }, // selected text
                    "& .MuiSvgIcon-root": { color: "#f8f3e9" }, // dropdown arrow color
                  }}
                >
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    value={messageFilter}
                    label="Filter by Status"
                    onChange={(e) => setMessageFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Messages</MenuItem>
                    <MenuItem value="unread">Unread Only</MenuItem>
                    <MenuItem value="read">Read Only</MenuItem>
                  </Select>
                </FormControl>


                <div className="text-creamy text-lg">
                  Showing {paginatedOrders.length} of {filteredOrders.length} orders
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f8f3e9]"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No orders found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white">
                        <th className="text-left text-2xl p-4 creamy">Order #</th>
                        <th className="text-left text-2xl p-4 creamy">Customer</th>
                        <th className="text-left text-2xl p-4 creamy">Items</th>
                        <th className="text-left text-2xl p-4 creamy">Total</th>
                        <th className="text-left text-2xl p-4 creamy">Status</th>
                        <th className="text-left text-2xl p-4 creamy">Date</th>
                        <th className="text-left text-2xl p-4 creamy">Actions</th>
                        <th className="text-left text-2xl p-4 creamy">Details</th>
                        <th className="text-left text-2xl p-4 creamy">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedOrders.map(order => (
                        <tr key={order._id} onClick={() => handleOpenDialog("order", order)} className="border-b border-white hover:cursor-pointer hover:bg-[#3a0202]">
                          <td className="p-4 font-mono text-lg">{order.orderNumber}</td>
                          <td className="p-4 text-lg">{order.customer.name}</td>
                          <td className="p-4">
                            <div className="max-w-xs">
                              {order.items.map((item, index) => (
                                <div key={index} className=" text-lg text-gray-300">
                                  {item.quantity}x {item.name} ref: {item.reference}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-xl">{order.total} DZD</td>
                          <td className="p-4">
                            <span className={`px-3 py-2 rounded-full text-xl ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-md text-gray-400">{formatDate(order.createdAt)}</td>
                          <td className="p-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              className="bg-[#1a1a1a] text-white border border-[#f8f3e9] rounded px-2 py-1 text-md hover:cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option className="hover:cursor-pointer" value="pending">Pending</option>
                              <option className="hover:cursor-pointer" value="processing">Processing</option>
                              <option className="hover:cursor-pointer" value="completed">Completed</option>
                              <option className="hover:cursor-pointer" value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDialog("order", order);
                              }} 
                              className="bg-[#070147] creamy px-5 py-2 rounded-lg btn border-1 border-cyan-50"
                            >
                              VIEW DETAILS
                            </button>
                          </td>
                          <td>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteOrder(order._id)
                              }} 
                              className="bg-[#f10606] creamy px-5 py-2 rounded-lg btn border-1 border-cyan-50"
                            >
                              DELETE ORDER
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Orders Pagination */}
                {totalOrdersPages > 1 && (
                  <div className="flex justify-center items-center space-x-4 mt-6">
                    <button
                      onClick={() => handleOrdersPageChange(ordersPage - 1)}
                      disabled={ordersPage === 1}
                      className={`px-4 py-2 rounded-lg ${
                        ordersPage === 1 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-[#2c0101] hover:bg-[#3a0202]'
                      } text-white border border-[#f8f3e9]`}
                    >
                      Previous
                    </button>
                    
                    <span className="text-creamy text-lg">
                      Page {ordersPage} of {totalOrdersPages}
                    </span>
                    
                    <button
                      onClick={() => handleOrdersPageChange(ordersPage + 1)}
                      disabled={ordersPage === totalOrdersPages}
                      className={`px-4 py-2 rounded-lg ${
                        ordersPage === totalOrdersPages 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-[#2c0101] hover:bg-[#3a0202]'
                      } text-white border border-[#f8f3e9]`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Beautiful Message Details Dialog */}
      <Dialog 
        open={openDialog && dialogType === "message"} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #2c0101 0%, #1a1a1a 100%)',
            border: '2px solid #d4af37',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(135deg, #d4af37 0%, #f8f3e9 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: '2rem',
            fontWeight: 'bold',
            textAlign: 'center',
            py: 3
          }}
        >
          📧 Message Details
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          {dialogData && (
            <Card 
              sx={{ 
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                mb: 2
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Header Info */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Typography variant="h5" sx={{ color: '#d4af37', fontWeight: 'bold', mb: 1 }}>
                      {dialogData.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#f8f3e9' }}>
                      {dialogData.email}
                    </Typography>
                  </div>
                  <Chip 
                    label={formatDate(dialogData.createdAt)}
                    sx={{ 
                      backgroundColor: 'rgba(212, 175, 55, 0.2)',
                      color: '#d4af37',
                      border: '1px solid #d4af37'
                    }}
                  />
                </div>

                <Divider sx={{ my: 2, backgroundColor: 'rgba(212, 175, 55, 0.3)' }} />

                {/* Subject */}
                {dialogData.subject && (
                  <div className="mb-4">
                    <Typography variant="h6" sx={{ color: '#d4af37', mb: 1, fontWeight: 'bold' }}>
                      Subject
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#f8f3e9',
                        p: 2,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        borderRadius: '8px',
                        borderLeft: '4px solid #d4af37'
                      }}
                    >
                      {dialogData.subject}
                    </Typography>
                  </div>
                )}

                {/* Message */}
                <div>
                  <Typography variant="h6" sx={{ color: '#d4af37', mb: 1, fontWeight: 'bold' }}>
                    Message
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#f8f3e9',
                      p: 3,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      borderRadius: '8px',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      minHeight: '120px',
                      lineHeight: '1.6'
                    }}
                  >
                    {dialogData.message}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              backgroundColor: '#d4af37',
              color: '#2c0101',
              px: 4,
              py: 1,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#f8f3e9',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Close Details
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog 
        open={openDialog && dialogType === "order"} 
        onClose={handleCloseDialog} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #2c0101 0%, #1a1a1a 100%)',
            border: '2px solid #d4af37',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(135deg, #d4af37 0%, #f8f3e9 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: '2rem',
            fontWeight: 'bold',
            textAlign: 'center',
            py: 3
          }}
        >
          🛍️ Order Details
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          {dialogData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information Card */}
              <Card 
                sx={{ 
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#d4af37', mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
                    👤 Customer Information
                  </Typography>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Typography sx={{ color: '#f8f3e9', fontWeight: 'bold' }}>Name:</Typography>
                      <Typography sx={{ color: '#f8f3e9' }}>{dialogData.customer?.name}</Typography>
                    </div>
                    
                    <div className="flex justify-between">
                      <Typography sx={{ color: '#f8f3e9', fontWeight: 'bold' }}>Email:</Typography>
                      <Typography sx={{ color: '#f8f3e9' }}>{dialogData.customer?.email || "N/A"}</Typography>
                    </div>
                    
                    <div className="flex justify-between">
                      <Typography sx={{ color: '#f8f3e9', fontWeight: 'bold' }}>Phone:</Typography>
                      <Typography sx={{ color: '#f8f3e9' }}>{dialogData.customer?.phone || "N/A"}</Typography>
                    </div>
                    
                    <Divider sx={{ my: 2, backgroundColor: 'rgba(212, 175, 55, 0.3)' }} />
                    
                    <div>
                      <Typography sx={{ color: '#f8f3e9', fontWeight: 'bold', mb: 1 }}>Address:</Typography>
                      <Typography sx={{ color: '#f8f3e9' }}>{dialogData.customer?.address}</Typography>
                    </div>
                    
                    <div className="flex justify-between">
                      <Typography sx={{ color: '#f8f3e9', fontWeight: 'bold' }}>City:</Typography>
                      <Typography sx={{ color: '#f8f3e9' }}>{dialogData.customer?.city}</Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary Card */}
              <Card 
                sx={{ 
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#d4af37', mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
                    📋 Order Summary
                  </Typography>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Typography sx={{ color: '#f8f3e9', fontWeight: 'bold' }}>Order #:</Typography>
                      <Typography sx={{ color: '#f8f3e9', fontFamily: 'monospace' }}>
                        {dialogData.orderNumber}
                      </Typography>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Typography sx={{ color: '#f8f3e9', fontWeight: 'bold' }}>Status:</Typography>
                      <Chip 
                        label={dialogData.status?.toUpperCase()} 
                        color={getStatusChipColor(dialogData.status)}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Typography sx={{ color: '#f8f3e9', fontWeight: 'bold' }}>Date:</Typography>
                      <Typography sx={{ color: '#f8f3e9' }}>
                        {formatDate(dialogData.createdAt)}
                      </Typography>
                    </div>
                    
                    <Divider sx={{ my: 2, backgroundColor: 'rgba(212, 175, 55, 0.3)' }} />
                    
                    <div>
                      <Typography sx={{ color: '#f8f3e9', fontWeight: 'bold', mb: 2 }}>Order Items:</Typography>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {dialogData.items?.map((item, index) => (
                          <div 
                            key={index}
                            className="flex justify-between items-center p-2 rounded-lg"
                            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                          >
                            <div>
                              <Typography sx={{ color: '#f8f3e9', fontWeight: 'bold' }}>
                                {item.quantity}x {item.name} ref: {item.reference}
                              </Typography>
                            </div>
                            <Typography sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                              {item.price} DZD
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Divider sx={{ my: 2, backgroundColor: 'rgba(212, 175, 55, 0.3)' }} />
                    
                    <div className="flex justify-between items-center pt-2">
                      <Typography sx={{ color: '#f8f3e9', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        Total Amount:
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: '#d4af37', 
                          fontWeight: 'bold', 
                          fontSize: '1.5rem',
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}
                      >
                        {dialogData.total} DZD
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              backgroundColor: '#d4af37',
              color: '#2c0101',
              px: 4,
              py: 1,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#f8f3e9',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Close Details
          </Button>
        </DialogActions>
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