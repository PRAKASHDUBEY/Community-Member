const mongoose = require("mongoose");

class DB{
    constructor(){
        this.MONGO_URI = process.env.MONGO_URI;
        
    }
    async connect(){
        try{
            this.conn = await mongoose.connect(this.MONGO_URI,{
                useNewUrlParser:true,
                useUnifiedTopology:true
            });
            console.log(this.Logs().connected.cyan.bold.underline);
            
        }catch(err){
            console.log(this.Logs().failed.red.bold.underline);
        }
       
    }
    Logs() {
        return {
            failed: `MongoDB connection failed`,
            connected: `MongoDB connected: ${this.conn.connection.host}`
        }
    }
}
module.exports = DB;