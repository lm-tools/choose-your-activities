const express = require('express');
const router = new express.Router();
const UrlChecker = require('../utils/url-checker');

const links = require('./../models/activities')
  .map(activity => `http://localhost:3000/a7031314-c8e5-4e80-b0eb-cd46a5b8dc45/activities/${activity}`);


router.get('', (req, res) =>
  new UrlChecker().checkForDeadLinks(links)
    .then(deadLinks => res.json(deadLinks))
);

module.exports = router;
