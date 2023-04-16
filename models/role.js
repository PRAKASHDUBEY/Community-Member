const mongoose = require("mongoose");
const {Snowflake} = require("@theinternetfolks/snowflake");

const roleSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: function genID() {
            return Snowflake.generate();
        }
    },
    name:{
        type:String,
        unique:true
    },
    created_at:{
        type:Date,
        default:Date.now
    },
    updated_at:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('role',roleSchema);