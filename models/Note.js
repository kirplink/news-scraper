const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var NoteSchema = new Schema({
    body: {
        type: String
    }
});

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;