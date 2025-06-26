import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Database connection Successful")
    } catch (error) {
        console.log("Database connection Failed")
    }
}
