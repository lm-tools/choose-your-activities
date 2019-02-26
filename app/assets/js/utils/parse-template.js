/* eslint-disable */
// this file is copied from Universe

const createElement = require('./create-element');

module.exports = function parseTemplate(templateString, substitutes = {}, returnString = false) {
  for (const KEY in substitutes) {
    if (substitutes.hasOwnProperty(KEY)) {
      templateString = templateString.replace(new RegExp(`{${KEY}}`, 'g'), substitutes[KEY]);
    }
  }

  return returnString ? templateString : createElement(templateString);
};
