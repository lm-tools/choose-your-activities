const underTest = require('../../../app/models/activity-group');
const expect = require('chai').expect;
const allGroups = [
  'GRP-1',
  'GRP-2',
  'GRP-3',
  'GRP-4',
  'GRP-5',
  'GRP-6',
];

describe('activity groups list', () => {
  it('should get all groups', () => {
    expect(underTest).to.eql(allGroups);
  });
});
