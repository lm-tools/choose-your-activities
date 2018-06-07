const express = require('express');
const router = new express.Router({ mergeParams: true });

router.get('', (req, res) => {
  const accountId = req.params.accountId;

  res.render('chosen-activities', { accountId });
});

module.exports = router;
