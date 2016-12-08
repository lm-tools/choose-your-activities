const helper = require('./support/integrationSpecHelper');
const sortedActivitiesPage = helper.sortedActivitiesPage;
const googleTagManagerHelper = helper.googleTagManagerHelper;
const expect = require('chai').expect;
const uuid = require('uuid');

describe('Sorted activities page', () => {
  const accountId = uuid.v4();

  describe('page outline', () => {
    beforeEach(() => sortedActivitiesPage.visit(accountId));

    it('should have correct title', () =>
        expect(sortedActivitiesPage.browser.text('title'))
          .to.equal('Choose your activities')
    );

    it('should contain valid google tag manager data', () =>
        expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId)
    );

    [
      "I'm already doing this",
      "I'm ready to try this",
      "I'd like help trying this",
      "This hasn't worked",
      'Not really for me',
    ].forEach(s => {
      it(`should display category header "${s}"`, () =>
        expect(sortedActivitiesPage.activityCategories()).to.include(s)
      );
    });
  });

  describe('empty state', () => {
    beforeEach(() =>
      helper.cleanDb()
        .then(() => sortedActivitiesPage.visit(accountId))
    );

    it('should not display any activities', () =>
      expect(sortedActivitiesPage.activityList().length).to.equal(0)
    );
  });
});
