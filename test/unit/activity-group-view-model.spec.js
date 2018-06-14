// eslint-disable-next-line no-unused-vars
const helper = require('../integration/support/integrationSpecHelper');
const UnderTest = require('../../app/view-models/activity-group-view-model');

const expect = require('chai').expect;

const scenarios =
  [
    {
      testCase: 'should get all groups and related info for version a',
      version: 'a',
      expectedResult: [
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
      ],
    },
    {
      testCase: 'should get all groups and related info for version b',
      version: 'b',
      expectedResult: [
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
      ],
    },
    {
      testCase: 'should filter the group given from the list',
      version: 'b',
      filterGroup: 'GRP-2',
      expectedResult: [
        {
          count: 5,
          name: 'GRP-1',
          title: 'Improve applications',
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
      ],
    },
  ];


describe('activity group view model', () => {
  scenarios.forEach(scenario => {
    it(scenario.testCase, () => {
      const underTest = scenario.filterGroup ? new UnderTest(scenario.version, scenario.filterGroup)
        : new UnderTest(scenario.version);
      expect(underTest.activityGroups).to.eql(scenario.expectedResult);
    });
  });
});
