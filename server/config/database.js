import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/geoffrey-munene', {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`)
    // Don't exit process - allow server to run even if DB connection fails
    console.log('Server will continue running, but database features may not work.')
  }
}

export default connectDB

