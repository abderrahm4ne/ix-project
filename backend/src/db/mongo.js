import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const mongoConnection = mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME
}).then(() => {
    console.log({message: 'Connected to MongoDB'});
}).catch((error) => {
    console.error({message: 'Error connecting to MongoDB', error: error})
})

export default mongoConnection;