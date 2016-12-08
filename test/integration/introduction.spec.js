const helper = require('./support/integrationSpecHelper');
const introductionPage = helper.introductionPage;
const googleTagManagerHelper = helper.googleTagManagerHelper;

const expect = require('chai').expect;
const uuid = require('uuid');

describe('Introduction page', () => {
  const accountId = uuid.v4();
  const uuidRegEx = '[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
  const entryPointRegEx = `${uuidRegEx}/introduction`;

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
          .to.equal(`/${accountId}/unsorted-activities`))
    );
  });

  describe('entry point', () => {
    it('should be redirected to intro page with an accountId if entry from root path', () =>
      introductionPage.visitBasePath()
        .then(() => expect(introductionPage.browserPath()).to.match(new RegExp(entryPointRegEx)))
    );
  });
});
