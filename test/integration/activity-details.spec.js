const helper = require('./support/integrationSpecHelper');
const googleTagManagerHelper = helper.googleTagManagerHelper;
const pageUnderTest = helper.activityDetailsPage;

const expect = require('chai').expect;
const uuid = require('uuid');

describe('Activity details', () => {
  const accountId = uuid.v4();

  describe('page outline', () => {
    before(() => pageUnderTest.visit(accountId, helper.allActivities[10]));

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

    describe('activityId validation', () => {
      before(() =>
        pageUnderTest.visit(accountId, 'ACT-')
          .catch(() => {})
      );

      it('shows 400 message ', () => {
        expect(helper.errorPage.getMessage()).to.equal('Bad request');
      });

      it('returns 400 code', () =>
        expect(helper.browser.response.status).to.equal(400)
      );
    });
  });


  helper.allActivities.forEach(activity => {
    describe(`for "${activity.title}"`, () => {
      before(() => pageUnderTest.visit(accountId, activity));

      it('should display correct header', () =>
        expect(pageUnderTest.getTitle()).to.equal(activity.title)
      );

      it('should display details', () =>
        expect(pageUnderTest.getDetails()).not.to.be.empty
      );
    });
  });
});
