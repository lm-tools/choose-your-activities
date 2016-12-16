const helper = require('./support/integrationSpecHelper');
const googleTagManagerHelper = helper.googleTagManagerHelper;
const pageUnderTest = helper.activityDetailsPage;

const expect = require('chai').expect;
const uuid = require('uuid');

describe('Activity details', () => {
  const accountId = uuid.v4();

  describe('page outline', () => {
    beforeEach(() => pageUnderTest.visit(accountId, helper.allActivities[10]));

    it('should have correct title', () =>
      expect(pageUnderTest.browser.text('title'))
        .to.equal('Choose your activities')
    );

    it('should contain valid google tag manager data', () =>
      expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId)
    );

    it('should have back button', () =>
      pageUnderTest.clickBackButton().then(() =>
        expect(helper.sortedActivitiesPage.browserPath())
          .to.contain(`${accountId}/activities/sorted`))
    );
  });


  helper.allActivities.forEach(activity => {
    describe(`for "${activity.title}"`, () => {
      beforeEach(() => pageUnderTest.visit(accountId, activity));

      it('should display correct header', () =>
        expect(pageUnderTest.getTitle()).to.equal(activity.title)
      );

      it('should display details', () =>
        expect(pageUnderTest.getDetails()).not.to.be.empty
      );
    });
  });
});
