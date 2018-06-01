const helper = require('./support/integrationSpecHelper');
const googleTagManagerHelper = helper.googleTagManagerHelper;
const cookiePage = helper.cookiePage;
const expect = require('chai').expect;
const uuid = require('uuid');

describe('Cookie page', () => {
  const accountId = uuid.v4();

  before(() =>
    cookiePage.visit(accountId)
  );

  it('should contain valid google tag manager data', () =>
    expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId)
  );

  it('displays govuk general cookie info', () =>
    expect(cookiePage.isDisplayed()).to.equal(true)
  );

  describe('Without account id', () => {
    before(() =>
      cookiePage.visit()
    );

    it('displays govuk general cookie info', () => {
      expect(cookiePage.isDisplayed()).to.equal(true);
    });
  });
});
