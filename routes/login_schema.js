const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/nutrition", { useNewUrlParser: true, useUnifiedTopology: true });

const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        min: 15,
    },
    weight: {
        type: Number,
        required: true,
        min: 40,
    },
    photos: {
        type: [String], // Store multiple photo URLs or file paths
        required: false,
    }
});

module.exports = mongoose.model("Login", loginSchema);
