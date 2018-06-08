const helper = require('./support/integrationSpecHelper');
const pageUnderTest = helper.activityGroupPage;
const googleTagManagerHelper = helper.googleTagManagerHelper;

const expect = require('chai').expect;
const uuid = require('uuid');

const accountId = uuid.v4();

describe('activity group', () => {
  [
    {
      version: 'a',
      expectedResult: [
        {
          count: '5 activities',
          title: 'Get better at my applications and interviews',
        },
        {
          count: '6 activities',
          title: 'Improve my skills and qualifications',
        },
        {
          count: '4 activities',
          title: 'Improve how I search online for work',
        },
        {
          count: '7 activities',
          title: 'Find the right kind of job for me',
        },
        {
          count: '6 activities',
          title: 'Give myself some confidence',
        },
        {
          count: '17 activities',
          title: 'I don\'t know where to start',
        },
      ],
    },
    {
      version: 'b',
      expectedResult: [
        {
          count: '5 things to do',
          title: 'Improve applications',
        },
        {
          count: '6 things to do',
          title: 'Gain skills',
        },
        {
          count: '4 things to do',
          title: 'Use the web better',
        },
        {
          count: '7 things to do',
          title: 'Find the right job',
        },
        {
          count: '6 things to do',
          title: 'Get quick ideas',
        },
        {
          count: '17 things to do',
          title: 'Everything',
        },
      ],
    },
  ].forEach((scenario) => {
    it(`should have correct title for version ${scenario.version}`, () =>
      pageUnderTest.visit(scenario.version, accountId).then(() =>
        expect(pageUnderTest.browser.text('title')).to.equal('Choose your activities')
      ));

    it(`should contain valid google tag manager data for version ${scenario.version}`, () =>
      pageUnderTest.visit(scenario.version, accountId).then(() =>
        expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId)
      ));

    it(`should have back button for version ${scenario.version}`, () =>
      pageUnderTest.visit(scenario.version, accountId).then(() =>
        expect(pageUnderTest.backButtonDisplayed()).to.equal(true)
      ));

    it(`should get all groups and related info for version ${scenario.version}`, () =>
      pageUnderTest.visit(scenario.version, accountId).then(() =>
        expect(pageUnderTest.groupList()).to.eql(scenario.expectedResult)
      ));
  });
})
;
