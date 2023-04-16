const mongoose = require("mongoose");
const {Snowflake} = require("@theinternetfolks/snowflake");

const communitySchema = new mongoose.Schema({
    _id: {
        type: String,
        default: function genID() {
            return Snowflake.generate();
        }
    },
    name:{
        type:String
    },
    slug:{
        type:String,
        unique:true
    },
    owner: {
        type: String,
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

module.exports = mongoose.model('community',communitySchema);