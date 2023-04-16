const mongoose = require("mongoose");
const {Snowflake} = require("@theinternetfolks/snowflake");

const memberSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: function genID() {
            return Snowflake.generate();
        }
    },
    community: {
        type: String
    },
    user: {
        type: String
    },
    role: {
        type: String
    },
    created_at:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('member',memberSchema);