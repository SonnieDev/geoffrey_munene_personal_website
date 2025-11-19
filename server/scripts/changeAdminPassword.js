import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Admin from '../models/Admin.js'
import connectDB from '../config/database.js'
import { validatePassword, generateSecurePassword } from '../utils/passwordValidator.js'
import readline from 'readline'

dotenv.config()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

async function changeAdminPassword() {
  try {
    await connectDB()
    console.log('Connected to database\n')

    const username = await question('Enter admin username: ')
    const admin = await Admin.findOne({ username: username.toLowerCase() })

    if (!admin) {
      console.log('❌ Admin not found!')
      process.exit(1)
    }

    console.log(`\nFound admin: ${admin.username}`)
    console.log(`Current role: ${admin.role || 'Not set'}\n`)

    const useGenerated = await question('Generate a secure random password? (y/n): ')
    let newPassword

    if (useGenerated.toLowerCase() === 'y') {
      newPassword = generateSecurePassword()
      console.log(`\n✅ Generated secure password: ${newPassword}`)
      console.log('⚠️  IMPORTANT: Save this password securely! You won\'t be able to see it again.\n')
    } else {
      newPassword = await question('Enter new password: ')
      
      // Validate password
      const validation = validatePassword(newPassword)
      if (!validation.valid) {
        console.log('\n❌ Password does not meet security requirements:')
        validation.errors.forEach(err => console.log(`   - ${err}`))
        console.log('\nPassword requirements:')
        console.log('   - At least 8 characters long')
        console.log('   - Contains uppercase and lowercase letters')
        console.log('   - Contains at least one number')
        console.log('   - Contains at least one special character')
        console.log('   - Not a common/weak password')
        process.exit(1)
      }

      const confirmPassword = await question('Confirm new password: ')
      if (newPassword !== confirmPassword) {
        console.log('❌ Passwords do not match!')
        process.exit(1)
      }
    }

    // Update password
    admin.password = newPassword
    await admin.save()

    console.log('\n✅ Password changed successfully!')
    if (useGenerated.toLowerCase() === 'y') {
      console.log(`\n📋 Your new password: ${newPassword}`)
      console.log('⚠️  Please save this password securely and change it after first login!')
    }
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    rl.close()
  }
}

changeAdminPassword()

