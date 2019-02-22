/* eslint-disable */
// this file is copied from Universe

const domify = require('domify');

module.exports = function createElement(html) {
  return domify(html);
};
