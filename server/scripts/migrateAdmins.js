import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Admin from '../models/Admin.js'
import connectDB from '../config/database.js'

dotenv.config()

async function migrateAdmins() {
  try {
    await connectDB()
    console.log('Connected to database')

    // Find all admins without roles
    const adminsWithoutRoles = await Admin.find({ role: { $exists: false } })

    if (adminsWithoutRoles.length === 0) {
      console.log('✅ All admins already have roles assigned.')
      process.exit(0)
    }

    console.log(`Found ${adminsWithoutRoles.length} admin(s) without roles.`)

    // Make the first admin a super_admin, rest become admin
    for (let i = 0; i < adminsWithoutRoles.length; i++) {
      const admin = adminsWithoutRoles[i]
      const role = i === 0 ? 'super_admin' : 'admin'
      
      admin.role = role
      admin.isActive = admin.isActive !== undefined ? admin.isActive : true
      
      // Ensure username is lowercase
      if (admin.username !== admin.username.toLowerCase()) {
        admin.username = admin.username.toLowerCase()
      }
      
      await admin.save()
      console.log(`✅ Updated ${admin.username} to role: ${role}`)
    }

    console.log('\n✅ Migration completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error migrating admins:', error)
    process.exit(1)
  }
}

migrateAdmins()

