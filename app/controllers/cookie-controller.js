const express = require('express');
const router = new express.Router({ mergeParams: true });

router.get('/cookie', (req, res) => {
  const accountId = req.query.id;

  if (accountId) {
    res.redirect(`${req.app.locals.basePath}/${accountId}/cookie`);
  } else {
    res.render('cookie');
  }
});

router.get('/:accountId/cookie', (req, res) => {
  res.render('cookie', { accountId: req.params.accountId });
});

module.exports = router;
