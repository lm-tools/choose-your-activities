const SortedActivitiesBasePage = require('./sorted-activities-base-page');
const expect = require('chai').expect;

class SortedActivitiesPage extends SortedActivitiesBasePage {

  visit(accountId) {
    return this.browser.visit(`/${accountId}/activities/sorted`);
  }

  clickReSortActivitiesLink() {
    return this.browser.click('[data-test="re-sort-link"]');
  }

  expectAt(accountId) {
    expect(this.browserPath()).to.equal(`/${accountId}/activities/sorted`);
  }

}

module.exports = SortedActivitiesPage;
