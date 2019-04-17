/* eslint-disable no-console */

const moment = require('moment');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');

const { mongoose, Request } = require('../mongoose/index');

module.exports = function (app) {
  app.use(cookieParser());

  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, () => {
    try {
      app.listen(process.env.PORT, () => console.log('Server has started'));
    } catch (err) {
      console.err(err);
    }
  });

  app.engine('hbs', expressHbs({ layoutsDir: 'views/layouts', defaultLayout: 'layout', extname: 'hbs' }));
  app.set('view engine', 'hbs');

  hbs.registerPartials('views/partials');

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
    Request.paginate({}, { limit: 5, page })
      .then(({ docs, total, limit }) => {
        let i = 0;
        docs.map((obj) => {
          obj.i = (page - 1) * limit + i + 1;
          i += 1;
          return obj;
        });
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
    method, ip, protocol, params: { trap_id: trapId }, query, cookies, headers,
  }, res, next) => {
    const date = moment().format('MMMM Do YYYY, h:mm:ss a');
    query = JSON.stringify(query);
    cookies = JSON.stringify(cookies);
    headers = JSON.stringify(headers);
    const request = new Request({
      trapId, date, ip, method, protocol, query, cookies, headers,
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
};
