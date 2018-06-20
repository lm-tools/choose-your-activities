const express = require('express');
const router = new express.Router({ mergeParams: true });
const config = require('../../config/du-ver-mapping');
const prototypeMapper = config[process.env.NODE_ENV || 'test'];

const uuid = require('uuid');

const newAccountId = () => uuid.v4();

const introductionUrl = (basePath, version, accountId) =>
  `${basePath}/${version}/${accountId}/introduction`;

router.get('/', (req, res) => {
  const basePath = req.app.locals.basePath;
  const version = prototypeMapper[req.query.du] || prototypeMapper.default;
  const accountId = req.query.id || newAccountId();

  res.redirect(introductionUrl(basePath, version, accountId));
});

router.get('/:version/:accountId/', (req, res) => {
  const basePath = req.app.locals.basePath;
  const { version, accountId } = req.params;

  res.redirect(introductionUrl(basePath, version, accountId));
});

router.get('/:version?/:accountId/introduction', (req, res) => {
  const accountId = req.params.accountId;

  res.render('introduction', { accountId });
});

module.exports = router;
