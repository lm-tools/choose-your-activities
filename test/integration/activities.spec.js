const helper = require('./support/integrationSpecHelper');
const activitiesPage = helper.activitiesPage;
const chosenActivitiesPage = helper.chosenActivitiesPage;
const googleTagManagerHelper = helper.googleTagManagerHelper;

const expect = require('chai').expect;
const uuid = require('uuid');

const sortActivityAtIndex = (index, category) =>
  ({ activity: helper.allActivities[index].name, category });

describe('Activities page', () => {
  const accountId = uuid.v4();
  const group = 'GRP-1';

  ['a', 'b'].forEach(version => {
    describe(`page outline for version ${version}`, () => {
      before(done =>
        helper.cleanDb()
          .then(() => activitiesPage.visit(version, accountId, group))
          .then(done())
      );

      it('should have correct title', () =>
        activitiesPage.visit(version, accountId, group)
          .then(() => expect(activitiesPage.browser.text('title')).to
            .equal('Choose your activities'))
      );

      it('should contain valid google tag manager data', () =>
        activitiesPage.visit(version, accountId, group)
          .then(() => expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId))
      );

      it('should have back button', () =>
        expect(activitiesPage.backButtonDisplayed()).to.equal(true)
      );
    });
    describe(`activities list for version ${version}`, () => {
      before(() =>
        helper.cleanDb()
          .then(() => helper.addSortedActivities(accountId, [
            sortActivityAtIndex(6, 'READY'),
            sortActivityAtIndex(10, 'HELP'),
          ]))
          .then(() => activitiesPage.visit(version, accountId, group))
      );

      it('should display correct number of unsorted activities', () =>
        expect(activitiesPage.unCategorisedActivitiesList().length).to.equal(3)
      );

      describe('all activities are sorted', () => {
        before(() =>
          helper.cleanDb()
            .then(() => helper.addSortedActivities(accountId, [
              sortActivityAtIndex(2, 'HELP'),
              sortActivityAtIndex(6, 'READY'),
              sortActivityAtIndex(7, 'HELP'),
              sortActivityAtIndex(8, 'READY'),
              sortActivityAtIndex(10, 'HELP'),
            ]))
            .then(() => activitiesPage.visit(version, accountId, group))
        );

        it('should redirect to the chosen activities page if all activities are sorted', () =>
          expect(chosenActivitiesPage.getHeading().headingText).to.eql('Your chosen activities')
        );
      });

      it('should display correct title for unsorted activities', () => {
        const actvitiesList = activitiesPage.unCategorisedActivitiesList();
        expect(actvitiesList[0].title).to.equal(helper.allActivities[8].title);
        expect(actvitiesList[1].title).to.equal(helper.allActivities[7].title);
        expect(actvitiesList[2].title).to.equal(helper.allActivities[2].title);
      });

      it('should have correct url for activity', () =>
        expect(activitiesPage.unCategorisedActivitiesList()[0].href).to
          .contain(
            // eslint-disable-next-line max-len
            `/${version}/${accountId}/groups/${group}/activities/${helper.allActivities[8].name}/categorise`)
      );

      it('should display the correct number of activities remaining', () =>
        expect(activitiesPage.unCategorisedActivitiesCount()).to
          .contain('3 activities you can do')
      );

      it('should display all the categorised activities in smart answers section', () => {
        const categorisedActivitiesList = activitiesPage.categorisedActivitiesList();
        expect(categorisedActivitiesList.length).to.equal(2);
        expect(categorisedActivitiesList[0].title).to.equal(helper.allActivities[6].title);
        expect(categorisedActivitiesList[1].title).to.equal(helper.allActivities[10].title);
      });

      it('should have correct url for categorised activity', () => {
        expect(activitiesPage.categorisedActivitiesList()[0].href).to
          .contain(
            // eslint-disable-next-line max-len
            `/${version}/${accountId}/groups/${group}/activities/${helper.allActivities[6].name}/categorise`);

        expect(activitiesPage.categorisedActivitiesList()[1].href).to
          .contain(
            // eslint-disable-next-line max-len
            `/${version}/${accountId}/groups/${group}/activities/${helper.allActivities[10].name}/categorise`);
      });

      [
        { activityName: helper.allActivities[6].name, category: 'READY' },
        { activityName: helper.allActivities[10].name, category: 'HELP' },
      ].forEach((scenario) => {
        it(`should list ${scenario.activityName} under ${scenario.category} category`, () =>
          expect(activitiesPage.isActivityUnderCategoryDisplayed(scenario.category,
            scenario.activityName)).to.be.true
        );
      });
    });
  });
});
