const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ErrorSchema = new Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    error: {
        type: String,
        required: true,
    },
    extraInfo: {
        type: Object,
        required: false
    }
});

module.exports = myError = mongoose.model('error', ErrorSchema);