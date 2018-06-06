const express = require('express');
const router = new express.Router({ mergeParams: true });

router.get('', (req, res) => {
  const accountId = req.params.accountId;

  res.render('activity-group-details', { accountId });
});

module.exports = router;
