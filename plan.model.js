const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Plan = new Schema({
    title: String,
    start: { type: Date, default: new Date() },
    end: { type: Date, default: new Date() },
    id: Number
});

module.exports = mongoose.model('Plan', Plan);