const SortedActivitiesBasePage = require('./sorted-activities-base-page');
class SortedActivitiesPage extends SortedActivitiesBasePage {

  visit(accountId) {
    return this.browser.visit(`/${accountId}/activities/sorted`);
  }

  clickReSortActivitiesLink() {
    return this.browser.click('[data-test="re-sort-link"]');
  }

}

module.exports = SortedActivitiesPage;
