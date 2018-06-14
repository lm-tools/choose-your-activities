const express = require('express');
const router = new express.Router({ mergeParams: true });
const i18n = require('i18n');
const ActivitiesModel = require('../models/activity-model');
const ChosenActivitiesViewModel = require('./chosen-activities-view-model');
const CategoryView = require('../view-models/category-view-model');
const ActivityGroupView = require('../view-models/activity-group-view-model');

const categoryMapping = require('./category-mapping');
const resolveGroupTitle = require('../locales/activity-group-title-resolver');

function getCurrentCategory(categoryView, chosenActivities, selectedCategory) {
  let currentCategory;

  if (selectedCategory) {
    currentCategory = selectedCategory;
  } else {
    const categoryToReturn = categoryView.categories.find(category =>
      !!chosenActivities[category.name]
    );
    return categoryToReturn.name;
  }

  return currentCategory;
}

function assignActivities(categoryView, chosenActivities, version) {
  return categoryView.categories.map(category => {
    const activitiesForCategory = chosenActivities[category.name];

    if (!activitiesForCategory) {
      return category;
    }

    activitiesForCategory.map(activity =>
      Object.assign(activity, {
        /* eslint-disable no-underscore-dangle */
        title: i18n.__(`activity.${activity.activity}.title`),
        details: i18n.__(`activity.${activity.activity}.details`),
      })
    );

    activitiesForCategory[activitiesForCategory.length - 1].last = true;

    Object.assign(category, {
      hasActivities: true,
      numActivities: activitiesForCategory.length,
      moreThanOneActivity: activitiesForCategory.length > 1,
      activities: activitiesForCategory,
      version,
    });

    return category;
  });
}

function mapCategories(categoryView, currentCategory) {
  return categoryView.categories.map(category =>
    Object.assign(category, { isSelectedCategory: category.name === currentCategory })
  );
}

router.get('', (req, res) => {
  const accountId = req.params.accountId;
  const group = req.params.group;
  const version = req.params.version;
  const selectedCategory = req.query.cat;

  const categoryView = new CategoryView(categoryMapping(version));

  const activityGroupTitle = resolveGroupTitle(version, group);
  ActivitiesModel.findSortedByAccountIdAndGroupByCategory(accountId, version, group)
    .then(activitiesSortedByAccountId => {
      const currentCategory = getCurrentCategory(categoryView, activitiesSortedByAccountId,
        selectedCategory);
      const mappedCategories = mapCategories(categoryView, currentCategory,
        activitiesSortedByAccountId, version);
      assignActivities(categoryView, activitiesSortedByAccountId, version);
      res.render('chosen-activities',
        Object.assign({ accountId, activityGroupTitle },
          new ChosenActivitiesViewModel(mappedCategories),
          new ActivityGroupView(version, group))
      );
    });
});

module.exports = router;
