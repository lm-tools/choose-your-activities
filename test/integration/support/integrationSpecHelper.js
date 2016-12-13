const Zombie = require('zombie');
Zombie.site = 'http://localhost:3000';
const browser = new Zombie();
const dbHelper = require('./db-helper');
const testActivitiesModel = require('./test-activites-model');
const screenshots = require('./screenshots');
const GoogleTagManagerHelper = require('../../common/page_objects/google-tag-manager-helper');

const IntroductionPage = require('../../common/page_objects/introduction-page');
const UnsortedActivitiesPage = require('../../common/page_objects/unsorted-activities-page');
const SortedActivitiesPage = require('../../common/page_objects/sorted-activities-page');
const CategoriseActivityPage = require('../../common/page_objects/categorise-activity-page');

process.env.GOOGLE_TAG_MANAGER_ID = 'fake-id';
require('../../../bin/www'); // This starts the web server, and ensures it is only
                          // started once. It is a misuse of "require", and
                          // should be improved.

afterEach(function () {
  if (this.currentTest.state === 'failed') {
    screenshots.takeScreenshot(this.currentTest, browser);
  }
});

module.exports = Object.assign(
  {
    browser,
    googleTagManagerHelper: new GoogleTagManagerHelper(browser),
    introductionPage: new IntroductionPage(browser),
    unsortedActivitiesPage: new UnsortedActivitiesPage(browser),
    sortedActivitiesPage: new SortedActivitiesPage(browser),
    categoriseActivityPage: new CategoriseActivityPage(browser),
  },
  dbHelper,
  { allActivities: testActivitiesModel }
);

