/* eslint-disable no-underscore-dangle */
const i18n = require('i18n');

module.exports = function (activity) {
  return {
    activity: activity.activity,
    category: activity.category,
    title: i18n.__(`activity.${activity.activity}.title`),
    details: i18n.__(`activity.${activity.activity}.details`),
  };
};
