const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaintingSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    filename: {
        type: Array,
        of: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    description: {
        type: String,
        default: ''
    },
    materials: {
        type: String,
        required: false,
    },
    price: {
        type: String,
        required: false
    },
    status: {
        type: String,
        default: 'Draft'
    },
    size: {
        type: String,
        required: false,
    },

    stock_amount: {
      type: Number,
      default: 1
    }

});

module.exports = Painting = mongoose.model('painting', PaintingSchema);
