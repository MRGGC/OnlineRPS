// Setting up global variables
const express = require('express');
const cookieParser = require('cookie-parser');
const funcs = require('./funcs');
const path = require('path');
const app = express();
const roomController = require('./controllers/roomController');
const socketController = require('./controllers/socketController');
const errorController = require('./controllers/errorController');

let rooms = {};

// app configuration
app.use(cookieParser());
app.use('/assets', express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");

// Firing room controller
roomController(app, rooms);

// Firing up error controller
errorController(app);

const server = app.listen(3000, () => console.log("Online RPS is running on port 3000..."));

// Setting up Web Socket
const socket = require('socket.io');
const io = socket(server);

// Firing socket controller on socket connection
io.on('connection', socket => socketController(io, socket, rooms));
