const helper = require('./support/integrationSpecHelper');
const pageUnderTest = helper.chosenActivitiesPage;
const googleTagManagerHelper = helper.googleTagManagerHelper;
const allActivites = helper.allActivities;

const { expect } = require('chai');
const uuid = require('uuid');

const accountId = uuid.v4();

describe('chosen activities page', () => {
  describe('page outline', () => {
    ['a', 'b'].forEach((version) => {
      before(() =>
        helper.cleanDb()
          .then(() => helper.saveAllActivitiesAsSorted(accountId))
          .then(() => pageUnderTest.visit('c', accountId))
      );

      it(`should have correct title for version ${version}`, () =>
        pageUnderTest.visit(version, accountId, 'GRP-3').then(() =>
          expect(pageUnderTest.getTitle()).to.equal('Choose your activities')
        )
      );

      it(`should have correct heading for version ${version}`, () =>
        pageUnderTest.visit(version, accountId, 'GRP-3').then(() => {
          const heading = pageUnderTest.getHeading();
          expect(heading.headingText).to.equal('Your chosen activities');
          expect(heading.subHeadingText).to.equal('Get better at my applications and interviews');
        })
      );

      it(`should contain valid google tag manager data for version ${version}`, () =>
        pageUnderTest.visit(version, accountId, 'GRP-3').then(() =>
          expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId)
        )
      );
    });

    // it(`should have back button for version ${version}`, () =>
    //   pageUnderTest.visit(version, accountId).then(() =>
    //     expect(pageUnderTest.backButtonDisplayed()).to.equal(true)
    //   ));
  });

  describe('categories contents', () => {
    ['a', 'b'].forEach((version) => {
      it(`should include all categories in contents ${version}`, () =>
        helper.cleanDb()
          .then(() => helper.addSortedActivities(accountId, [
            { activity: allActivites[0].name, category: 'READY' },
            { activity: allActivites[1].name, category: 'HELP' },
            { activity: allActivites[2].name, category: 'DOING' },
            { activity: allActivites[3].name, category: 'NOT-SUITABLE' },
          ])).then(() =>
          pageUnderTest.visit(version, accountId, 'GRP-6').then(() =>
            expect(pageUnderTest.getCategoryContentsTextAsList()).to.length(4)
          ))
      );

      it(`should link to other category in contents ${version}`, () =>
        helper.cleanDb()
          .then(() => helper.addSortedActivities(accountId, [
            { activity: allActivites[0].name, category: 'READY' },
            { activity: allActivites[1].name, category: 'HELP' },
            { activity: allActivites[2].name, category: 'DOING' },
            { activity: allActivites[3].name, category: 'NOT-SUITABLE' },
          ])).then(() =>
          pageUnderTest.visit(version, accountId, 'GRP-6').then(() =>
            pageUnderTest.clickContentsLinkForCategory('NOT-SUITABLE').then(() =>
              expect(pageUnderTest.getCategoryHeading()).to.eql('It doesn\'t suit me')
            )
          ))
      );

      it('should not display category with no activities in contents', () =>
        helper.cleanDb()
          .then(() => helper.addSortedActivities(accountId, [
            { activity: allActivites[0].name, category: 'READY' },
            { activity: allActivites[1].name, category: 'HELP' },
            { activity: allActivites[2].name, category: 'DOING' },
          ])).then(() =>
          pageUnderTest.visit(version, accountId, 'GRP-6').then(() =>
            expect(pageUnderTest.getCategoryContentsTextAsList()).to.length(3)
          ))
      );

      it('currently selected category should not be a link while all others should be', () =>
        helper.cleanDb()
          .then(() => helper.addSortedActivities(accountId, [
            { activity: allActivites[0].name, category: 'READY' },
            { activity: allActivites[1].name, category: 'HELP' },
            { activity: allActivites[2].name, category: 'DOING' },
            { activity: allActivites[3].name, category: 'NOT-SUITABLE' },
          ])).then(() =>
          pageUnderTest.visitWithCategory(version, accountId, 'GRP-6', 'HELP').then(() => {
            const categories = pageUnderTest.getCategoryContentsTextAsList();
            expect(categories).to.length(4);
            const helpCategoryContentsText = categories[1];
            expect(helpCategoryContentsText).to.equal('I\'d like help trying this (1 activity)');
            const readyCategoryContentsText = categories[0];
            expect(readyCategoryContentsText).to
              .equal('<a>I\'m ready to try this (1 activity)</a>');
            const doingCategoryContentsText = categories[2];
            expect(doingCategoryContentsText).to
              .equal('<a>I\'m already doing this (1 activity)</a>');
            const notSuitableCategoryContentsText = categories[3];
            expect(notSuitableCategoryContentsText).to
              .equal('<a>It doesn\'t suit me (1 activity)</a>');
          }))
      );

      it('number of activites should be correctly reported', () =>
        helper.cleanDb()
          .then(() => helper.addSortedActivities(accountId, [
            { activity: allActivites[0].name, category: 'READY' },
            { activity: allActivites[1].name, category: 'HELP' },
            { activity: allActivites[2].name, category: 'HELP' },
            { activity: allActivites[3].name, category: 'DOING' },
            { activity: allActivites[4].name, category: 'DOING' },
            { activity: allActivites[5].name, category: 'DOING' },
            { activity: allActivites[6].name, category: 'NOT-SUITABLE' },
          ])).then(() =>
          pageUnderTest.visitWithCategory(version, accountId, 'GRP-6', 'HELP').then(() => {
            const categories = pageUnderTest.getCategoryContentsTextAsList();
            expect(categories).to.length(4);
            const helpCategoryContentsText = categories[1];
            expect(helpCategoryContentsText).to.equal('I\'d like help trying this (2 activities)');
            const readyCategoryContentsText = categories[0];
            expect(readyCategoryContentsText).to
              .equal('<a>I\'m ready to try this (1 activity)</a>');
            const doingCategoryContentsText = categories[2];
            expect(doingCategoryContentsText).to
              .equal('<a>I\'m already doing this (3 activities)</a>');
            const notSuitableCategoryContentsText = categories[3];
            expect(notSuitableCategoryContentsText).to
              .equal('<a>It doesn\'t suit me (1 activity)</a>');
          }))
      );
    });
  });
});
