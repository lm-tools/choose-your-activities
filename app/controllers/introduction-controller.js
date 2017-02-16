const express = require('express');
const router = new express.Router({ mergeParams: true });
const uuid = require('uuid');

router.get('/', (req, res) => {
  const accountId = req.query.id;

  if (accountId) {
    res.redirect(`${req.app.locals.basePath}/${accountId}/introduction`);
  } else {
    res.redirect(`${req.app.locals.basePath}/${uuid.v4()}/introduction`);
  }
});

router.get('/:accountId/introduction', (req, res) => {
  res.render('introduction', { accountId: req.params.accountId });
});

module.exports = router;
