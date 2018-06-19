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

module.exports = (version) => config[version] || config.c;
