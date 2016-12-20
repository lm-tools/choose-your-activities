const underTest = require('../../../app/controllers/activity-sorter');
const expect = require('chai').expect;
const allActivities = require('../../integration/support/test-data').allActivities;

describe('activity sorter', () => {
  [
    {
      name: '2 activities',
      toSort: [
        { activity: 'ACT-2' },
        { activity: 'ACT-1' },
      ],
      expected: [
        { activity: 'ACT-1' },
        { activity: 'ACT-2' },
      ],
    },
    {
      name: 'with double digits',
      toSort: [
        { activity: 'ACT-10' },
        { activity: 'ACT-3' },
      ],
      expected: [
        { activity: 'ACT-3' },
        { activity: 'ACT-10' },
      ],
    },
    {
      name: 'all activities',
      toSort: allActivities.map(x => ({ activity: x.name })),
      expected: allActivities.map(x => ({ activity: x.name })),
    },
    {
      name: 'already in correct order',
      toSort: [
        { activity: 'ACT-10' },
        { activity: 'ACT-11' },
      ],
      expected: [
        { activity: 'ACT-10' },
        { activity: 'ACT-11' },
      ],
    },
  ].forEach(scenario => {
    it(`should sort activities by name, scenario: ${scenario.name}`, () =>
      expect(underTest(scenario.toSort)).to.eql(scenario.expected)
    );
  });
});
