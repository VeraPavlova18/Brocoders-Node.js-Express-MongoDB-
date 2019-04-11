/* eslint-disable no-console */
const express = require('express');

const port = process.env.port || 3000;
const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Home page</h1>');
});

app.listen(port, () => console.log('Server has started'));
