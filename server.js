const express = require("express");
const colors = require("colors");
const appConfig = require('./config/appConfig');
const routes = require('./web/routes'); 

class Server {
    constructor() {
        this.app = express();
    }
    appConfig(){        
        new appConfig(this.app).includeConfig();
    }
    includeRoutes(){
        new routes(this.app).routesConfig();
    }
    appExecute() {

        this.appConfig();
        this.includeRoutes();

        this.PORT = process.env.PORT;
        this.HOST = process.env.HOST;

        this.app.listen(this.PORT, 
            console.log(`Listening on http://${this.HOST}:${this.PORT}`.magenta.underline.bold));
    }

}
const server = new Server();
server.appExecute();