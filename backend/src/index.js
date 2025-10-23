import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import mongoConnection from './db/mongo.js'
import orderRoutes from './routes/orderRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import cookieParser from 'cookie-parser'
import upload from '../uploads/upload.js';

dotenv.config()

const app = express();

app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
];
app.use(cors(
    {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,

    }
))
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', contactRoutes);
app.use('/api', upload);



app.get('/', (req, res) => {
    res.send('API is running...');
});

mongoConnection;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  const clientPath = path.resolve(__dirname, '../../frontend', 'build');
  app.use(express.static(clientPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})