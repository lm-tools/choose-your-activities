const SortedActivitiesBasePage = require('./sorted-activities-base-page');
const expect = require('chai').expect;

class ReSortActivitiesPage extends SortedActivitiesBasePage {

  visit(accountId) {
    return this.browser.visit(`/${accountId}/activities/sorted/resort`);
  }

  clickMoveButton(activity) {
    return this.browser.click(`[data-test="activity-${activity.name}-move"]`);
  }

  clickFinishSortingButton() {
    return this.browser.click('[data-test="finish-sorting-button"]');
  }

  expectAt(accountId) {
    expect(this.browserPath()).to.equal(`/${accountId}/activities/sorted/resort`);
  }
}

module.exports = ReSortActivitiesPage;
