const express = require('express');
const router = new express.Router({ mergeParams: true });
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

function mapCategories(categoryView, currentCategoryPromise, chosenActivities) {
  return Promise.resolve(currentCategoryPromise).then(function (currentCategory) {
    return categoryView.categories.map(category => {
      if (category.name === currentCategory) {
        Object.assign(category, { isSelectedCategory: true });
      }
      chosenActivities.then(categories => {
        const activitiesForCategory = categories[category.name];
        if (activitiesForCategory) {
          Object.assign(category, { numActivities: activitiesForCategory.length });
        }
      });
      return category;
    });
  });
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
  const mappedCategories = mapCategories(categoryView, currentCategory, chosenActivities);

  Promise.resolve(mappedCategories).then(function (categories) {
    res.render('chosen-activities', Object.assign({ accountId },
      new ChosenActivitiesViewModel(categories)));
  });
});

module.exports = router;
