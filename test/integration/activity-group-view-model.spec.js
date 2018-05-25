// eslint-disable-next-line no-unused-vars
const helper = require('./support/integrationSpecHelper');
const UnderTest = require('../../app/controllers/activity-group-view-model');
const activityGroup = require('../../app/models/activity-group');

const expect = require('chai').expect;
const expectedResult = [
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

describe('activity group view model', () => {
  it('should get all groups and related info', () => {
    const underTest = new UnderTest(activityGroup);
    expect(underTest.activityGroups).to.eql(expectedResult);
  });
});
