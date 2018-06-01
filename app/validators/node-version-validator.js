const semver = require('semver');
const { engines: { node } } = require('../../package');

const versions = {
  expectedRange: semver.validRange(node),
  actual: semver.valid(process.version),
};

const validNodeVersion = semver.satisfies(versions.actual, versions.expectedRange);

module.exports = () => {
  if (!validNodeVersion) {
    throw new Error(`Expected Node.js version ${versions.expectedRange}, but found 
    ${versions.actual}. Please update or change your runtime!`);
  }
};
