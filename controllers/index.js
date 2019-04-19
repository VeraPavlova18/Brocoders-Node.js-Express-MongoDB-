/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
/* eslint-disable no-console */

const moment = require('moment');
const querystring = require('querystring');
const Request = require('../models/request');

const getMaine = (req, res) => res.render('home', { title: 'Requests Trap' });

const postMaine = ({ body: { reqExample } }, res) => res.redirect(reqExample || 'urlDefault');

const getRequests = async ({ query: { page = '1' } }, res) => {
  try {
    const { docs, total, limit } = await Request.paginate({}, { limit: 5, page, sort: { date: -1 } });
    let i = 0;
    docs.map((obj) => {
      obj.i = (+page - 1) * limit + i + 1;
      i += 1;
      return obj;
    });
    res.render('requestsList', {
      requests: docs,
      title: 'Requests List',
      nextPage: +page === Math.ceil(total / limit) ? null : +page + 1,
      prevPage: +page < 1 ? null : +page - 1,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const useTrapId = async ({
  method, ip, protocol, params: { trap_id: trapId }, cookies, headers, query,
}, res, next) => {
  const date = moment().format('MMMM Do YYYY, h:mm:ss a');
  query = querystring.stringify(query);
  const queryParams = query.replace(/&/g, '\n');
  cookies = querystring.stringify(cookies, '\n', ': ');
  headers = decodeURIComponent(querystring.stringify(headers, '\n', ': '));

  const request = new Request({
    trapId, date, ip, method, protocol, query, queryParams, cookies, headers,
  });
  try {
    await request.save();
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
  next();
};

const allTrapId = async ({ params: { trap_id: trapId } }, res) => {
  try {
    await res.render('trapId', { trapId, title: 'Request trap' });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

module.exports = { getMaine, postMaine, getRequests, useTrapId, allTrapId };
