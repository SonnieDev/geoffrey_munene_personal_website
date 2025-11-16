import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Admin from '../models/Admin.js'
import connectDB from '../config/database.js'

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

const createAdmin = async () => {
  try {
    const username = process.argv[2] || 'admin'
    const password = process.argv[3] || 'admin123'

    // Check if admin exists
    const adminExists = await Admin.findOne({ username })

    if (adminExists) {
      console.log('❌ Admin with this username already exists!')
      process.exit(1)
    }

    // Create admin
    const admin = await Admin.create({
      username,
      password,
    })

    console.log('✅ Admin created successfully!')
    console.log(`   Username: ${admin.username}`)
    console.log(`   ID: ${admin._id}`)
    console.log('\n⚠️  Please change the default password after first login!')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating admin:', error.message)
    process.exit(1)
  }
}

createAdmin()

