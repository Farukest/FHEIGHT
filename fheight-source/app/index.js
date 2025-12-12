/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */

// ethers.js global export (for contract interactions)
const ethers = require('ethers');
window.ethers = ethers;

// localization setup
const whenLocalizationReady = require('app/localization/index');

whenLocalizationReady.then(function(){
  let app;
  const i18next = require('i18next');
  return app = require('./application');
});