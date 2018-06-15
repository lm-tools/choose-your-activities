const express = require('express');
const router = new express.Router({ mergeParams: true });
const i18n = require('i18n');
const ActivitiesModel = require('../models/activity-model');
const ChosenActivitiesViewModel = require('../view-models/chosen-activities-view-model');
const CategoryView = require('../view-models/category-view-model');
const ActivityGroupView = require('../view-models/activity-group-view-model');

const categoryMapping = require('./category-mapping');
const resolveGroupTitle = require('../locales/activity-group-title-resolver');

const firstCategoryWithActivities = (categories, chosenActivities) =>
  categories
    .find(category => !!chosenActivities[category.name])
    .name;

const getCurrentCategory = (categoryView, chosenActivities, specifiedCategory) => {
  if (specifiedCategory && chosenActivities[specifiedCategory]) {
    return specifiedCategory;
  }

  return firstCategoryWithActivities(categoryView.categories, chosenActivities);
};

const markCurrentCategory = (currentCategory) => category =>
  Object.assign(category, { isSelectedCategory: category.name === currentCategory });

const addActivities = (chosenActivities, version) => category => {
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
};

router.get('', (req, res) => {
  const accountId = req.params.accountId;
  const group = req.params.group;
  const version = req.params.version;
  const specifiedCategory = req.query.cat;

  const categoryView = new CategoryView(categoryMapping(version));

  const activityGroupTitle = resolveGroupTitle(version, group);
  ActivitiesModel.findSortedByAccountIdAndGroupByCategory(accountId, version, group)
    .then(activities => {
      const currentCategory = getCurrentCategory(categoryView, activities, specifiedCategory);

      const categoriesWithChosenActivities = categoryView.categories
        .map(markCurrentCategory(currentCategory))
        .map(addActivities(activities, version));

      res.render('chosen-activities',
        Object.assign({ accountId, activityGroupTitle },
          new ChosenActivitiesViewModel(categoriesWithChosenActivities),
          new ActivityGroupView(version, group))
      );
    });
});

module.exports = router;
