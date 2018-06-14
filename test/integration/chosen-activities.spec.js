const helper = require('./support/integrationSpecHelper');
const pageUnderTest = helper.chosenActivitiesPage;
const { googleTagManagerHelper, allActivities } = helper;

const { expect } = require('chai');
const uuid = require('uuid');

const accountId = uuid.v4();

const sortActivityAtIndex = (index, category) =>
  ({ activity: allActivities[index].name, category });

describe('chosen activities page', () => {
  describe('page outline', () => {
    ['a', 'b'].forEach((version) => {
      before((done) =>
        helper.cleanDb()
          .then(() => helper.saveAllActivitiesAsSorted(accountId))
          .then(() => pageUnderTest.visit(version, accountId, 'GRP-3'))
          .then(() => done())
      );

      it(`should have correct title for version ${version}`, () =>
        expect(pageUnderTest.getTitle()).to.equal('Choose your activities')
      );


      it(`should have correct heading for version ${version}`, () => {
        expect(pageUnderTest.getHeading().headingText).to.equal('Your chosen activities');
      });

      it(`should contain valid google tag manager data for version ${version}`, () =>
        expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId)
      );

      it(`should have back button for version ${version}`, () =>
        expect(pageUnderTest.backButtonDisplayed()).to.equal(true)
      );
    });
  });

  describe('page sub heading', () => {
    before(() =>
      helper.cleanDb()
        .then(() => helper.saveAllActivitiesAsSorted(accountId))
    );

    [
      { group: 'GRP-3', subheading: 'Improve how I search online for work' },
      { group: 'GRP-4', subheading: 'Find the right kind of job for me' },
    ].forEach(({ group, subheading }) =>
      it(`should have correct subheading for group ${group} for version a`, () =>
        pageUnderTest.visit('a', accountId, group).then(() =>
          expect(pageUnderTest.getHeading().subHeadingText).to.equal(subheading)
        )
      )
    );

    [
      { group: 'GRP-3', subheading: 'Use the web better' },
      { group: 'GRP-4', subheading: 'Find the right job' },
    ].forEach(({ group, subheading }) =>
      it(`should have correct subheading for group ${group} for version b`, () =>
        pageUnderTest.visit('b', accountId, group).then(() =>
          expect(pageUnderTest.getHeading().subHeadingText).to.equal(subheading)
        )
      )
    );
  });

  describe('categories contents', () => {
    beforeEach(() =>
      helper.cleanDb().then(() =>
        helper.addSortedActivities(accountId, [
          sortActivityAtIndex(0, 'READY'),
          sortActivityAtIndex(1, 'HELP'),
          sortActivityAtIndex(2, 'DOING'),
          sortActivityAtIndex(3, 'NOT-SUITABLE'),
        ])
      )
    );

    ['a', 'b'].forEach((version) => {
      it(`should link to other category in contents ${version}`, () =>
        pageUnderTest.visit(version, accountId, 'GRP-6').then(() =>
          pageUnderTest.clickContentsLinkForCategory('NOT-SUITABLE').then(() =>
            expect(pageUnderTest.getCategoryHeading()).to.eql('It doesn\'t suit me')
          )
        )
      );

      it(`should include all categories in contents ${version}`, () =>
        pageUnderTest.visit(version, accountId, 'GRP-6').then(() =>
          expect(pageUnderTest.getCategoryContentsTextAsList()).to.length(4)
        )
      );

      it('should not display category with no activities in contents', () =>
        helper.cleanDb().then(() =>
          helper.addSortedActivities(accountId, [
            sortActivityAtIndex(0, 'READY'),
            sortActivityAtIndex(1, 'HELP'),
            sortActivityAtIndex(2, 'DOING'),
          ])
        ).then(() =>
          pageUnderTest.visit(version, accountId, 'GRP-6').then(() =>
            expect(pageUnderTest.getCategoryContentsTextAsList()).to.length(3)
          )
        )
      );

      it('currently selected category should not be a link while all others should be', () =>
        pageUnderTest.visitWithCategory(version, accountId, 'GRP-6', 'HELP').then(() => {
          const categories = pageUnderTest.getCategoryContentsTextAsList();
          const selectedCategory = categories.filter(x => !x.isLink);
          const linkedCategories = categories.filter(x => x.isLink);

          expect(selectedCategory).to.length(1);
          expect(selectedCategory[0].text).to.eql('I\'d like help trying this (1 activity)');
          expect(linkedCategories).to.length(3);
        })
      );

      it('number of activites should be correctly reported', () =>
        helper.cleanDb().then(() =>
          helper.addSortedActivities(accountId, [
            sortActivityAtIndex(0, 'READY'),
            sortActivityAtIndex(1, 'HELP'),
            sortActivityAtIndex(2, 'HELP'),
            sortActivityAtIndex(3, 'DOING'),
            sortActivityAtIndex(4, 'DOING'),
            sortActivityAtIndex(5, 'DOING'),
            sortActivityAtIndex(6, 'NOT-SUITABLE'),
          ])
        ).then(() =>
          pageUnderTest.visitWithCategory(version, accountId, 'GRP-6', 'HELP').then(() => {
            const categories = pageUnderTest.getCategoryContentsTextAsList();
            const [help, ready, doing, notSuitable] = categories;

            expect(categories).to.length(4);
            expect(ready.activityCount).to.equal(1);
            expect(help.activityCount).to.equal(2);
            expect(doing.activityCount).to.equal(3);
            expect(notSuitable.activityCount).to.equal(1);
          })
        )
      );
    });
  });
});
