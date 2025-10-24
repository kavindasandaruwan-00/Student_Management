const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    Student_key: { type: String, required: true },
    Student_name: { type: String, required: true },
    Subject_key: { type: String, required: true },
    Grade: { type: String, required: true },
    Remarks: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
