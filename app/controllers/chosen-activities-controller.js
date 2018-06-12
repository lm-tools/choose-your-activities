const express = require('express');
const router = new express.Router({ mergeParams: true });
const i18n = require('i18n');
const ActivitiesModel = require('../models/activity-model');
const ChosenActivitiesViewModel = require('./chosen-activities-view-model');
const CategoryView = require('./category-view-model');
const categoryMapping = require('./category-mapping');

function getCurrentCategory(categoryView, chosenActivities, selectedCategory) {
  let currentCategory;

  if (selectedCategory) {
    currentCategory = selectedCategory;
  } else {
    currentCategory = chosenActivities.then(categories => {
      const categoryToReturn = categoryView.categories.find(category => {
        const activitiesForCategory = categories[category.name];
        return !!activitiesForCategory;
      });
      return categoryToReturn.name;
    });
  }

  return currentCategory;
}

function assignActivities(categoryView, chosenActivities, version) {
  return chosenActivities.then(function (categories) {
    return categoryView.categories.map(category => {
      const activitiesForCategory = categories[category.name];

      if (activitiesForCategory) {
        activitiesForCategory.map(activity =>
          Object.assign(activity, {
            /* eslint-disable no-underscore-dangle */
            title: i18n.__(`activity.${activity.activity}.title`),
            details: i18n.__(`activity.${activity.activity}.details`),
          })
        );

        activitiesForCategory[activitiesForCategory.length - 1].last = true;

        Object.assign(category, { hasActivities: true });
        Object.assign(category, { numActivities: activitiesForCategory.length });
        Object.assign(category, { moreThanOneActivity: activitiesForCategory.length > 1 });
        Object.assign(category, { activities: activitiesForCategory });
        Object.assign(category, { version });
      }
      return category;
    });
  });
}

function mapCategories(categoryView, currentCategoryPromise, chosenActivities, appVersion) {
  return Promise.resolve(currentCategoryPromise).then(function (currentCategory) {
    return categoryView.categories.map(category => {
      if (category.name === currentCategory) {
        Object.assign(category, { isSelectedCategory: true });
      }
      return category;
    });
  }).then(assignActivities(categoryView, chosenActivities, appVersion));
}

router.get('', (req, res) => {
  const accountId = req.params.accountId;
  const group = req.params.group;
  const version = req.params.version;
  const selectedCategory = req.query.cat;

  const chosenActivities = ActivitiesModel.findSortedByAccountIdAndGroupByCategory(
    accountId, version, group);
  const categoryView = new CategoryView(categoryMapping(version));
  const currentCategory = getCurrentCategory(categoryView, chosenActivities, selectedCategory);
  const mappedCategories = mapCategories(categoryView, currentCategory, chosenActivities, version);

  Promise.resolve(mappedCategories).then(function (categories) {
    res.render('chosen-activities', Object.assign({ accountId },
      new ChosenActivitiesViewModel(categories)));
  });
});

module.exports = router;
