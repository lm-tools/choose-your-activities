const versionedAssets = require('../../dist/public/rev-manifest.json');

module.exports = ({ assetPath }) => (
  {
    css: {
      screen: [
        `${assetPath}${versionedAssets['stylesheets/style.css']}`,
      ],
      print: [
        `${assetPath}${versionedAssets['stylesheets/print.css']}`,
      ],
    },
    js: [
      `${assetPath}${versionedAssets['js/jquery.min.js']}`,
      `${assetPath}${versionedAssets['js/selection-buttons.js']}`,
      `${assetPath}${versionedAssets['js/main.js']}`,
    ],
  }
);
