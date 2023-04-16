const mongoose = require("mongoose");
const {Snowflake} = require("@theinternetfolks/snowflake");

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: function genID() {
            return Snowflake.generate();
        }
    },
    name: {
        type: String,
        default: null
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        max: 64
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', userSchema);