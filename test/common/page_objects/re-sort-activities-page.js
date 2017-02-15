const SortedActivitiesBasePage = require('./sorted-activities-base-page');
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
}

module.exports = ReSortActivitiesPage;
