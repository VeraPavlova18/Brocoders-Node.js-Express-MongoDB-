/* eslint-disable object-curly-newline */
/* eslint-disable no-console */

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { getMaine, postMaine, getRequests, useTrapId, allTrapId } = require('../controllers');

const router = new express.Router();

router.use(cookieParser());

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', getMaine);

router.post('/', postMaine);

router.get('/:trap_id/requests', getRequests);

router.use('/:trap_id', useTrapId);

router.all('/:trap_id', allTrapId);

module.exports = router;
