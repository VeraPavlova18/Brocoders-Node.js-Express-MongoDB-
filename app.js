/* eslint-disable no-console */
const express = require('express');
const { MongoClient } = require('mongodb');

const mongoClient = new MongoClient('mongodb://localhost:27017/', { useNewUrlParser: true });
let dbClient;

const port = process.env.port || 3000;
const app = express();

mongoClient.connect((err, client) => {
  if (err) console.log(err);
  dbClient = client;
  app.locals.collection = client.db('requestsTrap').collection('requests');
  app.listen(port, () => console.log('Server has started'));
});

app.get('/', (req, res) => {
  res.send(`<h1>Home page</h1>
  <h2> Please add any text after "/" in the address bar </h2>
  <p> <b> for example: /any_text </b> </p>
  <p> <b> or follow the link: <a href="/exampleURL">ExampleURL</a> </b> </p>`);
});

app.get('/:trap_id/requests', (req, res) => {
  const collection = req.app.locals.collection;
  collection.find({}).toArray((err, requests) => {
    if (err) console.log(err);
    console.log(requests);
    res.send(requests);
  });
});

app.use('/:trap_id', (req, res, next) => {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const data = `${hour}:${minutes}:${seconds} ${req.method} ${req.url}`;
  const request = { request: req.params.trap_id, data };

  const collection = req.app.locals.collection;

  collection.insertOne(request, (err, res) => {
    if (err) console.log(err);
  });
  next();
});

app.all('/:trap_id', (req, res) => {
  const trapId = req.params.trap_id;
  res.send(`<h1>${trapId}</h1>  
  <h2><a href="/${trapId}/requests">List of the received requests</a></h2>`);
});

process.on('SIGINT', () => {
  dbClient.close();
  process.exit();
});
