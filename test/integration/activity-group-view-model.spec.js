// eslint-disable-next-line no-unused-vars
const helper = require('./support/integrationSpecHelper');
const UnderTest = require('../../app/controllers/activity-group-view-model');
const activityGroup = require('../../app/models/activity-group');

const expect = require('chai').expect;

const expectedResultForVersionA = [
  {
    count: 5,
    name: 'GRP-1',
    title: 'Get better at my applications and interviews',
  },
  {
    count: 6,
    name: 'GRP-2',
    title: 'Improve my skills and qualifications',
  },
  {
    count: 4,
    name: 'GRP-3',
    title: 'Improve how I search online for work',
  },
  {
    count: 7,
    name: 'GRP-4',
    title: 'Find the right kind of job for me',
  },
  {
    count: 6,
    name: 'GRP-5',
    title: 'Give myself some confidence',
  },
  {
    count: 17,
    name: 'GRP-6',
    title: 'I don\'t know where to start',
  },
];
const expectedResultForVersionB = [
  {
    count: 5,
    name: 'GRP-1',
    title: 'Improve applications',
  },
  {
    count: 6,
    name: 'GRP-2',
    title: 'Gain skills',
  },
  {
    count: 4,
    name: 'GRP-3',
    title: 'Use the web better',
  },
  {
    count: 7,
    name: 'GRP-4',
    title: 'Find the right job',
  },
  {
    count: 6,
    name: 'GRP-5',
    title: 'Get quick ideas',
  },
  {
    count: 17,
    name: 'GRP-6',
    title: 'Everything',
  },
];

describe('activity group view model', () => {
  it('should get all groups and related info for version a', () => {
    const underTest = new UnderTest(activityGroup, 'a');
    expect(underTest.activityGroups).to.eql(expectedResultForVersionA);
  });

  it('should get all groups and related info for version b', () => {
    const underTest = new UnderTest(activityGroup, 'b');
    expect(underTest.activityGroups).to.eql(expectedResultForVersionB);
  });
});
