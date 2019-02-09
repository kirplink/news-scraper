const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var NoteSchema = new Schema({
    name: {
        type: String,
        default: "Anonymous"
    },
    body: {
        type: String
    }
});

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;