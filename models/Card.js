const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CardSchema = new Schema({
    question: String,
    answer: String,
});

module.exports = mongoose.model("Card", CardSchema);