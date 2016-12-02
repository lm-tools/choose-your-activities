const express = require('express');
const router = new express.Router();

router.get('/', (req, res) => {
  res.render('unsorted-activities');
});

module.exports = router;
