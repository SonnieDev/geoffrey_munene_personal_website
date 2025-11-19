import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Admin from '../models/Admin.js'
import connectDB from '../config/database.js'

dotenv.config()

async function checkAdminRole() {
  try {
    await connectDB()
    console.log('Connected to database\n')

    const admin = await Admin.findOne({ username: 'admin' }).select('-password')

    if (admin) {
      console.log('Admin Account Details:')
      console.log('====================')
      console.log(`Username: ${admin.username}`)
      console.log(`Email: ${admin.email || 'Not set'}`)
      console.log(`Role: ${admin.role || 'Not set'}`)
      console.log(`Status: ${admin.isActive ? 'Active' : 'Inactive'}`)
      console.log(`Last Login: ${admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}`)
      console.log(`Created: ${new Date(admin.createdAt).toLocaleString()}`)
    } else {
      console.log('Admin account not found')
    }

    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

checkAdminRole()

