const express = require('express');
const { body, param } = require('express-validator');

const controllers = require('../controllers');

const router = express.Router();

// -> GET /
router.get('/', controllers.getUrls);

// -> GET /:shortUrl
router.get(
  '/:shortUrl',
  param('shortUrl')
    .trim()
    .isAlphanumeric()
    .isLength({ min: 7 })
    .withMessage('Invalid Short URL'),
  controllers.getUrl,
);

// -> POST /
router.post(
  '/',
  body('fullUrl').trim().isURL().withMessage('Invalid URL'),
  controllers.createUrl,
);

module.exports = router;
