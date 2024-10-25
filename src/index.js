// require('dotenv').config({path:'./env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path:'./env'
})

// Connecting to MongoDB and starting the server
connectDB()
.then(()=>{
  // If the database connection is successful, start the Express server
  app.listen(process.env.PORT || 8000, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
    
  })

   // Event listener for any errors that may occur with the app
  app.on("error", (err)=>{
    console.error("An error occured on connecting to database!", err);
    
  })
})
.catch((err)=>{
   // If MongoDB connection fails, log the error
  console.log("MongoDB connection failed!!", err);
  
})



// The commented-out code below provides an alternative approach using an async IIFE (Immediately Invoked Function Expression)

/*
import express from 'express'

const app = express()

( async()=>{
    try {
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) 
      app.on("error",(error)=>{
        console.log(error);
        throw error
      })

      app.listen(process.env.PORT, ()=>{
        console.log(`App is running on port ${process.env.PORT}`);
        
      })
    } catch (error) {
        console.error(error);
        throw error
    }    
})()
*/