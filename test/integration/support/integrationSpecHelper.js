const Zombie = require('zombie');
Zombie.site = 'http://localhost:3000';
const browser = new Zombie();
const dbHelper = require('./db-helper');
const screenshots = require('./screenshots');
const GoogleTagManagerHelper = require('../../common/page_objects/google-tag-manager-helper');

const IntroductionPage = require('../../common/page_objects/introduction-page');
const UnsortedActivitiesPage = require('../../common/page_objects/unsorted-activities-page');

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
  },
  dbHelper
);

