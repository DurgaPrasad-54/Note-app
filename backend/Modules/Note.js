const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
},{ timestamps: true });
const Note = mongoose.model('notes', userSchema);
module.exports = Note;