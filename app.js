/* eslint-disable no-console */
const express = require('express');
const expressHbs = require('express-handlebars');
const bodyParser = require("body-parser");
const hbs = require('hbs');
const moment = require('moment');
const { MongoClient } = require('mongodb');

const mongoClient = new MongoClient('mongodb://localhost:27017/', { useNewUrlParser: true });
let dbClient;

const port = process.env.port || 3000;
const app = express();

app.engine('hbs', expressHbs({ layoutsDir: 'views/layouts', defaultLayout: 'layout', extname: 'hbs' }));
app.set('view engine', 'hbs');
hbs.registerPartials(`${__dirname}/views/partials`);

mongoClient.connect((err, client) => {
  if (err) console.log(err);
  dbClient = client;
  app.locals.collection = client.db('requestsTrap').collection('requests');
  app.listen(port, () => console.log('Server has started'));
});

app.get('/', (req, res) => {
  res.render('home', { title: 'Requests Trap' });
});

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', (req, res) => res.redirect(`${req.body.reqExample || 'urlDefault'}`));

app.get('/:trap_id/requests', (req, res) => {
  const collection = req.app.locals.collection;
  collection.find({}).toArray((err, requests) => {
    if (err) console.log(err);
    res.render('requestsList', {
      requests,
      title: 'Requests List',
    });
  });
});

app.use('/:trap_id', (req, res, next) => {
  const data = moment().format('MMMM Do YYYY, h:mm:ss a');
  const reqInfo = `${data} ${req.method} ${req.url}`;
  const request = { request: req.params.trap_id, reqInfo };

  const collection = req.app.locals.collection;
  if (request.request !== 'styles') {
    collection.insertOne(request, (err, res) => {
      if (err) console.log(err);
    });
  }
  next();
});

app.all('/:trap_id', (req, res) => {
  const trapId = req.params.trap_id;
  res.render('trapId', {
    trapId,
    title: 'Request trap',
  });
});

process.on('SIGINT', () => {
  dbClient.close();
  process.exit();
});
