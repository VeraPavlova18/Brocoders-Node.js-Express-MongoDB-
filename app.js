/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const express = require('express');
const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const moment = require('moment');

const Schema = mongoose.Schema;

const app = express();
const reqTrapScheme = new Schema({
  trapId: String,
  date: String,
  ip: String,
  method: String,
  protocol: String,
  query: { type: String, default: '' },
}, { versionKey: false });
reqTrapScheme.plugin(mongoosePaginate);
const Request = mongoose.model('Request', reqTrapScheme);


app.engine('hbs', expressHbs({ layoutsDir: 'views/layouts', defaultLayout: 'layout', extname: 'hbs' }));
app.set('view engine', 'hbs');
hbs.registerPartials(`${__dirname}/views/partials`);

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, () => {
  try {
    app.listen(process.env.PORT, () => console.log('Server has started'));
  } catch (err) {
    console.err(err);
  }
});

app.get('/', (req, res) => {
  try {
    res.render('home', { title: 'Requests Trap' });
  } catch (err) {
    console.err(err);
  }
});

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', ({ body: { reqExample } }, res) => res.redirect(reqExample || 'urlDefault'));

app.get('/:trap_id/requests', ({ query: { page } }, res) => {
  page = +page || 1;

  Request.paginate({}, { limit: 10, page })
    .then(({ docs, total, limit }) => {
      res.render('requestsList', {
        requests: docs,
        title: 'Requests List',
        nextPage: page === Math.ceil(total / limit) ? null : page + 1,
        prevPage: page < 1 ? null : page - 1,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use('/:trap_id', ({
  method, ip, protocol, params: { trap_id: trapId }, query,
}, res, next) => {
  const date = moment().format('MMMM Do YYYY, h:mm:ss a');
  query = JSON.stringify(query);
  const request = new Request({
    trapId, date, ip, method, protocol, query,
  });
  try {
    request.save();
  } catch (err) {
    console.err(err);
  }
  next();
});

app.all('/:trap_id', ({ params: { trap_id: trapId } }, res) => {
  try {
    res.render('trapId', { trapId, title: 'Request trap' });
  } catch (err) {
    console.err(err);
  }
});
