const SortedActivitiesBasePage = require('./sorted-activities-base-page');
const expect = require('chai').expect;

class ReSortActivitiesPage extends SortedActivitiesBasePage {

  visit(accountId) {
    return this.browser.visit(`${this.basePath}/c/${accountId}/activities/sorted/resort`);
  }

  clickMoveButton(activity) {
    return this.browser.click(`[data-test="activity-${activity.name}-move"]`);
  }

  clickFinishSortingButton() {
    return this.browser.click('[data-test="action-on-resort"]');
  }

  expectAt(accountId) {
    expect(this.browserPath()).to
      .equal(`${this.basePath}/c/${accountId}/activities/sorted/resort`);
  }
}

module.exports = ReSortActivitiesPage;
