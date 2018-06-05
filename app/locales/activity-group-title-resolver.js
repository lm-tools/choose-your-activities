/* eslint-disable no-underscore-dangle */
const i18n = require('i18n');
const groupsPrototypeVersion = require('../controllers/version-utils');

module.exports = function resolveGroupTitle(version, group) {
  return groupsPrototypeVersion(version) ? i18n.__(`activity-group.${version}.${group}.title`) : '';
};
