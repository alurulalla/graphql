const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    comment: String,
    userId: String
});

module.exports = mongoose.model('Post', postSchema);