const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const DB = require("./db");

class AppConfig {
    constructor(app) {

        dotenv.config({
            path:'./config/config.env'
        });
        this.app = app;
    }
    includeConfig() {
        this.app.use(
            express.urlencoded({ 
                extended: true 
            })
        );

        this.app.use(
            express.json()
        );

        this.app.use(
            express.json({
                extented: true
            })
        );

        this.app.use(
            morgan("dev")
        );
        
        this.DB = new DB;
        this.DB.connect();
    }
}

module.exports = AppConfig;