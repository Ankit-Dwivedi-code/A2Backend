// models/courseModel.js
import mongoose from 'mongoose';

// Define the Course schema
const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer', // Assuming a 'Teacher' model exists
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    courseVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video' // Referencing the Video model
        }
    ],
    tags: {
        type: [String],
        default: []
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    language: {
        type: String,
        default: 'English'
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0
    },
    enrolledStudents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }
    ],
}, { timestamps: true });

export const Course = mongoose.model('Course', courseSchema);
