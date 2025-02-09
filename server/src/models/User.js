const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    credits: {
        type: Number,
        default: 5,
        required: true
    },
    lastRechargeDate: {
        type: Date
    }
},
{timestamps: true}
);

module.exports = mongoose.model('User', userSchema);