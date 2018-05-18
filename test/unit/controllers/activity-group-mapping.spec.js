const underTest = require('../../../app/controllers/activity-group-mapping');
const expect = require('chai').expect;
const _ = require('lodash');
const allActivities = [
  'ACT-1',
  'ACT-2',
  'ACT-3',
  'ACT-4',
  'ACT-5',
  'ACT-6',
  'ACT-7',
  'ACT-8',
  'ACT-9',
  'ACT-10',
  'ACT-11',
  'ACT-12',
  'ACT-13',
  'ACT-14',
  'ACT-15',
  'ACT-16',
  'ACT-17',
  'ACT-18',
  'ACT-19',
];

describe('activity group mapper', () => {
  [
    {
      version: 'a',
      group: 'GRP-1',
      expectedActivities: [
        'ACT-7',
        'ACT-11',
        'ACT-9',
        'ACT-3',
      ],
      expectedCount: 4,
    },
    {
      version: 'b',
      group: 'GRP-1',
      expectedActivities: [
        'ACT-7',
        'ACT-11',
        'ACT-9',
        'ACT-3',
      ],
      expectedCount: 4,
    },
    {
      version: 'a',
      group: 'GRP-2',
      expectedActivities: [
        'ACT-10',
        'ACT-19',
        'ACT-17',
        'ACT-18',
        'ACT-1',
        'ACT-2',
      ],
      expectedCount: 6,
    },
    {
      version: 'b',
      group: 'GRP-2',
      expectedActivities: [
        'ACT-10',
        'ACT-19',
        'ACT-17',
        'ACT-18',
        'ACT-1',
        'ACT-2',
      ],
      expectedCount: 6,
    },
    {
      version: 'a',
      group: 'GRP-3',
      expectedActivities: [
        'ACT-13',
        'ACT-14',
        'ACT-19',
        'ACT-6',
      ],
      expectedCount: 4,
    },
    {
      version: 'b',
      group: 'GRP-3',
      expectedActivities: [
        'ACT-13',
        'ACT-14',
        'ACT-19',
        'ACT-6',
      ],
      expectedCount: 4,
    },
    {
      version: 'a',
      group: 'GRP-4',
      expectedActivities: [
        'ACT-4',
        'ACT-19',
        'ACT-18',
        'ACT-6',
        'ACT-16',
        'ACT-2',
        'ACT-5',
      ],
      expectedCount: 7,
    },
    {
      version: 'b',
      group: 'GRP-4',
      expectedActivities: [
        'ACT-4',
        'ACT-19',
        'ACT-18',
        'ACT-6',
        'ACT-16',
        'ACT-2',
        'ACT-5',
      ],
      expectedCount: 7,
    },
    {
      version: 'a',
      group: 'GRP-5',
      expectedActivities: [
        'ACT-16',
        'ACT-18',
        'ACT-7',
        'ACT-11',
        'ACT-2',
        'ACT-13',
      ],
      expectedCount: 6,
    },
    {
      version: 'b',
      group: 'GRP-5',
      expectedActivities: [
        'ACT-16',
        'ACT-18',
        'ACT-7',
        'ACT-11',
        'ACT-2',
        'ACT-13',
      ],
      expectedCount: 6,
    },
    {
      version: 'a',
      group: 'GRP-6',
      expectedActivities: [
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
      expectedCount: 17,
    },
    {
      version: 'b',
      group: 'GRP-6',
      expectedActivities: [
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
      expectedCount: 17,
    },
  ].forEach(scenario => {
    it(`should get activities for version ${scenario.version} and group ${scenario.group}`, () => {
      const activitiesForGroup = underTest.getActivitiesForGroup(scenario.version, scenario.group);
      expect(activitiesForGroup).to.eql(scenario.expectedActivities);
      expect(_.uniq(activitiesForGroup).length).to.equals(activitiesForGroup.length);
    });
    it(`should get activities for version ${scenario.version} and group ${scenario.group}`, () => {
      const activitiesForGroup = underTest.getActivitiesForGroup(scenario.version, scenario.group);
      expect(activitiesForGroup).to.eql(scenario.expectedActivities);
      expect(_.uniq(activitiesForGroup).length).to.equals(activitiesForGroup.length);
    });
    it(`should get count of activities for version ${scenario.version} and group ${scenario.group}`,
      () => {
        const count = underTest.getCountOfActivitiesForGroup(scenario.version, scenario.group);
        expect(count).to.eql(scenario.expectedCount);
      });
    it(`should get count of activities for version ${scenario.version} and group ${scenario.group}`,
      () => {
        const count = underTest.getCountOfActivitiesForGroup(scenario.version, scenario.group);
        expect(count).to.eql(scenario.expectedCount);
      });
  });

  ['GRP-1', 'GRP-2', 'GRP-3', 'GRP-4', 'GRP-5', 'GRP-6'].forEach(group => {
    it(`should get all activities for version c and group ${group}`, () => {
      const activitiesForGroup = underTest.getActivitiesForGroup('c', group);
      expect(activitiesForGroup).to.eql(allActivities);
      expect(_.uniq(activitiesForGroup).length).to.eql(activitiesForGroup.length);
    });
  });
  ['GRP-1', 'GRP-2', 'GRP-3', 'GRP-4', 'GRP-5', 'GRP-6'].forEach(group => {
    it(`should get count of activities for version c and group ${group}`, () => {
      const count = underTest.getCountOfActivitiesForGroup('c', group);
      expect(count).to.eql(19);
    });
  });
  it('should get a filter activities for version a and group GRP-1', () => {
    const activitiesForGroup = underTest.getActivitiesForGroup('a', 'GRP-1', ['ACT-7']);
    expect(activitiesForGroup).to.eql(['ACT-11', 'ACT-9', 'ACT-3']);
  });
  it('should not filter activities if no common entries found for version a and group GRP-1',
    () => {
      const activitiesForGroup = underTest.getActivitiesForGroup('a', 'GRP-1', ['ACT-1']);
      expect(activitiesForGroup).to.eql(['ACT-7', 'ACT-11', 'ACT-9', 'ACT-3']);
    });
  it('should get activities as an empty array if all needs to be excluded for ' +
    'version a and group GRP-1', () => {
    const activitiesForGroup =
      underTest.getActivitiesForGroup('a', 'GRP-1', ['ACT-7', 'ACT-11', 'ACT-9', 'ACT-3']);
    expect(activitiesForGroup).to.eql([]);
  });
});
