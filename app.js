/* eslint-disable no-console */

const http = require('http');
const express = require('express');
const socketio = require('socket.io');
require('./db/mongoose');
const expressHbs = require('express-handlebars');
const hbs = require('hbs');
const requestRouter = require('./routers/request');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.locals.io = io;

app.engine('hbs', expressHbs({ layoutsDir: 'views/layouts', defaultLayout: 'layout', extname: 'hbs' }));
app.set('view engine', 'hbs');
hbs.registerPartials('views/partials');

app.use('/assets', express.static('assets'));
app.use('/', requestRouter);

server.listen(process.env.PORT, () => console.log('Server has started'));
