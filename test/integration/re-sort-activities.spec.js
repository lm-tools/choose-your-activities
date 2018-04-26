const helper = require('./support/integrationSpecHelper');
const allActivites = helper.allActivities;
const reSortActivitiesPage = helper.reSortActivitiesPage;
const googleTagManagerHelper = helper.googleTagManagerHelper;
const expect = require('chai').expect;
const uuid = require('uuid');

describe('Re-Sort activities page', () => {
  const accountId = uuid.v4();

  beforeEach(() =>
    helper.cleanDb()
      .then(() => reSortActivitiesPage.visit(accountId))
  );

  describe('Re-Sort page outline', () => {
    it('should have correct title', () =>
      expect(reSortActivitiesPage.browser.text('title'))
        .to.equal('Choose your activities')
    );

    it('should contain valid google tag manager data', () =>
      expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId)
    );

    helper.categories.map(x => x.title).forEach(s => {
      it(`should display category header "${s}"`, () =>
        expect(reSortActivitiesPage.activityCategories()).to.include(s)
      );
    });


    it('should link back to the sorted page from "Finish sorting" button', () =>
      reSortActivitiesPage.clickFinishSortingButton()
        .then(() => expect(reSortActivitiesPage.browserPath())
          .to.contain(`c/${accountId}/activities/sorted`))
    );

    it('should show navigation', () => {
      expect(reSortActivitiesPage.isNavigationDisplayed()).to.equal(true);
    });
  });

  describe('Re-Sort already sorted activities', () => {
    beforeEach(() =>
      helper.addSortedActivities(accountId, [
        { activity: allActivites[0].name, category: 'READY' },
        { activity: allActivites[1].name, category: 'READY' },
        { activity: allActivites[2].name, category: 'DOING' },
        { activity: allActivites[4].name, category: 'DOING' },
        { activity: allActivites[3].name, category: 'HELP' },
        { activity: allActivites[10].name, category: 'HELP' },
        { activity: allActivites[11].name, category: 'HELP' },
        { activity: allActivites[7].name, category: 'NOT-WORKED' },
        { activity: allActivites[15].name, category: 'NO' },
        { activity: allActivites[17].name, category: 'NO' },
      ])
        .then(() => reSortActivitiesPage.visit(accountId))
    );

    [
      {
        category: 'READY',
        expectedActivitiesTitles: [allActivites[0].title, allActivites[1].title],
      },
      {
        category: 'DOING',
        expectedActivitiesTitles: [allActivites[2].title, allActivites[4].title],
      },
      {
        category: 'HELP',
        expectedActivitiesTitles: [
          allActivites[3].title, allActivites[10].title, allActivites[11].title,
        ],
      },
      {
        category: 'NOT-WORKED',
        expectedActivitiesTitles: [allActivites[7].title],
      },
      {
        category: 'NO',
        expectedActivitiesTitles: [allActivites[15].title, allActivites[17].title],
      },
    ].forEach(s => {
      it(`should display list of activities in "${s.category}" category`, () =>
          expect(reSortActivitiesPage.getActivitiesInCategory(s.category))
            .to.eql(s.expectedActivitiesTitles)
      );

      it(`should not display empty message for "${s.category}" category`, () =>
        expect(reSortActivitiesPage.getCategoryDescription(s.category)).to.be.empty
      );
    });

    [
      {
        category: 'READY', activity: allActivites[0],
      },
      {
        category: 'DOING', activity: allActivites[2],
      },
      {
        category: 'HELP', activity: allActivites[10],
      },
      {
        category: 'NOT-WORKED', activity: allActivites[7],
      },
      {
        category: 'NO', activity: allActivites[15],
      },
    ].forEach(s => {
      it(`should link to categorise activity page for activity in "${s.category}"`, () =>
        reSortActivitiesPage.clickMoveButton(s.activity).then(() =>
          expect(helper.categoriseActivityPage.browserPath())
            .to.contain(`${accountId}/activities/${s.activity.name}/categorise`)
        )
      );

      it(`should display "Move" link for activity in category "${s.category}"`, () =>
        expect(reSortActivitiesPage.isMoveButtonDisplayed(s.activity)).to.equal(true)
      );

      it(`should link to resort page from details page for activity in ${s.category}`, () =>
        reSortActivitiesPage.clickDetailsButton(s.activity)
          .then(() => helper.activityDetailsPage.clickBackButton())
          .then(() => reSortActivitiesPage.expectAt(accountId))
      );
    });

    ['DOING', 'NOT-WORKED', 'NO'].forEach(s => {
      it(`should expand category "${s}" by default`, () =>
        expect(reSortActivitiesPage.isCategoryExpanded(s)).to.equal(true)
      );
    });
  });

  describe('all activities sorted', () => {
    beforeEach(() =>
      helper.cleanDb()
        .then(() => helper.saveAllActivitiesAsSorted(accountId))
        .then(() => reSortActivitiesPage.visit(accountId))
    );

    it('should hide navigation', () => {
      expect(reSortActivitiesPage.isNavigationDisplayed()).to.equal(false);
    });
  });
});
