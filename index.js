//Imports and Config
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const config = require('./config.js');
//DB Setup

mongoose.connect('mongodb://'+config.username+':'+config.password+'@ds143030.mlab.com:43030/'+config.databaseName);

//App Setup
app.use(morgan("combined"));
app.use(bodyParser({type: '*/*'}));
router(app);
//server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("server listening on port ", port); 