require('dotenv').config();
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const reqTrapScheme = new Schema({
  trapId: String,
  date: String,
  ip: String,
  method: String,
  protocol: String,
  query: { type: String, default: '' },
  cookies: { type: String, default: '' },
  headers: { type: String, default: '' },
}, { versionKey: false });

reqTrapScheme.plugin(mongoosePaginate);

const Request = mongoose.model('Request', reqTrapScheme);

module.exports = { mongoose, Request };
