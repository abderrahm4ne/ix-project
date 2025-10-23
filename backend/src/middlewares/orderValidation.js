const OrderValidation = (req, res, next) => {
  const { customer, items} = req.body;

  if (!customer) {
    return res.status(400).json({ message: "Missing customer data" });
  }

  const { name, email, phone, address, Wilaya} = customer;

  if (!name || !email || !phone || !address || !Wilaya) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ message: "Invalid name" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const phoneRegex = /^[0-9]{8,14}$/; 
  if (typeof phone !== "string" || !phoneRegex.test(phone)) {
    return res.status(400).json({ message: "Invalid phone number" });
  }

  if (typeof address !== "string" || address.trim().length < 3) {
    return res.status(400).json({ message: "Invalid address" });
  }

  if (isNaN(Wilaya) || Number(Wilaya) <= 0 || Number(Wilaya) > 58) {
    return res.status(400).json({ message: "Invalid Wilaya" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order must include at least one item" });
  }

  next();
};

export default OrderValidation;
