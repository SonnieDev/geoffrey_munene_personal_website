import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Blog from '../models/Blog.js'
import connectDB from '../config/database.js'

dotenv.config()

const blogThumbnails = {
  'How to Build a Productive Home Office Setup on Any Budget': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop',
  'Mastering Asynchronous Communication: The Key to Remote Team Success': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
  '10 Remote Job Interview Questions You Must Prepare For': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop',
  'The Ultimate Guide to Remote Work Productivity Tools in 2024': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
  'Building Your Remote Work Routine: A Step-by-Step Guide': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
}

const updateThumbnails = async () => {
  try {
    await connectDB()
    console.log('Connected to database')

    for (const [title, thumbnail] of Object.entries(blogThumbnails)) {
      const blog = await Blog.findOne({ title })
      
      if (blog) {
        blog.thumbnail = thumbnail
        await blog.save()
        console.log(`✅ Updated thumbnail for: "${title}"`)
      } else {
        console.log(`❌ Blog not found: "${title}"`)
      }
    }

    console.log('\n✨ All thumbnails updated successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error updating thumbnails:', error)
    process.exit(1)
  }
}

updateThumbnails()

