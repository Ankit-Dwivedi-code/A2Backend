import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// Function to establish a connection to the MongoDB database
const connectDB = async () => {
    try {
        // Connect to the MongoDB database using the URI and database name from environment variables
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        
        // Log the host where MongoDB is connected
        console.log(`MongoDB connected!! ${connectionInstance.connection.host}`);
       
    } catch (error) {
        // Log the error if the connection fails
        console.log("MongoDB connection error : ", error);
        
        // Exit the process with failure status
        process.exit(1);
    }
}

// Export the connectDB function to be used in other parts of the application
export default connectDB;
