import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Admin from '../models/Admin.js'
import connectDB from '../config/database.js'

dotenv.config()

async function listAdmins() {
  try {
    await connectDB()
    console.log('Connected to database\n')

    const admins = await Admin.find({}).select('username email role isActive lastLogin createdAt').sort({ createdAt: 1 })

    if (admins.length === 0) {
      console.log('No admins found in the database.')
      process.exit(0)
    }

    console.log(`Found ${admins.length} admin(s):\n`)
    console.log('─'.repeat(80))
    console.log(
      'Username'.padEnd(20) +
      'Email'.padEnd(30) +
      'Role'.padEnd(15) +
      'Status'.padEnd(10) +
      'Last Login'
    )
    console.log('─'.repeat(80))

    admins.forEach((admin, index) => {
      const username = (admin.username || '-').padEnd(20)
      const email = ((admin.email || '-').substring(0, 28)).padEnd(30)
      const role = (admin.role || 'admin').padEnd(15)
      const status = (admin.isActive ? 'Active' : 'Inactive').padEnd(10)
      const lastLogin = admin.lastLogin 
        ? new Date(admin.lastLogin).toLocaleDateString() 
        : 'Never'

      console.log(`${username}${email}${role}${status}${lastLogin}`)
    })

    console.log('─'.repeat(80))
    console.log(`\nTotal: ${admins.length} admin(s)`)
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

listAdmins()

