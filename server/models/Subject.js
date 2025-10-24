const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    Subject_key: { type: String, required: true },
    Subject_name: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
