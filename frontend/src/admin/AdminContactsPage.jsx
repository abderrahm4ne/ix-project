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
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const [messageFilter, setMessageFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all');

  const [messagesPage, setMessagesPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [messagesRes, ordersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/show-messages`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/show-orders`, { withCredentials: true }),
      ]);
      setMessages(messagesRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      showSnackbar("Error loading data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredMessages = messages.filter(msg => {
    if (messageFilter === 'read') return msg.read;
    if (messageFilter === 'unread') return !msg.read;
    return true;
  });

  const paginatedMessages = filteredMessages.slice((messagesPage - 1) * itemsPerPage, messagesPage * itemsPerPage);

  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'all') return true;
    return order.status === orderFilter;
  });

  const paginatedOrders = filteredOrders.slice((ordersPage - 1) * itemsPerPage, ordersPage * itemsPerPage);
  const totalMessagesPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const totalOrdersPages = Math.ceil(filteredOrders.length / itemsPerPage);

  useEffect(() => { setMessagesPage(1); }, [messageFilter]);
  useEffect(() => { setOrdersPage(1); }, [orderFilter]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const deleteMessage = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/delete-message/${messageId}`, { withCredentials: true });
        setMessages(messages.filter(msg => msg._id !== messageId));
        showSnackbar("Message deleted successfully");
      } catch (err) {
        showSnackbar("Error deleting message", "error");
      }
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}`, { status: newStatus }, { withCredentials: true });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      showSnackbar("Order status updated");
    } catch (err) {
      showSnackbar("Error updating order", "error");
    }
  };

  const deleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/orders/${id}`, { withCredentials: true });
        setOrders(orders.filter(o => o._id !== id));
        showSnackbar("Order deleted successfully");
      } catch (err) {
        showSnackbar("Error deleting order", "error");
      }
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

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

  const handleOpenDialog = (type, data) => { setDialogType(type); setDialogData(data); setOpenDialog(true); };
  const handleCloseDialog = () => { setOpenDialog(false); setDialogData(null); setDialogType(null); };

  const filterSelectSx = {
    minWidth: 180,
    "& .MuiInputLabel-root": { color: "#f8f3e9" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#d4af37" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#f8f3e9" },
      "&:hover fieldset": { borderColor: "#d4af37" },
      "&.Mui-focused fieldset": { borderColor: "#d4af37" },
    },
    "& .MuiSelect-select": { color: "#f8f3e9" },
    "& .MuiSvgIcon-root": { color: "#f8f3e9" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#ffffff] to-[#949494] text-white pb-20">
      <div className="container mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        <h1 className="text-2xl sm:text-4xl brand-title mb-6 sm:mb-8">Admin Orders and Contacts</h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          {['messages', 'orders'].map(tab => (
            <button key={tab}
              className={`px-4 sm:px-6 py-3 text-xl sm:text-3xl capitalize hover:cursor-pointer transition-colors ${activeTab === tab ? 'brand-title border-b-2 border-creamy' : 'text-gray-400 hover:text-creamy'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* ─── MESSAGES TAB ─── */}
        {activeTab === 'messages' && (
          <div className="bg-[#000000] rounded-2xl p-4 sm:p-6 shadow-lg border border-[#f8f3e9]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl sm:text-3xl creamy">Customer Messages</h2>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full sm:w-auto">
                <FormControl size="small" sx={filterSelectSx}>
                  <InputLabel>Filter</InputLabel>
                  <Select value={messageFilter} label="Filter" onChange={(e) => setMessageFilter(e.target.value)}>
                    <MenuItem value="all">All Messages</MenuItem>
                    <MenuItem value="unread">Unread Only</MenuItem>
                    <MenuItem value="read">Read Only</MenuItem>
                  </Select>
                </FormControl>
                <span className="text-creamy text-sm sm:text-base">
                  {paginatedMessages.length} / {filteredMessages.length} messages
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f8f3e9]"></div>
              </div>
            ) : filteredMessages.length === 0 ? (
              <p className="text-center py-12 text-gray-400 text-2xl sm:text-4xl">No messages found</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {paginatedMessages.map(message => (
                    <div key={message._id} className={`border border-gray-700 rounded-lg p-4 ${!message.read ? 'bg-[#3a0202]' : ''}`}>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-semibold creamy">{message.name}</h3>
                          <p className="text-gray-400 text-sm sm:text-base">{message.email}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-gray-400 text-xs sm:text-sm">{formatDate(message.createdAt)}</span>
                          {!message.read && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm sm:text-base mb-4 line-clamp-2">{message.subject}</p>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => deleteMessage(message._id)} className="rounded-md btn px-4 py-1.5 text-sm" style={{ backgroundColor: '#490101', color: '#f8f3e9', border: '1px solid #f8f3e9' }}>Delete</button>
                        <button onClick={() => handleOpenDialog("message", message)} className="rounded-md btn px-4 py-1.5 text-sm" style={{ backgroundColor: '#070147', color: '#f8f3e9', border: '1px solid #f8f3e9' }}>See More</button>
                      </div>
                    </div>
                  ))}
                </div>

                {totalMessagesPages > 1 && (
                  <div className="flex justify-center items-center gap-4">
                    <button onClick={() => setMessagesPage(p => p - 1)} disabled={messagesPage === 1}
                      className={`px-4 py-2 rounded-lg text-white border border-[#f8f3e9] text-sm ${messagesPage === 1 ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#2c0101] hover:bg-[#3a0202]'}`}>Previous</button>
                    <span className="text-creamy text-sm">Page {messagesPage} of {totalMessagesPages}</span>
                    <button onClick={() => setMessagesPage(p => p + 1)} disabled={messagesPage === totalMessagesPages}
                      className={`px-4 py-2 rounded-lg text-white border border-[#f8f3e9] text-sm ${messagesPage === totalMessagesPages ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#2c0101] hover:bg-[#3a0202]'}`}>Next</button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ─── ORDERS TAB ─── */}
        {activeTab === 'orders' && (
          <div className="bg-[#000000] rounded-2xl p-4 sm:p-6 shadow-lg border border-[#f8f3e9]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl sm:text-3xl creamy">Customer Orders</h2>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full sm:w-auto">
                
                <FormControl size="small" sx={filterSelectSx}>
                  <InputLabel>Filter</InputLabel>
                  <Select value={orderFilter} label="Filter" onChange={(e) => setOrderFilter(e.target.value)}>
                    <MenuItem value="all">All Orders</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
                <span className="text-creamy text-sm sm:text-base">
                  {paginatedOrders.length} / {filteredOrders.length} orders
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f8f3e9]"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <p className="text-center py-12 text-gray-400 text-xl">No orders found</p>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto mb-6">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white">
                        {["Order #", "Customer", "Items", "Total", "Status", "Date", "Actions", "Details", "Delete"].map(h => (
                          <th key={h} className="text-left text-lg p-4 creamy whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedOrders.map(order => (
                        <tr key={order._id} onClick={() => handleOpenDialog("order", order)} className="border-b border-white hover:cursor-pointer hover:bg-[#1a0000]">
                          <td className="p-4 font-mono text-sm">{order.orderNumber}</td>
                          <td className="p-4 text-sm">{order.customer.name}</td>
                          <td className="p-4 text-sm text-gray-300">{order.items.reduce((acc, i) => acc + i.quantity, 0)} items</td>
                          <td className="p-4 text-sm font-semibold">{order.total} DZD</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>{order.status}</span>
                          </td>
                          <td className="p-4 text-xs text-gray-400 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                          <td className="p-4" onClick={e => e.stopPropagation()}>
                            <select value={order.status} onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              className="bg-[#1a1a1a] text-white border border-[#f8f3e9] rounded px-2 py-1 text-xs hover:cursor-pointer">
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4" onClick={e => e.stopPropagation()}>
                            <button onClick={() => handleOpenDialog("order", order)} className="bg-[#070147] text-[#f8f3e9] px-3 py-1.5 rounded-lg text-xs border border-cyan-50 whitespace-nowrap hover:cursor-pointer">VIEW</button>
                          </td>
                          <td className="p-4" onClick={e => e.stopPropagation()}>
                            <button onClick={() => deleteOrder(order._id)} className="bg-[#f10606] text-white px-3 py-1.5 rounded-lg text-xs border border-cyan-50 whitespace-nowrap hover:cursor-pointer">DELETE</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4 mb-6">
                  {paginatedOrders.map(order => (
                    <div key={order._id} className="bg-[#141414] rounded-xl p-4 border border-gray-700">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-mono text-xs text-gray-400">#{order.orderNumber}</p>
                          <p className="text-white font-semibold">{order.customer.name}</p>
                          <p className="text-gray-400 text-xs">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#d4af37] font-bold">{order.total} DZD</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs mt-1 inline-block ${getStatusColor(order.status)}`}>{order.status}</span>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-3">{order.items.reduce((acc, i) => acc + i.quantity, 0)} items</p>

                      <div className="mb-3" onClick={e => e.stopPropagation()}>
                        <select value={order.status} onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="w-full bg-[#1a1a1a] text-white border border-[#f8f3e9] rounded px-3 py-2 text-sm">
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => handleOpenDialog("order", order)} className="flex-1 bg-[#070147] text-[#f8f3e9] py-2 rounded-lg text-sm border border-cyan-50">View Details</button>
                        <button onClick={() => deleteOrder(order._id)} className="flex-1 bg-[#f10606] text-white py-2 rounded-lg text-sm border border-red-300">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>

                {totalOrdersPages > 1 && (
                  <div className="flex justify-center items-center gap-4">
                    <button onClick={() => setOrdersPage(p => p - 1)} disabled={ordersPage === 1}
                      className={`px-4 py-2 rounded-lg text-white border border-[#f8f3e9] text-sm ${ordersPage === 1 ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#2c0101] hover:bg-[#3a0202]'}`}>Previous</button>
                    <span className="text-creamy text-sm">Page {ordersPage} of {totalOrdersPages}</span>
                    <button onClick={() => setOrdersPage(p => p + 1)} disabled={ordersPage === totalOrdersPages}
                      className={`px-4 py-2 rounded-lg text-white border border-[#f8f3e9] text-sm ${ordersPage === totalOrdersPages ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#2c0101] hover:bg-[#3a0202]'}`}>Next</button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Message Dialog */}
      <Dialog open={openDialog && dialogType === "message"} onClose={handleCloseDialog} maxWidth="md" fullWidth
        PaperProps={{ sx: { background: 'linear-gradient(135deg, #2c0101 0%, #1a1a1a 100%)', border: '2px solid #d4af37', borderRadius: '16px' } }}>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #d4af37 0%, #f8f3e9 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', fontSize: { xs: '1.4rem', sm: '2rem' }, fontWeight: 'bold', textAlign: 'center', py: 3 }}>
          📧 Message Details
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 4 } }}>
          {dialogData && (
            <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                  <div>
                    <Typography variant="h5" sx={{ color: '#d4af37', fontWeight: 'bold', mb: 0.5 }}>{dialogData.name}</Typography>
                    <Typography sx={{ color: '#f8f3e9', fontSize: { xs: '0.85rem', sm: '1rem' } }}>{dialogData.email}</Typography>
                  </div>
                  <Chip label={formatDate(dialogData.createdAt)} sx={{ backgroundColor: 'rgba(212,175,55,0.2)', color: '#d4af37', border: '1px solid #d4af37', fontSize: '0.75rem' }} />
                </div>
                <Divider sx={{ my: 2, backgroundColor: 'rgba(212,175,55,0.3)' }} />
                {dialogData.subject && (
                  <div className="mb-4">
                    <Typography variant="h6" sx={{ color: '#d4af37', mb: 1, fontWeight: 'bold' }}>Subject</Typography>
                    <Typography sx={{ color: '#f8f3e9', p: 2, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', borderLeft: '4px solid #d4af37' }}>{dialogData.subject}</Typography>
                  </div>
                )}
                <div>
                  <Typography variant="h6" sx={{ color: '#d4af37', mb: 1, fontWeight: 'bold' }}>Message</Typography>
                  <Typography sx={{ color: '#f8f3e9', p: 2, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.3)', minHeight: '100px', lineHeight: 1.6 }}>{dialogData.message}</Typography>
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button onClick={handleCloseDialog} sx={{ backgroundColor: '#d4af37', color: '#2c0101', px: 4, fontWeight: 'bold', borderRadius: '8px', '&:hover': { backgroundColor: '#f8f3e9' } }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Order Dialog */}
      <Dialog open={openDialog && dialogType === "order"} onClose={handleCloseDialog} maxWidth="lg" fullWidth
        PaperProps={{ sx: { background: 'linear-gradient(135deg, #2c0101 0%, #1a1a1a 100%)', border: '2px solid #d4af37', borderRadius: '16px' } }}>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #d4af37 0%, #f8f3e9 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', fontSize: { xs: '1.4rem', sm: '2rem' }, fontWeight: 'bold', textAlign: 'center', py: 3 }}>
          🛍️ Order Details
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 4 } }}>
          {dialogData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography variant="h6" sx={{ color: '#d4af37', mb: 3, fontWeight: 'bold', textAlign: 'center' }}>👤 Customer Information</Typography>
                  {[
                    { label: 'Name', value: dialogData.customer?.name },
                    { label: 'Email', value: dialogData.customer?.email || 'N/A' },
                    { label: 'Phone', value: dialogData.customer?.phone || 'N/A' },
                    { label: 'City', value: dialogData.customer?.city },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col sm:flex-row sm:justify-between gap-1 mb-3">
                      <Typography sx={{ color: '#f8f3e9', fontWeight: 'bold', fontSize: { xs: '0.85rem', sm: '1rem' } }}>{label}:</Typography>
                      <Typography sx={{ color: '#f8f3e9', fontSize: { xs: '0.85rem', sm: '1rem' } }}>{value}</Typography>
                    </div>
                  ))}
                  <Divider sx={{ my: 2, backgroundColor: 'rgba(212,175,55,0.3)' }} />
                  <Typography sx={{ color: '#f8f3e9', fontWeight: 'bold', mb: 1 }}>Address:</Typography>
                  <Typography sx={{ color: '#f8f3e9', fontSize: { xs: '0.85rem', sm: '1rem' } }}>{dialogData.customer?.address}</Typography>
                </CardContent>
              </Card>

              <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography variant="h6" sx={{ color: '#d4af37', mb: 3, fontWeight: 'bold', textAlign: 'center' }}>📋 Order Summary</Typography>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                    <Typography sx={{ color: '#f8f3e9', fontWeight: 'bold' }}>Order #:</Typography>
                    <Typography sx={{ color: '#f8f3e9', fontFamily: 'monospace', fontSize: '0.85rem' }}>{dialogData.orderNumber}</Typography>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <Typography sx={{ color: '#f8f3e9', fontWeight: 'bold' }}>Status:</Typography>
                    <Chip label={dialogData.status?.toUpperCase()} color={getStatusChipColor(dialogData.status)} sx={{ fontWeight: 'bold', fontSize: '0.75rem' }} />
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <Typography sx={{ color: '#f8f3e9', fontWeight: 'bold' }}>Date:</Typography>
                    <Typography sx={{ color: '#f8f3e9', fontSize: '0.85rem' }}>{formatDate(dialogData.createdAt)}</Typography>
                  </div>

                  <Divider sx={{ my: 2, backgroundColor: 'rgba(212,175,55,0.3)' }} />

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                    <Typography sx={{ color: '#f8f3e9', fontWeight: 'bold' }}>Order Items:</Typography>
                    <Button sx={{ color: '#f8f3e9', fontWeight: 'bold', backgroundColor: 'green', fontSize: '0.75rem', py: 0.5, px: 2 }}
                      onClick={() => navigate('/secret/admin/factora/pdf-generation', { state: { orderData: dialogData } })}>
                      PDF
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {dialogData.items?.map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded-lg gap-2" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                        <Typography sx={{ color: '#f8f3e9', fontSize: '0.8rem', flex: 1 }}>{item.quantity}x {item.name} ({item.reference})</Typography>
                        <Typography sx={{ color: '#d4af37', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>{item.price} DZD</Typography>
                      </div>
                    ))}
                  </div>

                  <Divider sx={{ my: 2, backgroundColor: 'rgba(212,175,55,0.3)' }} />
                  <div className="flex justify-between items-center">
                    <Typography sx={{ color: '#f8f3e9', fontWeight: 'bold', fontSize: '1.1rem' }}>Total:</Typography>
                    <Typography sx={{ color: '#d4af37', fontWeight: 'bold', fontSize: '1.3rem' }}>{dialogData.total} DZD</Typography>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button onClick={handleCloseDialog} sx={{ backgroundColor: '#d4af37', color: '#2c0101', px: 4, fontWeight: 'bold', borderRadius: '8px', '&:hover': { backgroundColor: '#f8f3e9' } }}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>{snackbarMessage}</Alert>
      </Snackbar>
    </div>
  );
}