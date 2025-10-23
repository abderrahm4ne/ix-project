export default function validateContact(req, res, next) {
  const { name, email, subject, message } = req.body;

  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = "Name is required and must be at least 2 characters long";
  }

  if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    errors.email = "A valid email is required";
  }

  if (subject && subject.trim().length > 80) {
    errors.subject = "Subject cannot be longer than 80 characters";
  }

  if (!message || message.trim().length < 5) {
    errors.message = "Message is required and must be at least 5 characters long";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
}
