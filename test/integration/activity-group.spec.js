const helper = require('./support/integrationSpecHelper');
const pageUnderTest = helper.activityGroupPage;
const googleTagManagerHelper = helper.googleTagManagerHelper;

const expect = require('chai').expect;
const uuid = require('uuid');

const expectedResult = [
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
];

describe('activity group view model', () => {
  const accountId = uuid.v4();

  before(() => pageUnderTest.visit('a', accountId));

  it('should have correct title', () =>
    expect(pageUnderTest.browser.text('title')).to.equal('Choose your activities')
  );

  it('should contain valid google tag manager data', () =>
    expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId)
  );

  it('should have back button', () =>
    expect(pageUnderTest.backButtonDisplayed()).to.equal(true)
  );

  it('should get all groups and related info', () => {
    expect(pageUnderTest.groupList()).to.eql(expectedResult);
  });
});
