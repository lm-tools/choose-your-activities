const express = require('express');
const router = new express.Router({ mergeParams: true });
const uuid = require('uuid');

router.get('/', (req, res) => {
  res.redirect(`${req.app.locals.basePath}/${uuid.v4()}/introduction`);
});

router.get('/:accountId/introduction', (req, res) => {
  res.render('introduction');
});

module.exports = router;
