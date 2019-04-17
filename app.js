/* eslint-disable no-console */

const express = require('express');

const app = express();
require('./routes')(app);
