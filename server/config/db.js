import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://officialaditshrm:resumebuilderpassword@cluster0.o8t53u0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log("Database connection Successful")
    } catch (error) {
        console.log("Database connection Failed")
    }
}
