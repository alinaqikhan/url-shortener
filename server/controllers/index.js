const { validationResult } = require('express-validator');

const Url = require('../models/url');

exports.getUrls = async (req, res, next) => {
  const page = req.query.page || 1;
  const itemsPerPage = 5;
  try {
    const urls = await Url.find()
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);
    let message = 'Success!';
    if (urls.length === 0) {
      message = 'No URLs found!';
    }
    res.status(200).json({ message, urls });
  } catch (err) {
    next(err);
  }
};

exports.getUrl = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed!');
    err.statusCode = 422;
    err.data = errors.array();
    return next(err);
  }
  const { shortUrl } = req.params;
  try {
    const url = await Url.findOne({ shortUrl });
    if (!url) {
      const err = new Error('URL not found!');
      err.statusCode = 404;
      return next(err);
    }
    url.clicks += 1;
    await url.save();
    res.status(200).json({ message: 'Success!', url });
  } catch (err) {
    next(err);
  }
};

exports.createUrl = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed!');
    err.statusCode = 422;
    err.data = errors.array();
    return next(err);
  }
  const { fullUrl } = req.body;
  try {
    const existedUrl = await Url.findOne({ fullUrl });
    if (existedUrl) {
      const err = new Error('URL already existed!');
      err.statusCode = 400;
      err.data = existedUrl;
      return next(err);
    }
    const newUrlDoc = new Url({ fullUrl });
    const url = await newUrlDoc.save();
    res.status(201).json({ message: 'URL created!', url });
  } catch (err) {
    next(err);
  }
};
