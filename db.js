const mongoose = require('mongoose');

const mongoURL = 'mongodb://localhost:27017/l1f22bsse0199'

mongoose.connect(mongoURL)
const db = mongoose.connection;


db.on('connected', () => {
    console.log('MongoDB connected');
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

module.exports = db;