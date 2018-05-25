const defaultMapping = require('../models/activities');

const commonMapping = {
  'GRP-1': [
    'ACT-7',
    'ACT-11',
    'ACT-9',
    'ACT-8',
    'ACT-3',
  ],
  'GRP-2': [
    'ACT-10',
    'ACT-19',
    'ACT-17',
    'ACT-18',
    'ACT-1',
    'ACT-2',
  ],
  'GRP-3': [
    'ACT-13',
    'ACT-14',
    'ACT-19',
    'ACT-6',
  ],
  'GRP-4': [
    'ACT-4',
    'ACT-19',
    'ACT-18',
    'ACT-6',
    'ACT-16',
    'ACT-2',
    'ACT-5',
  ],
  'GRP-5': [
    'ACT-16',
    'ACT-18',
    'ACT-7',
    'ACT-11',
    'ACT-2',
    'ACT-13',
  ],
  'GRP-6': [
    'ACT-10',
    'ACT-19',
    'ACT-13',
    'ACT-4',
    'ACT-17',
    'ACT-18',
    'ACT-7',
    'ACT-11',
    'ACT-8',
    'ACT-9',
    'ACT-16',
    'ACT-3',
    'ACT-1',
    'ACT-2',
    'ACT-5',
    'ACT-14',
    'ACT-6',
  ],
};

const config = {
  a: commonMapping,
  b: commonMapping,
};

function getActivitiesForGroup(version, group, excludeActivities = []) {
  const versionMapping = config[version];
  return (versionMapping && versionMapping[group] || defaultMapping)
    .filter(val => !excludeActivities.includes(val));
}

function getCountOfActivitiesForGroup(version, group) {
  return getActivitiesForGroup(version, group).length;
}

module.exports = { getActivitiesForGroup, getCountOfActivitiesForGroup };
