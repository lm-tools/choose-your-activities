const express = require('express');
const router = new express.Router({ mergeParams: true });

router.get('/', (req, res) =>
  res.render('sorted-activities', { accountId: req.params.accountId })
);

module.exports = router;
