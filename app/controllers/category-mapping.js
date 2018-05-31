const commonMapping = [
  'READY',
  'HELP',
  'DOING',
  'NOT-SUITABLE',
];

const config = {
  a: commonMapping,
  b: commonMapping,
  c: [
    'DOING',
    'READY',
    'HELP',
    'NOT-WORKED',
    'NO',
  ],
};

function getCategoriesForVersion(version) {
  return config[version] || config.c;
}

module.exports = getCategoriesForVersion;
