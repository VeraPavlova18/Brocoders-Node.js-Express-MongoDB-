/* eslint-disable no-console */

require('dotenv').config();
const express = require('express');
require('./db/mongoose');
const expressHbs = require('express-handlebars');
const hbs = require('hbs');
const requestRouter = require('./routers/request');

const app = express();

app.engine('hbs', expressHbs({ layoutsDir: 'views/layouts', defaultLayout: 'layout', extname: 'hbs' }));
app.set('view engine', 'hbs');
hbs.registerPartials('views/partials');

app.use(requestRouter);


app.listen(process.env.PORT, () => console.log('Server has started'));
