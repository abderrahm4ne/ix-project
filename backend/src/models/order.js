import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String, required: true },
    Wilaya: { type: String, required: true}
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true },
      reference: { type: String, required: true}
    }
  ],
  total: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ["Cash on Delivery"], 
    default: "Cash on Delivery" 
  },
  status: { 
    type: String, 
    enum: ["pending", "paid", "shipped", "delivered", "cancelled"], 
    default: "pending" 
  },
  createdAt: { type: Date, default: Date.now },
  orderNumber: { type: String, unique: true, required: true }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;