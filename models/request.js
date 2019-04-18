const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const schema = new mongoose.Schema({
  trapId: { type: String, required: true },
  date: { type: String, required: true },
  ip: { type: String, required: true },
  method: { type: String, required: true },
  protocol: { type: String, required: true },
  query: { type: String, default: '' },
  queryParams: { type: String, default: '' },
  cookies: { type: String, default: '' },
  headers: { type: String, default: '' },
});

schema.plugin(mongoosePaginate);

module.exports = mongoose.models.Request || mongoose.model('Request', schema);
