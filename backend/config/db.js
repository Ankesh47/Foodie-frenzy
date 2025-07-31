import mongoose from "mongoose";

// project ID :   6863c6937caa4f461ee2c23c

export const connectDB = async () => {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://elexier59:q7UXMEAJCocX0T6c@ankesh.lug4ly2.mongodb.net/food_delivery';
    await mongoose.connect(mongoURI)
    .then(() => console.log("DB connected!"))
}





