const express = require('express');
const router = new express.Router({ mergeParams: true });
const config = require('../../config/du-ver-mapping');
const prototypeMapper = config[process.env.NODE_ENV || 'test'];

const uuid = require('uuid');

router.get('/', (req, res) => {
  const accountId = req.query.id;
  const version = prototypeMapper[req.query.du] ? prototypeMapper[req.query.du]
    : prototypeMapper.default;
  let url;
  if (accountId) {
    url = `${req.app.locals.basePath}/${version}/${accountId}/introduction`;
  } else {
    url = `${req.app.locals.basePath}/${version}/${uuid.v4()}/introduction`;
  }
  res.redirect(url);
});

router.get('/:version?/:accountId/introduction', (req, res) => {
  res.render('introduction', { accountId: req.params.accountId });
});

module.exports = router;
