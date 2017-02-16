const helper = require('./support/integrationSpecHelper');
const introductionPage = helper.introductionPage;
const googleTagManagerHelper = helper.googleTagManagerHelper;

const expect = require('chai').expect;
const uuid = require('uuid');

describe('Introduction page', () => {
  const accountId = uuid.v4();

  describe('page outline', () => {
    it('should have correct title', () =>
      introductionPage.visit(accountId)
        .then(() => expect(introductionPage.browser.text('title'))
          .to.equal('Choose your activities'))
    );

    it('should contain valid google tag manager data', () =>
      introductionPage.visit(accountId)
        .then(() => expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId))
    );

    it('should link to the unsorted activities page', () =>
      introductionPage.visit(accountId)
        .then(() => introductionPage.clickContinue())
        .then(() => expect(introductionPage.browserPath())
          .to.equal(`/${accountId}/activities/unsorted`))
    );
  });
});
