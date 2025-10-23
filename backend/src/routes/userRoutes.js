import express from 'express';  
import bcrypt from 'bcrypt';
import validateUser from '../middlewares/validation.js'
import User from '../models/users.js'
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', validateUser, async (req, res) => {

    try{
        const { firstName, lastName, email, password } = req.body;

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: 'user'
        })

        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        })
        
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', err: error.message });
    }

});

router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;
    
    try{
        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({ message : 'User not found'})
        }
 
        const isMatchPassword = await bcrypt.compare(password, user.password)

        if(!isMatchPassword){
            return res.status(400).json({ message : 'Invalid Password'})
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie("adminToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000
        });

        res.status(200).json({ message : 'Login successful', token: token})
    } catch (error) {
        if (err.response) {
            console.error("Error status:", err.response.status);
            console.error("Error data:", err.response.data);
        } else if (err.request) {
            console.error("No response:", err.request);
        } else {
            console.error("Error message:", err.message);
  }
    }
})

router.get('/admin/verify', (req, res) => {
  const token = req.cookies.adminToken;

  if (!token) {
    return res.status(401).json({ valid: false, message: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ valid: false, message: 'Unauthorized' });
    }

    res.json({ valid: true, role: decoded.role });
  } catch (err) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});



export default router;