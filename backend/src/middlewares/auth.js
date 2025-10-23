import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const adminAuthentication = (req, res, next) => {

    const token = req.cookies?.adminToken;

    if(!token){
        return res.status(401).json({ message: 'No token provided' });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role !== 'admin'){
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }

        req.user = decoded;
        next();
    } catch(error){
        return res.status(401).json({ message: 'Invalid token', error: error.message });
    }

}

export default adminAuthentication;